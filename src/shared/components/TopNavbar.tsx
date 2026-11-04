import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Menu,
  X,
  PhoneCall,
  Bot,
} from 'lucide-react';
import { useApp } from '@/core/store/AppContext.tsx';
import { httpClient } from '@/core/api/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';
import { SombreroSao } from './SombreroSao.tsx';

export const TopNavbar: React.FC = () => {
  const { setReportModalOpen, chatDrawerOpen, setChatDrawerOpen } = useApp();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    httpClient
      .get(ENDPOINTS.HEALTH)
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <header className="sticky top-0 z-[1200] w-full bg-gradient-to-r from-emerald-100/70 via-white to-emerald-100/60 backdrop-blur-md border-b border-emerald-200 shadow-[0_4px_20px_-4px_rgba(13,89,44,0.08)]">
      {/* Barra superior de acento con la tricolor cruceña verde-blanco-verde */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0d592c] via-[#58b947] to-[#0d592c]" />

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand: Logo SCZ Departamental + Sombrero de Saó */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 group">
            <img
              src="/logo-scz.png"
              alt="Santa Cruz"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-emerald-300/80">
            <SombreroSao className="w-7 h-7 drop-shadow-xs shrink-0" />
            <div className="flex flex-col">
              <span className="text-[#0d592c] font-black text-sm tracking-tight uppercase font-sans whitespace-nowrap">
                OJO CAMBA
              </span>
              <span className="text-[10px] text-emerald-800/80 font-medium whitespace-nowrap">
                Santa Cruz de la Sierra
              </span>
            </div>
          </div>
        </div>

        {/* Center Pill Navigation Menu con degradé verde clarito y blanco + Espaciado holgado sin saltos de línea */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 bg-gradient-to-r from-emerald-100/90 via-white to-emerald-100/80 border border-emerald-300/90 px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold">
          <a
            href="#"
            className="px-4 py-1.5 bg-white text-[#0d592c] border border-emerald-300/80 rounded-full shadow-xs transition-all font-bold hover:shadow-sm whitespace-nowrap"
          >
            Inicio
          </a>
          <a
            href="#como-funciona"
            className="px-3.5 py-1.5 text-slate-700 hover:text-[#0d592c] hover:bg-white/90 rounded-full transition-all whitespace-nowrap"
          >
            Cómo funciona
          </a>
          <a
            href="#funciones"
            className="px-3.5 py-1.5 text-slate-700 hover:text-[#0d592c] hover:bg-white/90 rounded-full transition-all whitespace-nowrap"
          >
            Funciones
          </a>
          <a
            href="#probar-app"
            className="px-3.5 py-1.5 text-slate-700 hover:text-[#0d592c] hover:bg-white/90 rounded-full transition-all whitespace-nowrap"
          >
            Probar la app
          </a>
          <a
            href="#reportes-comunitarios"
            className="px-3.5 py-1.5 text-slate-700 hover:text-[#0d592c] hover:bg-white/90 rounded-full transition-all whitespace-nowrap"
          >
            Reportes
          </a>
          <div className="w-px h-5 bg-emerald-300/80 mx-0.5 shrink-0" />
          <a
            href="#emergencias"
            className="px-4 py-1.5 text-red-600 hover:text-red-700 bg-red-50/95 hover:bg-red-100/90 border border-red-200/90 rounded-full transition-all flex items-center gap-1.5 font-bold shadow-2xs whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 shrink-0" />
            <span>Emergencias</span>
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Status backend pill */}
          <div
            title={backendOnline ? 'FastAPI + MongoDB Atlas Conectado' : 'Modo Resiliencia Activo'}
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 bg-white/95 border border-emerald-300/70 rounded-full text-[11px] text-slate-700 font-medium shadow-2xs whitespace-nowrap"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                backendOnline ? 'bg-[#58b947] animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-mono text-[10px] font-semibold text-slate-600">
              {backendOnline ? 'API Conectada' : 'Resiliencia'}
            </span>
          </div>

          {/* Centinela SCZ Assistant button con degradé verde clarito y blanco */}
          <button
            type="button"
            onClick={() => setChatDrawerOpen(!chatDrawerOpen)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100/90 via-white to-emerald-50 hover:from-emerald-200/80 hover:to-white border border-emerald-300 text-[#0d592c] rounded-full text-xs font-bold transition-all shadow-xs hover:shadow-sm active:scale-98 whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-[#0d592c] shrink-0" />
            <span>Centinela SCZ</span>
          </button>

          {/* Reportar Incidente CTA (Píldora Roja Vibrante) */}
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-full shadow-md shadow-red-500/25 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Reportar Incidente</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-emerald-100/60 rounded-xl transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown con degradé verde clarito y blanco */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-white via-emerald-50/40 to-emerald-50/80 border-t border-emerald-200/70 px-5 pt-3 pb-6 space-y-2.5 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 py-2 text-xs font-bold text-[#0d592c] border-b border-emerald-100 pb-2.5">
            <SombreroSao className="w-5 h-5" />
            <span>OJO CAMBA · Santa Cruz de la Sierra</span>
          </div>
          <nav className="flex flex-col space-y-1.5 text-sm font-semibold text-slate-700">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-white border border-emerald-200/60 text-[#0d592c] font-bold shadow-2xs"
            >
              Inicio
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-emerald-100/50 hover:text-[#0d592c] transition-all"
            >
              Cómo funciona
            </a>
            <a
              href="#funciones"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-emerald-100/50 hover:text-[#0d592c] transition-all"
            >
              Funciones
            </a>
            <a
              href="#probar-app"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-emerald-100/50 hover:text-[#0d592c] transition-all"
            >
              Probar la app
            </a>
            <a
              href="#reportes-comunitarios"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-emerald-100/50 hover:text-[#0d592c] transition-all"
            >
              Reportes Comunitarios
            </a>
            <a
              href="#emergencias"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-red-50/80 hover:bg-red-100/80 border border-red-200/60 text-red-600 font-bold transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Líneas de Emergencia SCZ</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
