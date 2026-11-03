import React, { useEffect, useState, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
  LayersControl,
  ZoomControl,
} from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import {
  CheckCircle2,
  Navigation,
  Radio,
} from 'lucide-react';
import { SCZ_DEFAULT_CENTER, SCZ_DEFAULT_ZOOM, polygonToLeaflet, toLeaflet } from '@/core/utils/geoAdapter.ts';
import { useApp } from '@/core/store/AppContext.tsx';
import { mapService } from '../services/map.service.ts';
import { reportService } from '@/features/incident-reports/services/report.service.ts';
import { patrolService, PatrolRouteResponse } from '@/features/patrol-command/services/patrol.service.ts';
import { MapZoneFeatureCollection } from '../types/zone.types.ts';
import { IncidentReportResponse } from '@/features/incident-reports/types/report.types.ts';
import { MapLegend } from './MapLegend.tsx';

// Fix Leaflet Default Icon issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Category Icons Factory
function createCategoryMarkerIcon(category: string, severity: string) {
  let bgColor = '#3B82F6';
  let pulseClass = '';
  let symbol = '!';

  if (severity === 'CRITICO' || category === 'ASALTO_MANO_ARMADA' || category === 'ZONA_PANDILLAS') {
    bgColor = '#EF4444';
    pulseClass = 'animate-ping';
    symbol = '!';
  } else if (category === 'CALLE_SIN_ILUMINACION' || category === 'PUNTO_OSCURO') {
    bgColor = '#8B5CF6';
    symbol = '!';
  } else if (category === 'BACHE_VIAL') {
    bgColor = '#F59E0B';
    symbol = '!';
  } else if (category === 'PARQUE_DESCUIDADO') {
    bgColor = '#10B981';
    symbol = '!';
  } else if (category === 'MALA_SENALIZACION') {
    bgColor = '#EAB308';
    symbol = '!';
  } else if (severity === 'ALTO') {
    bgColor = '#F97316';
  }

  return L.divIcon({
    className: 'custom-incident-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-8 h-8 rounded-full ${pulseClass}" style="background-color: ${bgColor}; opacity: 0.35;"></span>
        <div class="relative w-7 h-7 rounded-full flex items-center justify-center border-2 border-white/80 shadow-lg text-[11px] font-bold text-white" style="background-color: ${bgColor}">
          ${symbol}
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

// Map Click Interceptor for Fast Reporting
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Recenter Map Helper
const MapRecenter: React.FC<{ center: LatLngTuple }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.2 });
  }, [center, map]);
  return null;
};

// Auto-collapse layers control on click, select, or page scroll
const LayersAutoCollapse: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const collapseLayers = () => {
      const container = document.querySelector('.leaflet-control-layers');
      if (container && container.classList.contains('leaflet-control-layers-expanded')) {
        container.classList.remove('leaflet-control-layers-expanded');
      }
    };

    window.addEventListener('scroll', collapseLayers, { passive: true });
    map.on('baselayerchange', collapseLayers);
    map.on('click', collapseLayers);

    return () => {
      window.removeEventListener('scroll', collapseLayers);
      map.off('baselayerchange', collapseLayers);
      map.off('click', collapseLayers);
    };
  }, [map]);

  return null;
};

// Force Leaflet recalculate bounds on initial mount/layout resize
const MapResizer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

export const RadarMap: React.FC = () => {
  const {
    openReportAtCoords,
    patrolActive,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    refreshTrigger,
    stats,
    setStats,
  } = useApp();

  const [zones, setZones] = useState<MapZoneFeatureCollection | null>(null);
  const [reports, setReports] = useState<IncidentReportResponse[]>([]);
  const [patrolData, setPatrolData] = useState<PatrolRouteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Load Zones and Nearby Reports
  const loadMapData = useCallback(async () => {
    try {
      setLoading(true);
      const [zonesRes, reportsRes] = await Promise.all([
        mapService.getZones(),
        reportService.getNearbyReports(SCZ_DEFAULT_CENTER[0], SCZ_DEFAULT_CENTER[1]),
      ]);

      setZones(zonesRes);
      setReports(reportsRes);

      let red = 0;
      let yellow = 0;
      let green = 0;

      zonesRes.features.forEach((f) => {
        if (f.properties.zone_type === 'ZONA_ROJA') red += 1;
        if (f.properties.zone_type === 'ZONA_AMARILLA') yellow += 1;
        if (f.properties.zone_type === 'ZONA_VERDE') green += 1;
      });

      setStats({
        redCount: red,
        yellowCount: yellow,
        greenCount: green,
        totalIncidents: reportsRes.length,
      });
    } catch (err) {
      console.error('[RadarMap] Error loading map data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Patrol Route Loader
  useEffect(() => {
    if (patrolActive) {
      patrolService.getPatrolRoutes().then(setPatrolData).catch(console.error);
    } else {
      setPatrolData(null);
    }
  }, [patrolActive]);

  useEffect(() => {
    loadMapData();
  }, [loadMapData, refreshTrigger]);

  // Community Confirmation Handler
  const handleConfirmReport = async (reportId: string) => {
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

  // Locate User GPS
  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords: LatLngTuple = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(userCoords);
        },
        () => {
          // Default fallback to Casco Viejo
          setUserLocation(SCZ_DEFAULT_CENTER);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      {/* Live Map Legend */}
      <MapLegend
        stats={stats}
        selectedFilter={selectedCategoryFilter}
        onFilterChange={setSelectedCategoryFilter}
      />

      {/* Floating GPS Button */}
      <div className="absolute bottom-6 right-6 z-[999] flex flex-col items-end gap-2">
        {loading && (
          <div className="px-3 py-1 bg-white/95 border border-slate-200 rounded-full text-[10px] text-[#0d592c] font-bold font-mono shadow-md backdrop-blur-md">
            Sincronizando cuadrantes...
          </div>
        )}
        <button
          type="button"
          onClick={handleLocateMe}
          title="Centrar en mi ubicación GPS"
          className="p-3 bg-white hover:bg-slate-50 text-[#0d592c] border border-slate-200 rounded-2xl shadow-xl transition-all active:scale-95"
        >
          <Navigation className="w-5 h-5 text-[#0d592c]" />
        </button>
      </div>

      <MapContainer
        center={SCZ_DEFAULT_CENTER}
        zoom={SCZ_DEFAULT_ZOOM}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <MapResizer />
        <LayersAutoCollapse />
        <ZoomControl position="bottomleft" />

        {/* Selector de Capas 100% Gratuitas y Libres (Sin API Key ni marcas de agua) */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Calles Estándar">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satelital">
            <TileLayer
              attribution='&copy; Esri &mdash; Santa Cruz de la Sierra'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Modo Oscuro">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="osm-tactical-dark"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapClickHandler onMapClick={openReportAtCoords} />
        {userLocation && <MapRecenter center={userLocation} />}

        {/* Polígonos de Zonas DBSCAN */}
        {zones?.features.map((feature) => {
          const { cluster_id, zone_type, risk_label, incident_count, neighborhoods } =
            feature.properties;

          if (selectedCategoryFilter && selectedCategoryFilter !== zone_type) {
            return null;
          }

          const polygonPositions = polygonToLeaflet(feature.geometry.coordinates[0]);

          const fillColor =
            zone_type === 'ZONA_ROJA'
              ? '#EF4444'
              : zone_type === 'ZONA_AMARILLA'
                ? '#F59E0B'
                : '#10B981';

          return (
            <Polygon
              key={`zone-${cluster_id}`}
              positions={polygonPositions}
              pathOptions={{
                color: fillColor,
                fillColor: fillColor,
                fillOpacity: zone_type === 'ZONA_VERDE' ? 0.15 : 0.28,
                weight: zone_type === 'ZONA_ROJA' ? 2 : 1.5,
                dashArray: zone_type === 'ZONA_VERDE' ? '4, 4' : undefined,
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 text-slate-100 min-w-[210px]">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: fillColor }}
                    />
                    <span>{risk_label}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {neighborhoods?.join(', ') || 'Cuadrante Urbano SCZ'}
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-700">
                    <span className="text-slate-400">Incidentes reportados:</span>
                    <span className="font-mono font-bold text-emerald-400">{incident_count}</span>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Marcadores de Incidentes Individuales */}
        {reports.map((report) => {
          const latLng: LatLngTuple = [report.latitude, report.longitude];
          const icon = createCategoryMarkerIcon(report.category, report.severity);

          return (
            <Marker key={report.id} position={latLng} icon={icon}>
              <Popup>
                <div className="p-1.5 space-y-2 text-slate-100 min-w-[240px]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-100 leading-tight">
                      {report.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${report.severity === 'CRITICO'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : report.severity === 'ALTO'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                    >
                      {report.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

                  {/* Evidencia Fotográfica en Mapa si existe */}
                  {(report.photo_url || report.photo_base64) && (
                    <div className="rounded-xl overflow-hidden my-1.5 border border-slate-700/60 max-h-36">
                      <img
                        src={report.photo_url || report.photo_base64}
                        alt="Evidencia fotográfica"
                        className="w-full h-28 object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-1.5">
                    <span>{report.neighborhood}</span>
                    <span className="text-slate-500 font-mono">
                      {new Date(report.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Triaje IA Preview */}
                  {report.ai_triage?.short_summary && (
                    <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[10px]">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>Triaje Centinela IA:</span>
                      </div>
                      <p className="text-slate-300 italic">
                        "{report.ai_triage.short_summary}"
                      </p>
                    </div>
                  )}

                  {/* Botón de Corroboración Comunitaria */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{report.confirmations_count} vecinos confirman</span>
                    </span>

                    <button
                      type="button"
                      disabled={confirmingId === report.id}
                      onClick={() => handleConfirmReport(report.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-[11px] transition-all disabled:opacity-50"
                    >
                      {confirmingId === report.id ? 'Confirmando...' : 'Corroborar'}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Circuito de Patrullaje Táctico (Polyline Azul Neón) */}
        {patrolActive && patrolData && (
          <>
            <Polyline
              positions={patrolData.geojson.geometry.coordinates.map((c) => toLeaflet(c))}
              pathOptions={{
                color: '#06B6D4',
                weight: 4,
                opacity: 0.9,
                dashArray: '8, 8',
              }}
            />
            {patrolData.waypoints.map((wp) => (
              <Marker
                key={`wp-${wp.order}`}
                position={[wp.latitude, wp.longitude]}
                icon={L.divIcon({
                  className: 'patrol-waypoint-icon',
                  html: `
                    <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center font-bold text-xs text-slate-900 shadow-cyan-500/50 shadow-lg">
                      ${wp.order}
                    </div>
                  `,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-slate-100 text-xs">
                    <span className="font-bold text-cyan-400">
                      Punto Táctico #{wp.order}: {wp.neighborhood}
                    </span>
                    <p className="text-slate-300">{wp.notes}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};
