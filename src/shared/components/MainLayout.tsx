import React from 'react';
import {
  MapPin,
  Megaphone,
  Shield,
  Radio,
  PlusCircle,
  Bot,
  Flame,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Compass,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { TopNavbar } from './TopNavbar.tsx';
import { SombreroSao } from './SombreroSao.tsx';
import { RadarMap } from '@/features/map-radar/components/RadarMap.tsx';
import { PatrolSidebar } from '@/features/patrol-command/components/PatrolSidebar.tsx';
import { ReportModal } from '@/features/incident-reports/components/ReportModal.tsx';
import { ChatDrawer } from '@/features/ai-assistant/components/ChatDrawer.tsx';
import { useApp } from '@/core/store/AppContext.tsx';

export const MainLayout: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    timeSlot,
    setTimeSlot,
    stats,
    activeCoords,
    openReportAtCoords,
  } = useApp();

  const handleOpenReportNow = () => {
    openReportAtCoords(activeCoords[0], activeCoords[1]);
  };

  return (
    <div className="min-h-screen w-full bg-[#f7faf7] text-slate-800 flex flex-col font-sans selection:bg-[#58b947] selection:text-white">
      {/* 1. Navbar Oficial Blanco & Verde */}
      <TopNavbar />

      {/* 2. Hero Section: Estilo Institucional Santa Cruz (Blanco y Verde Fresco) */}
      <section className="relative w-full bg-gradient-to-b from-[#d5ebd7] via-[#ebf6ec] to-[#f7faf7] border-b border-emerald-100/80 px-4 sm:px-6 lg:px-8 pt-8 pb-16 overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Typography Two-Tone Verde */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag oficial de Santa Cruz con Sombrero de Saó */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-sm border border-emerald-200/80 rounded-full shadow-xs">
              <SombreroSao className="w-5 h-5" />
              <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-[#0d592c]">
                Santa Cruz de la Sierra · Seguridad Vecinal
              </span>
            </div>

            {/* Gran Título en Dos Tonos de Verde (Exacto a la imagen de referencia) */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.03] tracking-tight">
              <span className="text-[#0d592c] block">TU BARRIO,</span>
              <span className="text-[#58b947] block">PROTEGIDO</span>
              <span className="text-[#58b947] block">POR TODOS</span>
              <span className="text-[#0d592c] block">LOS VECINOS.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
              Inicia una nueva forma de prevención comunitaria con tecnología, transparencia vecinal y datos geoespaciales en tiempo real. Cerca de los vecinos, abierta a Santa Cruz de la Sierra.
            </p>

            {/* Botones de Acción Estilo Píldora (Gobernación) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#probar-app"
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#0d592c] to-[#1a7f45] hover:from-[#0a4622] hover:to-[#146637] text-white font-bold rounded-full shadow-lg shadow-emerald-900/15 transition-all active:scale-95 text-sm sm:text-base group"
              >
                <MapPin className="w-5 h-5 text-emerald-300" />
                <span>Abrir mapa interactivo</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={handleOpenReportNow}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#b91c1c] text-white font-bold rounded-full shadow-lg shadow-red-900/15 transition-all active:scale-95 text-sm sm:text-base group"
              >
                <Megaphone className="w-5 h-5 text-red-200" />
                <span>Reportar incidente ahora</span>
                <ArrowRight className="w-4 h-4 text-red-200 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Tarjeta Institucional Santa Cruz Ahora Mismo */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md border border-emerald-100 rounded-[2.5rem] p-6 sm:p-7 shadow-2xl relative">
              {/* Encabezado con fecha estilo Gobernación */}
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <SombreroSao className="w-6 h-6" />
                  <div>
                    <h3 className="text-[#0d592c] font-black text-base sm:text-lg tracking-tight">
                      Santa Cruz ahora mismo
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Monitoreo activo de cuadrantes y anillos
                    </p>
                  </div>
                </div>

                <div className="bg-slate-100/90 border border-slate-200 text-[#0d592c] px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#58b947] animate-pulse" />
                  <span>En vivo</span>
                </div>
              </div>

              {/* 3 Contadores Limpios y Claros */}
              <div className="grid grid-cols-3 gap-3">
                {/* Zonas Rojas */}
                <div className="bg-red-50 border border-red-200/80 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-1">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className="text-3xl font-black text-red-600 block leading-tight font-mono">
                    {stats.redCount || 6}
                  </span>
                  <span className="text-[11px] font-bold text-red-700">
                    Zonas rojas
                  </span>
                </div>

                {/* Zonas Amarillas */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-1">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="text-3xl font-black text-amber-600 block leading-tight font-mono">
                    {stats.yellowCount || 2}
                  </span>
                  <span className="text-[11px] font-bold text-amber-700">
                    Amarillas
                  </span>
                </div>

                {/* Zonas Verdes */}
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-3xl font-black text-[#0d592c] block leading-tight font-mono">
                    {stats.greenCount || 0}
                  </span>
                  <span className="text-[11px] font-bold text-[#0d592c]">
                    Verdes
                  </span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed text-left flex items-start gap-2">
                <SombreroSao className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Datos actualizados con cada reporte anónimo que los vecinos confirman en el mapa de abajo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Hecha para cómo se vive la ciudad (Fondo Blanco) */}
      <section id="funciones" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white rounded-3xl my-6 shadow-xs border border-slate-100">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#0d592c] font-bold text-xs rounded-full mb-2">
            <SombreroSao className="w-4 h-4" />
            <span>Identidad Cruceña</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d592c] tracking-tight">
            Hecha para cómo se vive la ciudad
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Anillos, radiales, micros y barrios: la app habla como cruceño y funciona aunque el servidor falle.
          </p>
        </div>

        {/* 4 Feature Cards con Fondo Blanco y Borde Suave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#f8faf8] border border-emerald-100/80 rounded-2xl p-6 hover:border-[#58b947] hover:bg-white transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#0d592c] flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-[#0d592c] font-bold text-base mb-2">Mapa de zonas</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Agrupamos los reportes y pintamos zonas rojas, amarillas y corredores seguros con IA geoespacial y algoritmos DBSCAN.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f8faf8] border border-emerald-100/80 rounded-2xl p-6 hover:border-[#58b947] hover:bg-white transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#0d592c] flex items-center justify-center mb-4">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="text-[#0d592c] font-bold text-base mb-2">Reporte en 3 toques</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Elige qué pasó, marca detalles rápidos y confirma en segundos sin formularios largos ni registros obligatorios.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f8faf8] border border-emerald-100/80 rounded-2xl p-6 hover:border-[#58b947] hover:bg-white transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#0d592c] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-[#0d592c] font-bold text-base mb-2">Modo Comando</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Radio Patrulla 110 y Guardia Municipal ven métricas en tiempo real y ruteo táctico optimizado para patrullajes.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#f8faf8] border border-emerald-100/80 rounded-2xl p-6 hover:border-[#58b947] hover:bg-white transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#0d592c] flex items-center justify-center mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-[#0d592c] font-bold text-base mb-2">Centinela SCZ</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Pregúntale si es seguro caminar por tu zona o cómo reportar en lenguaje natural a nuestro asistente con IA.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Section: Reportar toma tres pasos (Fondo Menta Suave) */}
      <section id="como-funciona" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d592c] tracking-tight">
            Reportar toma tres pasos
          </h2>
          <p className="mt-1 text-slate-600 text-sm">
            Participación comunitaria sin burocracia para cuidar a nuestras familias cruceñas.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Paso 1 */}
          <div className="bg-white border border-emerald-100 rounded-3xl p-7 shadow-sm text-left">
            <span className="text-5xl font-black text-[#58b947] block mb-3 font-mono">
              1
            </span>
            <h3 className="text-[#0d592c] font-bold text-lg mb-2">
              Elige la categoría
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Asalto, robo, colisión, disturbio o persona sospechosa.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white border border-emerald-100 rounded-3xl p-7 shadow-sm text-left">
            <span className="text-5xl font-black text-[#58b947] block mb-3 font-mono">
              2
            </span>
            <h3 className="text-[#0d592c] font-bold text-lg mb-2">
              Agrega detalles
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Toca los chips: moto oscura, de noche, con arma.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white border border-emerald-100 rounded-3xl p-7 shadow-sm text-left">
            <span className="text-5xl font-black text-[#58b947] block mb-3 font-mono">
              3
            </span>
            <h3 className="text-[#0d592c] font-bold text-lg mb-2">
              Confirma el lugar
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Usamos tu GPS o el punto que marcaste en el mapa.
            </p>
          </div>
        </div>

        {/* Deduplication Callout Note */}
        <div className="mt-6 p-4 rounded-2xl bg-white border border-emerald-200 text-xs sm:text-sm text-slate-700 leading-relaxed text-left shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0d592c] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#0d592c]" />
          </div>
          <p>
            <strong className="text-[#0d592c]">Confirmación vecinal inteligente: </strong>
            Si ya hay un reporte igual a menos de 75 metros, se suma como confirmación comunitaria en vez de duplicarse.
            Tu identidad se guarda únicamente como huella anónima criptográfica.
          </p>
        </div>
      </section>

      {/* 5. Section: Pruébala aquí mismo (La App y Mapa) */}
      <section id="probar-app" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/70 text-[#0d592c] rounded-full text-xs font-bold mb-2">
            <Compass className="w-4 h-4" />
            <span>Radar Geoespacial en Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d592c] tracking-tight">
            Pruébala aquí mismo
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Toca el mapa para marcar un punto y reportar. Cambia de modo o de franja horaria para ver cómo cambian las zonas de Santa Cruz.
          </p>
        </div>

        {/* Interactive App Container en Blanco con Borde Suave */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col isolate">
          {/* App Top Toolbar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Left: View Mode Toggle + Time Slot Filter */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Mode switch pills */}
              <div className="bg-white border border-slate-200 rounded-full p-1 flex items-center gap-1 shadow-xs text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('CITIZEN')}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'CITIZEN'
                      ? 'bg-[#0d592c] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Modo Vecino</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('COMMAND')}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'COMMAND'
                      ? 'bg-cyan-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Modo Comando</span>
                </button>
              </div>

              {/* Time slot filter */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs shadow-xs">
                <Clock className="w-3.5 h-3.5 text-[#0d592c]" />
                <span className="text-slate-500 font-medium hidden sm:inline">Franja:</span>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as any)}
                  className="bg-transparent text-[#0d592c] text-xs font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">24 Horas</option>
                  <option value="DAY">Día (06:00 - 19:00)</option>
                  <option value="NIGHT">Noche (19:00 - 24:00)</option>
                </select>
              </div>
            </div>

            {/* Right: Live stats & Quick Report Button */}
            <div className="flex items-center gap-3 text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full font-mono text-[11px] shadow-xs">
                <span className="text-red-600 font-bold">● Roja: {stats.redCount || 6}</span>
                <span className="text-amber-600 font-bold">● Amarilla: {stats.yellowCount || 2}</span>
                <span className="text-emerald-700 font-bold">● Verde: {stats.greenCount || 0}</span>
              </div>

              <button
                type="button"
                onClick={handleOpenReportNow}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-full shadow-md shadow-red-600/20 transition-all active:scale-95 flex items-center gap-2 text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Reportar en este punto</span>
              </button>
            </div>
          </div>

          {/* App Body: Map + Sidebar if Command Mode */}
          <div className="w-full h-[620px] sm:h-[680px] relative flex overflow-hidden bg-slate-100">
            {/* Tactical Patrol Sidebar when COMMAND is active */}
            {viewMode === 'COMMAND' && <PatrolSidebar />}

            {/* Interactive Leaflet Radar Map of Santa Cruz de la Sierra */}
            <main className="flex-1 w-full h-full relative">
              <RadarMap />
            </main>
          </div>
        </div>
      </section>

      {/* 6. Section: En una emergencia, llama primero */}
      <section id="emergencias" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100/70 text-red-700 rounded-full text-xs font-bold mb-2">
            <HeartPulse className="w-4 h-4" />
            <span>Atención Rápida SCZ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d592c] tracking-tight">
            En una emergencia, llama primero
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            La app no reemplaza a las autoridades. Toca un número para marcar directamente desde tu celular.
          </p>
        </div>

        {/* 5 Emergency Contact Cards en Blanco con Sombras Suaves */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 110 Radio Patrulla */}
          <a
            href="tel:110"
            className="bg-white border border-slate-200 hover:border-[#0d592c] rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0d592c] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-[#0d592c] font-mono">
              110
            </span>
            <span className="text-xs text-slate-600 font-medium mt-0.5">
              Radio Patrulla
            </span>
          </a>

          {/* 119 Bomberos */}
          <a
            href="tel:119"
            className="bg-white border border-slate-200 hover:border-red-500 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-red-600 font-mono">
              119
            </span>
            <span className="text-xs text-slate-600 font-medium mt-0.5">
              Bomberos
            </span>
          </a>

          {/* 168 Ambulancias SIS */}
          <a
            href="tel:168"
            className="bg-white border border-slate-200 hover:border-cyan-600 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-cyan-700 font-mono">
              168
            </span>
            <span className="text-xs text-slate-600 font-medium mt-0.5">
              Ambulancias SIS
            </span>
          </a>

          {/* 800-140348 FELCV */}
          <a
            href="tel:800140348"
            className="bg-white border border-slate-200 hover:border-red-500 rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-lg sm:text-xl font-black text-red-600 font-mono">
              800-140348
            </span>
            <span className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
              FELCV violencia
            </span>
          </a>

          {/* 3-3398888 Guardia Municipal */}
          <a
            href="tel:33398888"
            className="col-span-2 sm:col-span-1 bg-white border border-slate-200 hover:border-[#0d592c] rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0d592c] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-lg sm:text-xl font-black text-[#0d592c] font-mono">
              3-3398888
            </span>
            <span className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
              Guardia Municipal
            </span>
          </a>
        </div>
      </section>

      {/* 7. Footer Blanco y Verde con Escudo de Santa Cruz y Sombrero de Saó */}
      <footer className="w-full bg-white border-t border-emerald-100 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <img
              src="/escudo.png"
              alt="Escudo de Santa Cruz"
              className="h-12 w-auto object-contain"
            />
            <SombreroSao className="w-8 h-8" />
            <div className="text-left">
              <p className="text-[#0d592c] font-black text-sm tracking-tight flex items-center gap-2">
                OJO CAMBA
                <span className="text-[10px] font-bold bg-emerald-100 text-[#0d592c] px-2 py-0.5 rounded-full">
                  Santa Cruz de la Sierra
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Gobierno Autónomo Departamental y Municipal · Seguridad Ciudadana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#0d592c]">
            <span>Bandera Cruceña:</span>
            <div className="flex items-center gap-0.5 border border-slate-300 rounded overflow-hidden shadow-2xs">
              <div className="w-4 h-3 bg-[#0d592c]" />
              <div className="w-4 h-3 bg-white" />
              <div className="w-4 h-3 bg-[#0d592c]" />
            </div>
            <span className="text-slate-500 font-normal">| 100% Hecho en Santa Cruz</span>
          </div>
        </div>
      </footer>

      {/* Floating Centinela Conversational Drawer */}
      <ChatDrawer />

      {/* 3-Step Citizen Report Modal */}
      <ReportModal />
    </div>
  );
};
