import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Trash2, Save, RotateCcw, ChevronUp, ChevronDown, Copy, Check, Search } from "lucide-react";
import { useMap } from "react-leaflet";

const ROUTE_COLORS = {
  red:   { color: "#EF4444", label: "5 km — Kids Fun Ride",   key: "red" },
  blue:  { color: "#0075E1", label: "25 km — The Explorers",  key: "blue" },
  green: { color: "#22C55E", label: "16 km — Rising Heat",    key: "green" },
};

const TATU_CENTER = [-1.0833, 36.8597];

const WAYPOINT_TYPES = ["start", "checkpoint", "finish", "straight", "left", "right", "slight_left", "slight_right"];

function makeIcon(color, index) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:9px;font-weight:900;">${index + 1}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

function FlyToLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.2 });
  }, [target]);
  return null;
}

function WaypointList({ waypoints, color, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  return (
    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
      {waypoints.map((wp, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-xs">
          <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-[9px]"
            style={{ backgroundColor: color }}>{i + 1}</div>
          <div className="flex-1 min-w-0">
            <input
              className="w-full bg-transparent font-semibold text-gray-800 outline-none placeholder-gray-400 truncate"
              placeholder="Label (optional)"
              value={wp.label || ""}
              onChange={e => onUpdate(i, { ...wp, label: e.target.value })}
            />
            <div className="text-gray-400 font-mono text-[10px]">{wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}</div>
          </div>
          <select
            className="text-[10px] bg-white border border-gray-200 rounded-lg px-1 py-0.5 text-gray-600 outline-none"
            value={wp.type || "straight"}
            onChange={e => onUpdate(i, { ...wp, type: e.target.value })}
          >
            {WAYPOINT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex flex-col gap-0.5">
            <button onClick={() => onMoveUp(i)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
            <button onClick={() => onMoveDown(i)} disabled={i === waypoints.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
          </div>
          <button onClick={() => onDelete(i)} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      {waypoints.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">Click on the map to add waypoints</p>
      )}
    </div>
  );
}

export default function RouteEditor({ onSave }) {
  const [activeRoute, setActiveRoute] = useState("red");
  const [routes, setRoutes] = useState(() => {
    try {
      const saved = localStorage.getItem("tatu_routes_v1");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { red: [], blue: [], green: [] };
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTarget, setSearchTarget] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
    const data = await res.json();
    setSearching(false);
    if (data.length > 0) {
      setSearchTarget({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
    } else {
      alert("Location not found. Try a more specific search.");
    }
  };

  const currentWaypoints = routes[activeRoute] || [];
  const rc = ROUTE_COLORS[activeRoute];

  const handleMapClick = (latlng) => {
    const newWp = { lat: latlng.lat, lng: latlng.lng, label: null, type: "straight", instruction: "" };
    // Auto-set type for first and last
    const current = routes[activeRoute] || [];
    if (current.length === 0) newWp.type = "start";
    setRoutes(prev => ({ ...prev, [activeRoute]: [...(prev[activeRoute] || []), newWp] }));
  };

  const updateWaypoint = (index, updated) => {
    setRoutes(prev => {
      const wps = [...(prev[activeRoute] || [])];
      wps[index] = updated;
      return { ...prev, [activeRoute]: wps };
    });
  };

  const deleteWaypoint = (index) => {
    setRoutes(prev => {
      const wps = [...(prev[activeRoute] || [])];
      wps.splice(index, 1);
      return { ...prev, [activeRoute]: wps };
    });
  };

  const moveWaypoint = (index, dir) => {
    setRoutes(prev => {
      const wps = [...(prev[activeRoute] || [])];
      const target = index + dir;
      if (target < 0 || target >= wps.length) return prev;
      [wps[index], wps[target]] = [wps[target], wps[index]];
      return { ...prev, [activeRoute]: wps };
    });
  };

  const clearRoute = () => {
    if (!confirm(`Clear all waypoints for ${rc.label}?`)) return;
    setRoutes(prev => ({ ...prev, [activeRoute]: [] }));
  };

  const handleSave = () => {
    localStorage.setItem("tatu_routes_v1", JSON.stringify(routes));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSave) onSave(routes);
  };

  const polylinePoints = currentWaypoints.map(wp => [wp.lat, wp.lng]);

  const generateExportCode = () => {
    const routeMap = { red: { id: "red", name: "Kids Fun Race", distance: 5, color: "#EF4444", description: "5 km — Kids Fun Race" }, blue: { id: "blue", name: "The Explorers", distance: 25, color: "#0075E1", description: "25 km — The Explorers" }, green: { id: "green", name: "Rising Heat", distance: 16, color: "#22C55E", description: "16 km — Rising Heat" } };
    const entries = Object.entries(routes).map(([key, wps]) => {
      const meta = routeMap[key];
      const waypointsStr = wps.map(wp =>
        `      { lat: ${wp.lat.toFixed(6)}, lng: ${wp.lng.toFixed(6)}, label: ${wp.label ? `"${wp.label}"` : "null"}, type: "${wp.type || "straight"}", instruction: "${wp.instruction || ""}" }`
      ).join(",\n");
      return `  ${key}: {\n    id: "${meta.id}",\n    name: "${meta.name}",\n    distance: ${meta.distance},\n    color: "${meta.color}",\n    description: "${meta.description}",\n    waypoints: [\n${waypointsStr}\n    ],\n  }`;
    });
    return `export const ROUTE_CONFIG = {\n${entries.join(",\n")}\n};`;
  };

  const handleCopyExport = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Route selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.values(ROUTE_COLORS).map(r => (
          <button key={r.key} onClick={() => setActiveRoute(r.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${activeRoute === r.key ? "text-white" : "bg-white text-gray-600 border-gray-200"}`}
            style={activeRoute === r.key ? { backgroundColor: r.color, borderColor: r.color } : {}}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium">
        ✏️ <strong>Click on the map</strong> to add waypoints for the <span style={{ color: rc.color }}>{rc.label}</span> route. Drag markers to reposition.
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search location (e.g. Tatu City, Ruiru)..."
          className="flex-1 text-sm border border-border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary bg-white"
        />
        <button type="submit" disabled={searching}
          className="flex items-center gap-1.5 bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors">
          <Search className="w-4 h-4" />
          {searching ? "..." : "Go"}
        </button>
      </form>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-border" style={{ height: 340 }}>
        <MapContainer center={TATU_CENTER} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <MapClickHandler onMapClick={handleMapClick} />
          <FlyToLocation target={searchTarget} />
          {polylinePoints.length > 1 && (
            <Polyline positions={polylinePoints} color={rc.color} weight={4} opacity={0.85} dashArray="8,4" />
          )}
          {currentWaypoints.map((wp, i) => (
            <Marker key={i} position={[wp.lat, wp.lng]} icon={makeIcon(rc.color, i)}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  updateWaypoint(i, { ...wp, lat, lng });
                }
              }}>
              <Popup>
                <div className="text-xs font-bold">{wp.label || `Point ${i + 1}`}</div>
                <div className="text-gray-500 font-mono">{wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Waypoint list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">{currentWaypoints.length} Waypoints</h3>
          <button onClick={clearRoute} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold">
            <RotateCcw className="w-3 h-3" /> Clear route
          </button>
        </div>
        <WaypointList
          waypoints={currentWaypoints}
          color={rc.color}
          onUpdate={updateWaypoint}
          onDelete={deleteWaypoint}
          onMoveUp={(i) => moveWaypoint(i, -1)}
          onMoveDown={(i) => moveWaypoint(i, 1)}
        />
      </div>

      {/* Save */}
      <button onClick={handleSave}
        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${saved ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-blue-700"}`}>
        <Save className="w-4 h-4" />
        {saved ? "✓ Routes Saved!" : "Save All Routes"}
      </button>

      {/* Export section */}
      <div className="border border-border rounded-2xl overflow-hidden">
        <button onClick={() => setShowExport(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted hover:bg-muted/80 text-sm font-bold text-foreground transition-colors">
          <span>📋 Export for <code className="font-mono text-xs">lib/routeData.js</code></span>
          <span className="text-xs text-muted-foreground">{showExport ? "▲ Hide" : "▼ Show"}</span>
        </button>
        {showExport && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Copy this code and replace the <code>ROUTE_CONFIG</code> export in <code>lib/routeData.js</code> to make routes permanent for all riders.</p>
            <pre className="bg-gray-950 text-green-400 text-[10px] rounded-xl p-3 overflow-auto max-h-48 font-mono whitespace-pre-wrap">
              {generateExportCode()}
            </pre>
            <button onClick={handleCopyExport}
              className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied ? "bg-green-600 text-white" : "bg-gray-900 text-white hover:bg-gray-700"}`}>
              {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy to Clipboard</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}