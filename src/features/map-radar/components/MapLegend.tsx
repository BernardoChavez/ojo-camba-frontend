import React from 'react';
import { Flame, Compass } from 'lucide-react';
import { ZoneStats } from '../types/zone.types.ts';

interface MapLegendProps {
  stats: ZoneStats;
  selectedFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({ stats, selectedFilter, onFilterChange }) => {
  return (
    <div className="absolute top-4 left-4 z-[999] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-xl text-xs space-y-2.5 max-w-[260px] text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-[#0d592c]">
          <Compass className="w-4 h-4 text-[#58b947]" />
          <span>Radar Cuadrantes SCZ</span>
        </div>
        <span className="text-[10px] bg-emerald-50 text-[#0d592c] font-mono px-2 py-0.5 rounded-full border border-emerald-200">
          DBSCAN IA
        </span>
      </div>

      <div className="space-y-1.5">
        {/* Zona Roja */}
        <button
          type="button"
          onClick={() => onFilterChange(selectedFilter === 'ZONA_ROJA' ? null : 'ZONA_ROJA')}
          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
            selectedFilter === 'ZONA_ROJA'
              ? 'bg-red-50 border border-red-300 text-red-900 font-bold'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            <span className="font-semibold text-xs">Zonas Rojas</span>
          </div>
          <span className="font-mono text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded-lg text-xs">
            {stats.redCount}
          </span>
        </button>

        {/* Zona Amarilla */}
        <button
          type="button"
          onClick={() => onFilterChange(selectedFilter === 'ZONA_AMARILLA' ? null : 'ZONA_AMARILLA')}
          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
            selectedFilter === 'ZONA_AMARILLA'
              ? 'bg-amber-50 border border-amber-300 text-amber-900 font-bold'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            <span className="font-semibold text-xs">Zonas Amarillas</span>
          </div>
          <span className="font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-lg text-xs">
            {stats.yellowCount}
          </span>
        </button>

        {/* Zona Verde */}
        <button
          type="button"
          onClick={() => onFilterChange(selectedFilter === 'ZONA_VERDE' ? null : 'ZONA_VERDE')}
          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
            selectedFilter === 'ZONA_VERDE'
              ? 'bg-emerald-50 border border-emerald-300 text-[#0d592c] font-bold'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#58b947] shadow-[0_0_6px_rgba(88,185,71,0.6)]" />
            <span className="font-semibold text-xs">Corredores Seguros</span>
          </div>
          <span className="font-mono text-[#0d592c] font-bold bg-emerald-100 px-2 py-0.5 rounded-lg text-xs">
            {stats.greenCount}
          </span>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1 font-medium">
          <Flame className="w-3 h-3 text-orange-500" />
          <span>Incidentes en mapa:</span>
        </span>
        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {stats.totalIncidents}
        </span>
      </div>
    </div>
  );
};
