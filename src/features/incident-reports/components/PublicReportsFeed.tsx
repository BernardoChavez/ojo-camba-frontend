import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Car,
  LightbulbOff,
  Construction,
  Trees,
  Signpost,
  Skull,
  Eye,
  Pill,
  Users,
  Camera,
  ThumbsUp,
  ExternalLink,
  X,
  PlusCircle,
  Clock,
  Sparkles,
  Radio,
} from 'lucide-react';
import { reportService } from '../services/report.service.ts';
import { IncidentReportResponse, IncidentCategory } from '../types/report.types.ts';
import { useApp } from '@/core/store/AppContext.tsx';
import { SombreroSao } from '@/shared/components/SombreroSao.tsx';

// Category icon & color mapping
function getCategoryMeta(cat: IncidentCategory) {
  switch (cat) {
    case 'CALLE_SIN_ILUMINACION':
      return { label: 'Calle a Oscuras', icon: LightbulbOff, color: 'text-purple-700 bg-purple-50 border-purple-200' };
    case 'BACHE_VIAL':
      return { label: 'Bache Vial', icon: Construction, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'PARQUE_DESCUIDADO':
      return { label: 'Parque Descuidado', icon: Trees, color: 'text-[#0d592c] bg-emerald-50 border-emerald-200' };
    case 'MALA_SENALIZACION':
      return { label: 'Falta Señalización', icon: Signpost, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
    case 'ZONA_PANDILLAS':
      return { label: 'Pandillas', icon: Skull, color: 'text-red-700 bg-red-50 border-red-200' };
    case 'ASALTO_MANO_ARMADA':
      return { label: 'Asalto Armado', icon: ShieldAlert, color: 'text-rose-700 bg-rose-50 border-rose-200' };
    case 'ROBO':
      return { label: 'Robo / Arrebato', icon: AlertTriangle, color: 'text-orange-700 bg-orange-50 border-orange-200' };
    case 'ACCIDENTE_TRANSITO':
      return { label: 'Siniestro Vial', icon: Car, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' };
    case 'DISTURBIO_CALLEJERO':
      return { label: 'Disturbio', icon: Users, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'VENTA_DROGAS':
      return { label: 'Microtráfico', icon: Pill, color: 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200' };
    case 'SOSPECHOSO':
      return { label: 'Sospechoso', icon: Eye, color: 'text-blue-700 bg-blue-50 border-blue-200' };
    default:
      return { label: 'Alerta Vecinal', icon: Radio, color: 'text-slate-700 bg-slate-50 border-slate-200' };
  }
}

export const PublicReportsFeed: React.FC = () => {
  const { setActiveCoords, setReportModalOpen, refreshTrigger } = useApp();

  const [reports, setReports] = useState<IncidentReportResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [selectedZone, setSelectedZone] = useState<string>('TODAS');
  const [selectedAnillo, setSelectedAnillo] = useState<string>('TODOS');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyWithPhoto, setOnlyWithPhoto] = useState<boolean>(false);

  // Active Photo Modal
  const [inspectPhoto, setInspectPhoto] = useState<{ url: string; title: string; zone: string } | null>(null);

  // Confirmation handling
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Load all reports
  useEffect(() => {
    setLoading(true);
    reportService
      .getAllReports()
      .then((data) => setReports(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  // Unique Neighborhoods extraction for filter dropdown
  const uniqueZones = useMemo(() => {
    const set = new Set<string>();
    reports.forEach((r) => {
      if (r.neighborhood) {
        // Normalize zone names
        const base = r.neighborhood.split('-')[0].trim();
        set.add(base);
      }
    });
    return Array.from(set).sort();
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Zone filter
      if (selectedZone !== 'TODAS') {
        if (!r.neighborhood?.toLowerCase().includes(selectedZone.toLowerCase())) {
          return false;
        }
      }

      // Anillo filter
      if (selectedAnillo !== 'TODOS') {
        if (r.anillo?.toString() !== selectedAnillo) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'TODAS') {
        if (r.category !== selectedCategory) {
          return false;
        }
      }

      // Only with photo filter
      if (onlyWithPhoto) {
        if (!r.photo_url && !r.photo_base64) {
          return false;
        }
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title?.toLowerCase().includes(query);
        const matchesDesc = r.description?.toLowerCase().includes(query);
        const matchesZone = r.neighborhood?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesZone) {
          return false;
        }
      }

      return true;
    });
  }, [reports, selectedZone, selectedAnillo, selectedCategory, searchQuery, onlyWithPhoto]);

  // Handle community corroboration
  const handleConfirm = async (reportId: string) => {
    try {
      setConfirmingId(reportId);
      const res = await reportService.confirmReport(reportId);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, confirmations_count: res.confirmations_count, status: 'VERIFICADO' }
            : r
        )
      );
    } catch (e) {
      console.error('Error confirming report:', e);
    } finally {
      setConfirmingId(null);
    }
  };

  // Navigate to map and focus coords
  const handleViewOnMap = (lat: number, lng: number) => {
    setActiveCoords([lat, lng]);
    const mapSection = document.getElementById('probar-app');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="reportes-comunitarios" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Lightbox Modal for Photo Inspection */}
      {inspectPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setInspectPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0d592c]" />
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {inspectPhoto.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setInspectPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-black/5 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={inspectPhoto.url}
                alt={inspectPhoto.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
            <div className="p-4 bg-white flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[#0d592c] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {inspectPhoto.zone}
              </span>
              <span>Evidencia ciudadana autenticada</span>
            </div>
          </div>
        </div>
      )}

      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[#0d592c] rounded-full text-xs font-bold mb-2.5">
            <SombreroSao className="w-4 h-4" />
            <span>Módulo Público de Transparencia Vecinal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d592c] tracking-tight">
            Reportes Ciudadanos por Zonas
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Explora todas las alertas registradas con evidencias fotográficas, ubicación exacta y estado de corroboración comunitaria en Santa Cruz de la Sierra.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="self-start md:self-auto inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-full shadow-lg shadow-red-900/15 transition-all active:scale-95 text-xs sm:text-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Reportar en mi zona</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 mb-8">
        {/* Top search & photo toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por calle, título o descripción (ej: El Mechero, La Ramada, bache...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0d592c] focus:ring-1 focus:ring-[#0d592c] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Solo con Foto */}
          <button
            type="button"
            onClick={() => setOnlyWithPhoto(!onlyWithPhoto)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              onlyWithPhoto
                ? 'bg-emerald-50 border-[#0d592c] text-[#0d592c] shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4 text-[#58b947]" />
            <span>Solo con foto</span>
            {onlyWithPhoto && <CheckCircle2 className="w-3.5 h-3.5 text-[#0d592c]" />}
          </button>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Zona / Barrio */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Zona o Barrio:
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0d592c] cursor-pointer"
            >
              <option value="TODAS">Todas las Zonas (Santa Cruz)</option>
              {uniqueZones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Anillo */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Anillo de la Ciudad:
            </label>
            <select
              value={selectedAnillo}
              onChange={(e) => setSelectedAnillo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0d592c] cursor-pointer"
            >
              <option value="TODOS">Todos los Anillos</option>
              <option value="1">1er Anillo (Casco Viejo)</option>
              <option value="2">2do Anillo</option>
              <option value="3">3er Anillo</option>
              <option value="4">4to Anillo</option>
              <option value="5">5to Anillo</option>
              <option value="6">6to Anillo</option>
              <option value="7">7mo Anillo</option>
              <option value="8">8vo Anillo en adelante</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Categoría de Alerta:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0d592c] cursor-pointer"
            >
              <option value="TODAS">Todas las Categorías</option>
              <option value="ASALTO_MANO_ARMADA">Asalto a Mano Armada</option>
              <option value="ROBO">Robo / Arrebato</option>
              <option value="ACCIDENTE_TRANSITO">Siniestro Vial / Choque</option>
              <option value="CALLE_SIN_ILUMINACION">Calle sin Iluminación</option>
              <option value="BACHE_VIAL">Baches en Calzada</option>
              <option value="PARQUE_DESCUIDADO">Parque Descuidado</option>
              <option value="ZONA_PANDILLAS">Zona de Pandillas</option>
              <option value="MALA_SENALIZACION">Mala Señalización</option>
              <option value="DISTURBIO_CALLEJERO">Disturbio Callejero</option>
              <option value="SOSPECHOSO">Personas Sospechosas</option>
            </select>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {(selectedZone !== 'TODAS' || selectedAnillo !== 'TODOS' || selectedCategory !== 'TODAS' || searchQuery || onlyWithPhoto) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Filtros activos:</span>
            {selectedZone !== 'TODAS' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0d592c] border border-emerald-200 font-semibold">
                Zona: {selectedZone}
                <button type="button" onClick={() => setSelectedZone('TODAS')} className="hover:text-red-500">×</button>
              </span>
            )}
            {selectedAnillo !== 'TODOS' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0d592c] border border-emerald-200 font-semibold">
                {selectedAnillo}to Anillo
                <button type="button" onClick={() => setSelectedAnillo('TODOS')} className="hover:text-red-500">×</button>
              </span>
            )}
            {selectedCategory !== 'TODAS' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0d592c] border border-emerald-200 font-semibold">
                {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory('TODAS')} className="hover:text-red-500">×</button>
              </span>
            )}
            {onlyWithPhoto && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0d592c] border border-emerald-200 font-semibold">
                Con foto
                <button type="button" onClick={() => setOnlyWithPhoto(false)} className="hover:text-red-500">×</button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedZone('TODAS');
                setSelectedAnillo('TODOS');
                setSelectedCategory('TODAS');
                setSearchQuery('');
                setOnlyWithPhoto(false);
              }}
              className="text-red-600 hover:underline font-bold ml-auto text-[11px]"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Reports Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <span>
          Mostrando <strong className="text-slate-800">{filteredReports.length}</strong> de {reports.length} reportes comunitarios
        </span>
        <span className="text-slate-400">
          Actualizado en tiempo real
        </span>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0d592c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Cargando reportes de Santa Cruz...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No se encontraron reportes en esta zona o filtro
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Intenta cambiar los filtros de búsqueda o sé el primero en reportar un incidente en esta área.
          </p>
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="mt-3 px-5 py-2 bg-[#0d592c] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#0a4622] transition-colors"
          >
            Publicar reporte ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const meta = getCategoryMeta(report.category);
            const Icon = meta.icon;
            const photo = report.photo_url || report.photo_base64;

            return (
              <article
                key={report.id}
                className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo Header (if photo exists) */}
                {photo ? (
                  <div
                    className="relative w-full h-48 bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() =>
                      setInspectPhoto({
                        url: photo,
                        title: report.title,
                        zone: report.neighborhood || 'Santa Cruz',
                      })
                    }
                  >
                    <img
                      src={photo}
                      alt={report.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-md">
                      <Camera className="w-3 h-3 text-[#58b947]" />
                      <span>Evidencia fotográfica</span>
                    </div>

                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>Ver foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-3 bg-gradient-to-r from-emerald-100 via-slate-100 to-emerald-50" />
                )}

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{meta.label}</span>
                      </span>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          report.severity === 'CRITICO'
                            ? 'bg-red-100 text-red-700'
                            : report.severity === 'ALTO'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-[#0d592c]'
                        }`}
                      >
                        {report.severity}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-base text-slate-800 leading-snug group-hover:text-[#0d592c] transition-colors">
                      {report.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>

                    {/* AI Triaje Insight */}
                    {report.ai_triage?.short_summary && (
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-[11px] text-slate-700 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-[#0d592c] text-[10px]">
                          <Sparkles className="w-3 h-3 text-[#58b947]" />
                          <span>Centinela SCZ:</span>
                        </div>
                        <p className="italic text-slate-600">
                          "{report.ai_triage.short_summary}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Meta & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Location & Time */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-[#0d592c]">
                        <MapPin className="w-3.5 h-3.5 text-[#58b947]" />
                        <span>{report.neighborhood}</span>
                        {report.anillo && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({report.anillo}to Anillo)
                          </span>
                        )}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Actions: Corroborate & View on Map */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        type="button"
                        disabled={confirmingId === report.id}
                        onClick={() => handleConfirm(report.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 hover:text-[#0d592c] border border-slate-200 text-xs font-bold text-slate-700 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-[#58b947]" />
                        <span>
                          {confirmingId === report.id
                            ? '...'
                            : `${report.confirmations_count} vecinos`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleViewOnMap(report.latitude, report.longitude)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0d592c] hover:bg-[#0a4622] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Ver en mapa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
