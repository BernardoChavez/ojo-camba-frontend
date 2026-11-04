#!/usr/bin/env python3
"""
Generador de Zonas Críticas (Zonas Rojas, Amarillas y Corredores Seguros)
para Santa Cruz de la Sierra - Plataforma RutaVecinal / Ojo Camba.

Modelado con base en incidentes delictivos reales de Santa Cruz:
- Plan 3000 (Rotonda El Mechero, Av. Paurito, Barrio Los Chacos)
- Villa 1ro de Mayo (Plaza Principal, Av. Cumavi, Tres Pasos al Frente)
- La Pampa de la Isla (Av. Virgen de Cotoca, El Trillo, 23 de Diciembre)
- Mercado La Ramada (Av. Grigotá, 1er y 2do Anillo)
- Los Lotes (Av. Santos Dumont, Palmar del Oratorio)
- Mercado Los Pozos & Abasto Antiguo (Zonas Amarillas)
- Corredores Seguros Equipetrol y UAGRM (Zonas Verdes)
"""

import json
import math
import os
import sys
from datetime import datetime, timezone

def create_circle_polygon(center_lng, center_lat, radius_meters, num_points=16):
    """Genera un polígono GeoJSON aproximando un círculo geodésico."""
    coords = []
    # 1 grado latitud aprox 111,320 m
    # 1 grado longitud aprox 111,320 * cos(lat) m
    lat_deg_per_meter = 1.0 / 111320.0
    lng_deg_per_meter = 1.0 / (111320.0 * math.cos(math.radians(center_lat)))

    for i in range(num_points):
        angle = 2.0 * math.pi * i / num_points
        dx = radius_meters * math.cos(angle)
        dy = radius_meters * math.sin(angle)
        point_lng = round(center_lng + (dx * lng_deg_per_meter), 6)
        point_lat = round(center_lat + (dy * lat_deg_per_meter), 6)
        coords.append([point_lng, point_lat])
    # Cerrar polígono
    coords.append(coords[0])
    return coords

SCZ_ZONES_DATA = [
    # 1. PLAN 3000 - ROTONDA EL MECHERO
    {
        "cluster_id": 101,
        "name": "Plan 3000 - Rotonda El Mechero y Av. Paurito",
        "zone_type": "ZONA_ROJA",
        "color": "#E53935",
        "risk_label": "Peligro Crítico - Foco de Robos y Asaltos",
        "patrol_priority": "URGENTE",
        "incident_count": 9,
        "centroid": [-63.1365, -17.8285],
        "radius_meters": 420,
        "neighborhoods": ["Plan 3000 - Rotonda El Mechero", "Av. Paurito", "Barrio Los Chacos", "Curva del Plan"],
        "categories_breakdown": {
            "ASALTO_MANO_ARMADA": 4,
            "ROBO": 3,
            "DISTURBIO_CALLEJERO": 2
        }
    },
    # 2. VILLA 1RO DE MAYO
    {
        "cluster_id": 102,
        "name": "Villa 1ro de Mayo - Av. Cumavi y Tres Pasos al Frente",
        "zone_type": "ZONA_ROJA",
        "color": "#E53935",
        "risk_label": "Peligro Crítico - Frecuencia de Motochorros y Arrebatos",
        "patrol_priority": "URGENTE",
        "incident_count": 8,
        "centroid": [-63.1380, -17.7890],
        "radius_meters": 400,
        "neighborhoods": ["Villa 1ro de Mayo - Plaza Principal", "Av. Cumavi", "Tres Pasos al Frente", "Mercado 1ro de Mayo"],
        "categories_breakdown": {
            "ROBO": 4,
            "ASALTO_MANO_ARMADA": 3,
            "CALLE_SIN_ILUMINACION": 1
        }
    },
    # 3. LA PAMPA DE LA ISLA
    {
        "cluster_id": 103,
        "name": "La Pampa de la Isla - Av. Virgen de Cotoca y El Trillo",
        "zone_type": "ZONA_ROJA",
        "color": "#E53935",
        "risk_label": "Peligro Crítico - Puntos Ciegos y Atracos en Paradas",
        "patrol_priority": "URGENTE",
        "incident_count": 7,
        "centroid": [-63.1250, -17.7650],
        "radius_meters": 380,
        "neighborhoods": ["Pampa de la Isla - 6to a 7mo Anillo", "Av. Virgen de Cotoca", "El Trillo", "Barrio 23 de Diciembre"],
        "categories_breakdown": {
            "ASALTO_MANO_ARMADA": 3,
            "ROBO": 3,
            "ZONA_PANDILLAS": 1
        }
    },
    # 4. MERCADO LA RAMADA / AV. GRIGOTÁ
    {
        "cluster_id": 104,
        "name": "Mercado La Ramada - Av. Grigotá y 1er Anillo",
        "zone_type": "ZONA_ROJA",
        "color": "#E53935",
        "risk_label": "Peligro Crítico - Descuideros y Arrebatos en Aglomeraciones",
        "patrol_priority": "URGENTE",
        "incident_count": 6,
        "centroid": [-63.1892, -17.7982],
        "radius_meters": 350,
        "neighborhoods": ["Mercado La Ramada", "Av. Grigotá", "1er y 2do Anillo Sur", "Antigua Terminal"],
        "categories_breakdown": {
            "ROBO": 4,
            "ACCIDENTE_TRANSITO": 1,
            "ASALTO_MANO_ARMADA": 1
        }
    },
    # 5. LOS LOTES / EL PALMAR
    {
        "cluster_id": 105,
        "name": "Los Lotes - Av. Santos Dumont y Palmar del Oratorio",
        "zone_type": "ZONA_ROJA",
        "color": "#E53935",
        "risk_label": "Peligro Crítico - Zonas a Oscuras y Falta de Patrullaje",
        "patrol_priority": "URGENTE",
        "incident_count": 5,
        "centroid": [-63.1780, -17.8480],
        "radius_meters": 360,
        "neighborhoods": ["Los Lotes - 7mo a 8vo Anillo", "Av. Santos Dumont", "Palmar del Oratorio", "Barrio El Palmar"],
        "categories_breakdown": {
            "ROBO": 2,
            "ASALTO_MANO_ARMADA": 2,
            "CALLE_SIN_ILUMINACION": 1
        }
    },
    # 6. ZONA AMARILLA - MERCADO LOS POZOS
    {
        "cluster_id": 201,
        "name": "Mercado Los Pozos - Suárez Arana y Av. Brasil",
        "zone_type": "ZONA_AMARILLA",
        "color": "#FDD835",
        "risk_label": "Precaución Moderada - Comercio Informal y Tránsito Intenso",
        "patrol_priority": "MODERADA",
        "incident_count": 4,
        "centroid": [-63.1755, -17.7800],
        "radius_meters": 280,
        "neighborhoods": ["Mercado Los Pozos", "Calle Suárez Arana", "Av. Brasil", "Casco Central Este"],
        "categories_breakdown": {
            "ACCIDENTE_TRANSITO": 2,
            "ROBO": 2
        }
    },
    # 7. ZONA AMARILLA - MERCADO ABASTO ANTIGUO
    {
        "cluster_id": 202,
        "name": "Antiguo Abasto - Av. Piraí y 3er Anillo",
        "zone_type": "ZONA_AMARILLA",
        "color": "#FDD835",
        "risk_label": "Precaución Moderada - Tráfico Pesado y Hurtos Rápidos",
        "patrol_priority": "MODERADA",
        "incident_count": 3,
        "centroid": [-63.2050, -17.7920],
        "radius_meters": 260,
        "neighborhoods": ["Mercado Antiguo Abasto", "Av. Piraí", "3er Anillo Interno"],
        "categories_breakdown": {
            "ROBO": 2,
            "ACCIDENTE_TRANSITO": 1
        }
    },
    # 8. CORREDOR SEGURO - EQUIPETROL NORTE
    {
        "cluster_id": 301,
        "name": "Corredor Seguro Equipetrol Norte",
        "zone_type": "ZONA_VERDE",
        "color": "#43A047",
        "risk_label": "Corredor Seguro - Vigilancia Activa e Iluminación LED",
        "patrol_priority": "PREVENTIVA",
        "incident_count": 0,
        "centroid": [-63.1970, -17.7610],
        "radius_meters": 250,
        "neighborhoods": ["Equipetrol Norte", "Av. San Martín", "Calle Güembé"],
        "categories_breakdown": {}
    },
    # 9. CORREDOR SEGURO - CAMPUS UNIVERSITARIO UAGRM
    {
        "cluster_id": 302,
        "name": "Corredor Seguro Campus UAGRM",
        "zone_type": "ZONA_VERDE",
        "color": "#43A047",
        "risk_label": "Corredor Seguro - Sendero Estudiantil Universitario",
        "patrol_priority": "PREVENTIVA",
        "incident_count": 0,
        "centroid": [-63.1930, -17.7760],
        "radius_meters": 240,
        "neighborhoods": ["Campus Universitario UAGRM", "Av. Busch y 2do Anillo"],
        "categories_breakdown": {}
    }
]

def build_geojson():
    features = []
    total_incidents = 0
    for z in SCZ_ZONES_DATA:
        poly_coords = create_circle_polygon(z["centroid"][0], z["centroid"][1], z["radius_meters"])
        total_incidents += z["incident_count"]
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly_coords]
            },
            "properties": {
                "cluster_id": z["cluster_id"],
                "zone_type": z["zone_type"],
                "color": z["color"],
                "risk_label": z["risk_label"],
                "patrol_priority": z["patrol_priority"],
                "incident_count": z["incident_count"],
                "centroid": z["centroid"],
                "radius_meters": z["radius_meters"],
                "categories_breakdown": z["categories_breakdown"],
                "neighborhoods": z["neighborhoods"]
            }
        })

    collection = {
        "type": "FeatureCollection",
        "metadata": {
            "total_incidents_analyzed": total_incidents,
            "clusters_found": len(features),
            "red_zones_count": sum(1 for z in SCZ_ZONES_DATA if z["zone_type"] == "ZONA_ROJA"),
            "yellow_zones_count": sum(1 for z in SCZ_ZONES_DATA if z["zone_type"] == "ZONA_AMARILLA"),
            "green_zones_count": sum(1 for z in SCZ_ZONES_DATA if z["zone_type"] == "ZONA_VERDE"),
            "city": "Santa Cruz de la Sierra, Bolivia",
            "generated_at": datetime.now(timezone.utc).isoformat()
        },
        "features": features
    }
    return collection

if __name__ == "__main__":
    geojson = build_geojson()
    out_dir = "src/features/map-radar/data"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "scz-zones.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

    # También generar versión TypeScript directamente tipada
    ts_file = os.path.join(out_dir, "scz-zones.data.ts")
    with open(ts_file, "w", encoding="utf-8") as f:
        f.write("import { MapZoneFeatureCollection } from '../types/zone.types.ts';\n\n")
        f.write("export const SCZ_OFFLINE_ZONES: MapZoneFeatureCollection = ")
        f.write(json.dumps(geojson, indent=2, ensure_ascii=False))
        f.write(";\n")

    print(f"GeoJSON exportado con éxito a: {out_file}")
    print(f"TypeScript data exportado a: {ts_file}")
    print(f"Resumen de Cuadrantes SCZ:")
    print(f"  - Zonas Rojas: {geojson['metadata']['red_zones_count']} (Plan 3000, Villa 1ro de Mayo, La Pampa, La Ramada, Los Lotes)")
    print(f"  - Zonas Amarillas: {geojson['metadata']['yellow_zones_count']} (Los Pozos, Antiguo Abasto)")
    print(f"  - Zonas Verdes: {geojson['metadata']['green_zones_count']} (Equipetrol, Campus UAGRM)")
    print(f"  - Total incidentes simulados: {geojson['metadata']['total_incidents_analyzed']}")
