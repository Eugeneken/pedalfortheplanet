import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function createCheckpointIcon(color, label) {
  const isStart = label?.includes("Start");
  const isFinish = label?.includes("Finish");
  const emoji = isStart ? "🏁" : isFinish ? "🏁" : "📍";

  return L.divIcon({
    className: "custom-checkpoint",
    html: `<div style="
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function createRiderIcon() {
  return L.divIcon({
    className: "rider-marker",
    html: `<div style="
      width: 24px; height: 24px;
      background: #0075E1;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 3px rgba(0,117,225,0.3), 0 2px 8px rgba(0,0,0,0.3);
    " class="rider-pulse"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Component to follow rider position
function MapFollower({ position, shouldFollow }) {
  const map = useMap();
  const prevPos = useRef(null);

  useEffect(() => {
    if (position && shouldFollow) {
      const [lat, lng] = position;
      if (
        !prevPos.current ||
        Math.abs(prevPos.current[0] - lat) > 0.00005 ||
        Math.abs(prevPos.current[1] - lng) > 0.00005
      ) {
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
        prevPos.current = [lat, lng];
      }
    }
  }, [position, shouldFollow, map]);

  return null;
}

export default function RideMap({ route, riderPosition, currentWaypointIndex, followRider }) {
  const routeLatLngs = route.waypoints.map((w) => [w.lat, w.lng]);
  const checkpoints = route.waypoints.filter(
    (w) => w.label && (w.type === "checkpoint" || w.type === "start" || w.type === "finish")
  );

  // Center on first waypoint
  const center = [route.waypoints[0].lat, route.waypoints[0].lng];

  return (
    <MapContainer
      center={center}
      zoom={15}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Route line */}
      <Polyline
        positions={routeLatLngs}
        pathOptions={{
          color: route.color,
          weight: 5,
          opacity: 0.8,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {/* Completed portion */}
      {currentWaypointIndex > 0 && (
        <Polyline
          positions={routeLatLngs.slice(0, currentWaypointIndex + 1)}
          pathOptions={{
            color: route.color,
            weight: 7,
            opacity: 1,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}

      {/* Checkpoint markers */}
      {checkpoints.map((cp, idx) => (
        <Marker
          key={idx}
          position={[cp.lat, cp.lng]}
          icon={createCheckpointIcon(route.color, cp.label)}
        >
          <Popup>
            <div className="font-inter font-bold text-sm">{cp.label}</div>
          </Popup>
        </Marker>
      ))}

      {/* Next waypoint indicator */}
      {currentWaypointIndex < route.waypoints.length && (
        <CircleMarker
          center={[
            route.waypoints[currentWaypointIndex].lat,
            route.waypoints[currentWaypointIndex].lng,
          ]}
          radius={10}
          pathOptions={{
            color: route.color,
            fillColor: route.color,
            fillOpacity: 0.3,
            weight: 2,
            dashArray: "5, 5",
          }}
        />
      )}

      {/* Rider position */}
      {riderPosition && (
        <Marker position={riderPosition} icon={createRiderIcon()} />
      )}

      <MapFollower position={riderPosition} shouldFollow={followRider} />
    </MapContainer>
  );
}