import React, { useEffect, useState } from 'react';
import {
  Navigation2,
  Route,
  PhoneCall,
  Siren,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/core/store/AppContext.tsx';
import { patrolService, PatrolRouteResponse } from '../services/patrol.service.ts';

export const PatrolSidebar: React.FC = () => {
  const { patrolActive, setPatrolActive, viewMode } = useApp();
  const [routeData, setRouteData] = useState<PatrolRouteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (viewMode === 'COMMAND' || patrolActive) {
      setLoading(true);
      patrolService
        .getPatrolRoutes()
        .then(setRouteData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [viewMode, patrolActive]);

  if (viewMode !== 'COMMAND') return null;

  // Render docked button when user chose to hide the command card
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setIsCollapsed(false)}
        className="absolute top-1/2 -translate-y-1/2 left-0 z-[900] bg-slate-900/95 text-cyan-400 border-y border-r border-cyan-500/50 rounded-r-2xl py-3 px-2 shadow-2xl flex flex-col items-center gap-1.5 cursor-pointer hover:bg-slate-800 hover:text-cyan-300 transition-all pointer-events-auto group animate-fadeIn"
        title="Mostrar Centro de Comando 110"
      >
        <Siren className="w-5 h-5 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-mono font-bold tracking-wider [writing-mode:vertical-lr] rotate-180 text-slate-200">
          COMANDO 110
        </span>
        <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    );
  }

  const redSectorsCount =
    routeData?.waypoints.filter((w) => w.risk_level === 'ZONA_ROJA').length || 5;

  return (
    <aside className="w-full sm:w-80 max-sm:absolute max-sm:inset-0 max-sm:z-[900] h-full bg-scz-card/95 backdrop-blur-md border-r border-scz-border flex flex-col z-[900] shadow-2xl animate-fadeIn overflow-hidden">
      {/* Header with Title and Ocultar Button */}
      <div className="p-4 border-b border-scz-border bg-slate-900/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Siren className="w-5 h-5 animate-pulse" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono truncate">
                Centro de Comando 110
              </h2>
              <p className="text-[11px] text-cyan-400 truncate">Guardia Municipal & Policía SCZ</p>
            </div>
          </div>

          {/* Botón para Ocultar panel */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors shrink-0"
            title="Ocultar panel para ver el mapa completo"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ocultar</span>
          </button>
        </div>

        {/* Action button: Trazar / Ocultar circuito */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setPatrolActive(!patrolActive)}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
              patrolActive
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-bold'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>{patrolActive ? 'Ocultar Circuito en Mapa' : 'Trazar Circuito Óptimo'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-2 p-3 border-b border-scz-border text-xs">
        <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Focos Rojos Activos</span>
          <span className="text-lg font-bold font-mono text-red-400">{redSectorsCount} sectores</span>
        </div>
        <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Tiempo Estimado Ronda</span>
          <span className="text-lg font-bold font-mono text-emerald-400">45 min</span>
        </div>
      </div>

      {/* Waypoints list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
          <span>Waypoints Críticos Encadenados</span>
          <span className="text-[10px] text-cyan-400 font-mono">
            {routeData?.total_waypoints || 5} Puntos
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Calculando trayectorias optimizadas...
          </div>
        ) : (
          routeData?.waypoints.map((wp) => (
            <div
              key={wp.order}
              className="p-3 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-1.5 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] flex items-center justify-center font-bold">
                    {wp.order}
                  </span>
                  <span>{wp.neighborhood}</span>
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    wp.risk_level === 'ZONA_ROJA'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {wp.risk_level}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">{wp.notes}</p>

              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>
                  Coord: {wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}
                </span>
                <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                  <Navigation2 className="w-3 h-3" />
                  <span>En Ruta</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency Quick Action */}
      <div className="p-3 border-t border-scz-border bg-slate-900/90 text-xs">
        <a
          href="tel:110"
          className="w-full py-2 px-3 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Llamada de Emergencia 110</span>
        </a>
      </div>
    </aside>
  );
};
