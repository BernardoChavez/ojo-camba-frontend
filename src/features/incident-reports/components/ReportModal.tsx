import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  AlertOctagon,
  Car,
  Pill,
  Users,
  Eye,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  LightbulbOff,
  Trees,
  Construction,
  Signpost,
  Skull,
  LocateFixed,
  RefreshCw,
  Camera,
  Upload,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/core/store/AppContext.tsx';
import { reportService } from '../services/report.service.ts';
import { IncidentCategory, IncidentReportCreate } from '../types/report.types.ts';
import { getAnonymousFingerprint } from '@/core/utils/fingerprint.ts';
import { SombreroSao } from '@/shared/components/SombreroSao.tsx';

const CATEGORIES: {
  id: IncidentCategory;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}[] = [
  {
    id: 'CALLE_SIN_ILUMINACION',
    label: 'Calle sin Iluminación',
    description: 'Focos quemados, tramos a oscuras y postes caídos',
    icon: LightbulbOff,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    id: 'BACHE_VIAL',
    label: 'Baches sin Arreglar',
    description: 'Cráteres en calzada, asfalto destruido o hundimientos',
    icon: Construction,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    id: 'PARQUE_DESCUIDADO',
    label: 'Parque Descuidado',
    description: 'Pasto crecido, juegos dañados, basura y abandono',
    icon: Trees,
    color: 'text-[#0d592c] bg-emerald-50 border-emerald-200',
  },
  {
    id: 'MALA_SENALIZACION',
    label: 'Mala Señalización',
    description: 'Semáforos rotos, falta de señal de PARE o cruces ciegos',
    icon: Signpost,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  },
  {
    id: 'ZONA_PANDILLAS',
    label: 'Zona de Pandillas',
    description: 'Grupos organizados, amenazas territoriales y riñas',
    icon: Skull,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    id: 'ASALTO_MANO_ARMADA',
    label: 'Asalto a Mano Armada',
    description: 'Atraco con arma de fuego o arma blanca',
    icon: ShieldAlert,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  {
    id: 'ROBO',
    label: 'Robo / Arrebato',
    description: 'Arranchón de teléfono, descuido o hurto',
    icon: AlertOctagon,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  {
    id: 'ACCIDENTE_TRANSITO',
    label: 'Siniestro Vial / Choque',
    description: 'Colisiones, atropellos o bloqueos por impacto',
    icon: Car,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    id: 'DISTURBIO_CALLEJERO',
    label: 'Disturbio Callejero',
    description: 'Grescas, piedras y botellas en la vía pública',
    icon: Users,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    id: 'VENTA_DROGAS',
    label: 'Microtráfico / Drogas',
    description: 'Comercialización ilegal en esquinas o plazas',
    icon: Pill,
    color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200',
  },
  {
    id: 'SOSPECHOSO',
    label: 'Personas Sospechosas',
    description: 'Sujetos vigilando vehículos o merodeando viviendas',
    icon: Eye,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
];

const FAST_CHIPS = [
  'Calle a oscuras con luminarias quemadas',
  'Bache profundo con riesgo de rotura de llanta',
  'Pasto crecido y falta de luz en el parque',
  'Sin semáforo ni señal de PARE en esquina ciega',
  'Grupo de pandilleros intimidando esquinas',
  'Motochorros rondando sin placa',
  'Arma de fuego visible',
  'Arrancharon celular a transeúnte en la parada',
  'Micro de línea dobló en exceso de velocidad',
  'Colisión vehicular con heridos en la calzada',
];

export const ReportModal: React.FC = () => {
  const {
    reportModalOpen,
    setReportModalOpen,
    activeCoords,
    setActiveCoords,
    triggerRefresh,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<IncidentCategory>('CALLE_SIN_ILUMINACION');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('Plan 3000');
  const [anillo, setAnillo] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  // Photo & Camera State
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Automatic Device Location Detection State
  const [locatingGps, setLocatingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string>('Obteniendo ubicación del dispositivo...');
  const [gpsAccurate, setGpsAccurate] = useState<boolean>(false);

  // Auto-fetch device GPS immediately upon modal opening
  const fetchDeviceLocation = () => {
    if ('geolocation' in navigator) {
      setLocatingGps(true);
      setGpsStatus('Sincronizando satélites GPS del dispositivo...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setActiveCoords([lat, lng]);
          setLocatingGps(false);
          setGpsAccurate(true);
          setGpsStatus(
            `GPS fijado: ${lat.toFixed(5)}, ${lng.toFixed(5)} (±${Math.round(pos.coords.accuracy)}m)`
          );
        },
        (err) => {
          console.warn('Geolocation warning or timeout:', err);
          setLocatingGps(false);
          setGpsAccurate(false);
          setGpsStatus('Ubicación fijada por el cuadrante activo del radar');
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        }
      );
    } else {
      setGpsStatus('Geolocalización no soportada por el navegador; usando radar');
    }
  };

  useEffect(() => {
    if (reportModalOpen) {
      fetchDeviceLocation();
    } else {
      stopLiveCamera();
    }
    return () => {
      stopLiveCamera();
    };
  }, [reportModalOpen]);

  // Clean-up camera stream
  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start live webcam / mobile camera stream
  const startLiveCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        // Fallback directly to native camera input
        cameraInputRef.current?.click();
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.warn('Live camera stream not supported or denied, falling back to native file input:', err);
      cameraInputRef.current?.click();
    }
  };

  // Capture photo from active live video stream
  const capturePhotoFromCamera = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;
      const maxDim = 1200;
      let width = vw;
      let height = vh;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoBase64(dataUrl);
        setPhotoFileName(`foto-camara-${Date.now().toString().slice(-4)}.jpg`);
      }
    }
    stopLiveCamera();
  };

  // Handle upload of file or mobile camera capture
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setPhotoBase64(compressed);
          setPhotoFileName(file.name || 'foto-evidencia.jpg');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input so user can choose same file again if desired
    e.target.value = '';
  };

  if (!reportModalOpen) return null;

  const handleChipClick = (chip: string) => {
    setDescription((prev) => (prev ? `${prev}. ${chip}` : chip));
    if (!title) {
      setTitle(chip);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const alias = await getAnonymousFingerprint();
      const payload: IncidentReportCreate = {
        title: title || `Alerta de ${category.replace(/_/g, ' ')}`,
        description: description || 'Alerta vecinal registrada con evidencia georreferenciada.',
        category,
        latitude: activeCoords[0],
        longitude: activeCoords[1],
        neighborhood,
        anillo,
        reporter_alias: alias,
        photo_base64: photoBase64 || undefined,
        photo_url: photoBase64 || undefined,
      };

      const res = await reportService.createReport(payload);
      setSuccessResult(res);
      triggerRefresh();
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    stopLiveCamera();
    setReportModalOpen(false);
    setStep(1);
    setTitle('');
    setDescription('');
    setPhotoBase64(null);
    setPhotoFileName('');
    setSuccessResult(null);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      {/* Hidden inputs for File Upload and Native Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Institucional Santa Cruz */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-emerald-200 text-[#0d592c] flex items-center justify-center shadow-xs">
              <SombreroSao className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#0d592c]">
                Reporte Vecinal Ciudadano
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Paso {step} de 3 — Santa Cruz de la Sierra
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Automatic Device GPS Banner */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  gpsAccurate ? 'bg-[#58b947]' : 'bg-cyan-500'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  gpsAccurate ? 'bg-[#0d592c]' : 'bg-cyan-600'
                }`}
              />
            </span>
            <LocateFixed
              className={`w-4 h-4 flex-shrink-0 ${
                locatingGps ? 'animate-spin text-cyan-600' : 'text-[#0d592c]'
              }`}
            />
            <span className="text-[11px] text-slate-600 font-mono truncate">
              {gpsStatus}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchDeviceLocation}
            title="Volver a leer coordenadas del dispositivo"
            className="flex items-center gap-1 text-[11px] text-[#0d592c] hover:text-[#0a4622] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs flex-shrink-0 transition-all active:scale-95 ml-2"
          >
            <RefreshCw className={`w-3 h-3 ${locatingGps ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {successResult ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-[#0d592c] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0d592c]">
                  ¡Reporte Registrado con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Tu reporte ha sido indexado con coordenadas exactas de Santa Cruz. Los vecinos y los módulos de patrullaje ya lo pueden ver en el radar.
                </p>
              </div>

              {/* Photo preview in success if attached */}
              {photoBase64 && (
                <div className="max-w-xs mx-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
                  <img
                    src={photoBase64}
                    alt="Evidencia adjunta"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">
                    Foto de evidencia transmitida con éxito
                  </span>
                </div>
              )}

              {successResult.ai_triage?.short_summary && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-left text-xs space-y-1.5 mt-3">
                  <div className="flex items-center gap-1.5 text-[#0d592c] font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-[#58b947]" />
                    <span>Triaje Centinela SCZ:</span>
                  </div>
                  <p className="text-slate-700 font-medium">"{successResult.ai_triage.short_summary}"</p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Despacho asignado: <span className="text-[#0d592c] font-bold">{successResult.ai_triage.dispatch_entity}</span>
                  </p>
                  {successResult.ai_triage.preventive_tip && (
                    <p className="text-[11px] text-[#0d592c] italic bg-white p-2 rounded-xl border border-emerald-200/60 mt-1">
                      Consejo: {successResult.ai_triage.preventive_tip}
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-7 py-3 bg-gradient-to-r from-[#0d592c] to-[#1a7f45] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-emerald-900/15 transition-all"
              >
                Volver al Radar
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: CATEGORY SELECTION */}
              {step === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700">
                      Selecciona la categoría del incidente:
                    </p>
                    <span className="text-[11px] text-[#0d592c] font-mono font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {CATEGORIES.length} Tipos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      const isSelected = category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCategory(c.id)}
                          className={`p-3 rounded-2xl border flex items-start gap-3 text-left transition-all ${
                            isSelected
                              ? 'border-[#0d592c] bg-emerald-50/70 text-[#0d592c] shadow-sm ring-2 ring-[#0d592c]/20'
                              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span className={`p-2 rounded-xl border mt-0.5 flex-shrink-0 ${c.color}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold block truncate text-slate-800">
                              {c.label}
                            </span>
                            <span className="text-[11px] text-slate-500 block line-clamp-1 leading-snug">
                              {c.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: DETAILS, FAST CHIPS & PHOTO EVIDENCE */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Título breve del reporte:
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Calle sin luz con bache profundo en la esquina"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0d592c] focus:ring-1 focus:ring-[#0d592c]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Descripción de lo que ocurre:
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Indica qué ocurrió, señas del peligro, vehículos, pandillas o daños..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0d592c] focus:ring-1 focus:ring-[#0d592c] resize-none"
                    />
                  </div>

                  {/* Chips rápidos de asistencia cruceña */}
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">
                      Chips rápidos de descripción:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {FAST_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleChipClick(chip)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-[#0d592c] border border-slate-200 text-[11px] text-slate-600 rounded-lg transition-all text-left"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECCIÓN DE FOTO DE EVIDENCIA (Subir foto o Tomar foto) */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#0d592c]" />
                        <span className="text-xs font-bold text-[#0d592c]">
                          Foto de Evidencia (Opcional)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                        Galería o Cámara
                      </span>
                    </div>

                    {/* Visor de Cámara en Vivo si está activa */}
                    {cameraActive && (
                      <div className="space-y-3 animate-fadeIn">
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#0d592c]">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white rounded text-[10px] font-mono flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Cámara en vivo
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={capturePhotoFromCamera}
                            className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2 transition-all active:scale-95"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Capturar Foto</span>
                          </button>
                          <button
                            type="button"
                            onClick={stopLiveCamera}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-full transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Si no hay cámara activa y no hay foto subida */}
                    {!cameraActive && !photoBase64 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Opción 1: Subir foto desde archivos/galería */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 bg-white hover:bg-slate-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#0d592c] shadow-2xs transition-all active:scale-95 group"
                        >
                          <Upload className="w-4 h-4 text-[#58b947] group-hover:-translate-y-0.5 transition-transform" />
                          <span>Subir foto de galería</span>
                        </button>

                        {/* Opción 2: Tomar foto en el momento */}
                        <button
                          type="button"
                          onClick={startLiveCamera}
                          className="p-3 bg-[#0d592c] hover:bg-[#0a4622] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition-all active:scale-95 group"
                        >
                          <Camera className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                          <span>Tomar foto ahora</span>
                        </button>
                      </div>
                    )}

                    {/* Previsualización de la foto seleccionada */}
                    {!cameraActive && photoBase64 && (
                      <div className="bg-white border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={photoBase64}
                            alt="Vista previa"
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {photoFileName || 'Foto capturada'}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#58b947]" />
                              Evidencia lista para enviar
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={startLiveCamera}
                            title="Volver a tomar foto con cámara"
                            className="p-2 text-slate-600 hover:text-[#0d592c] hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            title="Cambiar foto de galería"
                            className="p-2 text-slate-600 hover:text-[#0d592c] hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoBase64(null);
                              setPhotoFileName('');
                            }}
                            title="Eliminar foto"
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: GPS & LOCAL SECTOR */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Automated GPS Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d592c]">
                        <MapPin className="w-4 h-4 text-[#58b947]" />
                        <span>Punto GPS georreferenciado:</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {gpsAccurate ? 'GPS Dispositivo' : 'Cuadrante Radar'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-800">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-sans font-bold">LAT:</span>
                        <span className="font-bold text-[#0d592c]">{activeCoords[0].toFixed(5)}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] font-sans font-bold">LNG:</span>
                        <span className="font-bold text-[#0d592c]">{activeCoords[1].toFixed(5)}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      La posición se asignó automáticamente con el GPS de tu dispositivo para Santa Cruz de la Sierra.
                    </p>
                  </div>

                  {/* Resumen del reporte antes de enviar */}
                  <div className="p-3.5 bg-white border border-emerald-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Categoría:</span>
                      <span className="font-bold text-[#0d592c]">{category.replace(/_/g, ' ')}</span>
                    </div>
                    {title && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Título:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[200px]">{title}</span>
                      </div>
                    )}
                    {photoBase64 && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-medium">Evidencia fotográfica:</span>
                        <span className="text-[#0d592c] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#58b947]" />
                          Foto adjunta
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Barrio / Zona:
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Plan 3000, Equipetrol, etc."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#0d592c]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Anillo:
                      </label>
                      <select
                        value={anillo}
                        onChange={(e) => setAnillo(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#0d592c]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => (
                          <option key={a} value={a}>
                            {a}to Anillo
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        {!successResult && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0d592c] to-[#1a7f45] hover:opacity-95 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-md shadow-emerald-900/15 transition-all active:scale-95"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-full flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitiendo Alerta...' : 'Publicar Alerta Vecinal'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
