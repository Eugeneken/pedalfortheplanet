import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ROUTE_CONFIG } from "@/lib/routeData";
import { Save, MapPin, ChevronDown, ChevronUp } from "lucide-react";

// --- Registration Coordinates ---
function RegistrationCoords({ registrations, onSave }) {
  const [selected, setSelected] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSelect = (id) => {
    setSelected(id);
    const reg = registrations.find(r => r.id === id);
    setLat(reg?.lat ?? "");
    setLng(reg?.lng ?? "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await base44.entities.Registration.update(selected, { lat: parseFloat(lat), lng: parseFloat(lng) });
    setSaving(false);
    onSave();
  };

  return (
    <div className="space-y-3">
      <select
        value={selected}
        onChange={e => handleSelect(e.target.value)}
        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background">
        <option value="">— Select a rider —</option>
        {registrations.map(r => (
          <option key={r.id} value={r.id}>{r.name} ({r.route_km} km)</option>
        ))}
      </select>
      {selected && (
        <div className="flex gap-2">
          <input type="number" step="any" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)}
            className="flex-1 border border-border rounded-xl px-3 py-2 text-sm" />
          <input type="number" step="any" placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)}
            className="flex-1 border border-border rounded-xl px-3 py-2 text-sm" />
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-xl text-sm font-bold disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

// --- SOS Alert Coordinates ---
function SosCoords({ sosAlerts, onSave }) {
  const [selected, setSelected] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSelect = (id) => {
    setSelected(id);
    const alert = sosAlerts.find(a => a.id === id);
    setLat(alert?.lat ?? "");
    setLng(alert?.lng ?? "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const latF = parseFloat(lat);
    const lngF = parseFloat(lng);
    const mapsUrl = `https://www.google.com/maps?q=${latF},${lngF}`;
    await base44.entities.SosAlert.update(selected, { lat: latF, lng: lngF, maps_url: mapsUrl });
    setSaving(false);
    onSave();
  };

  return (
    <div className="space-y-3">
      <select
        value={selected}
        onChange={e => handleSelect(e.target.value)}
        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background">
        <option value="">— Select an alert —</option>
        {sosAlerts.map(a => (
          <option key={a.id} value={a.id}>{a.rider_name || "Unknown"} · {a.route_name} · {a.status}</option>
        ))}
      </select>
      {selected && (
        <div className="flex gap-2">
          <input type="number" step="any" placeholder="Latitude" value={lat} onChange={e => setLat(e.target.value)}
            className="flex-1 border border-border rounded-xl px-3 py-2 text-sm" />
          <input type="number" step="any" placeholder="Longitude" value={lng} onChange={e => setLng(e.target.value)}
            className="flex-1 border border-border rounded-xl px-3 py-2 text-sm" />
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-xl text-sm font-bold disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? "…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Route Waypoint Coordinates ---
const ROUTE_LABELS = { red: "🔴 5 km — Kids Fun Race", blue: "🔵 16 km — The Explorers", green: "🟢 25 km — Rising Heat" };

function RouteWaypointCoords() {
  const [routeId, setRouteId] = useState("red");
  const [waypoints, setWaypoints] = useState(() =>
    ROUTE_CONFIG["red"].waypoints.map(w => ({ ...w }))
  );
  const [expanded, setExpanded] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleRouteChange = (id) => {
    setRouteId(id);
    setWaypoints(ROUTE_CONFIG[id].waypoints.map(w => ({ ...w })));
    setExpanded(null);
    setSaved(false);
  };

  const updateWaypoint = (i, field, value) => {
    setWaypoints(prev => prev.map((w, idx) => idx === i ? { ...w, [field]: parseFloat(value) || value } : w));
  };

  const handleSave = () => {
    // Update the in-memory route config so the rider app uses the new coords immediately
    ROUTE_CONFIG[routeId].waypoints = waypoints.map(w => ({ ...w }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3">
      <select value={routeId} onChange={e => handleRouteChange(e.target.value)}
        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background">
        {Object.keys(ROUTE_LABELS).map(id => (
          <option key={id} value={id}>{ROUTE_LABELS[id]}</option>
        ))}
      </select>

      <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
        {waypoints.map((wp, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors">
              <span className="font-semibold text-foreground truncate">
                {i + 1}. {wp.label || wp.type} <span className="text-xs text-muted-foreground font-normal">({wp.lat?.toFixed(4)}, {wp.lng?.toFixed(4)})</span>
              </span>
              {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </button>
            {expanded === i && (
              <div className="flex gap-2 px-3 pb-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Latitude</label>
                  <input type="number" step="any" value={wp.lat}
                    onChange={e => updateWaypoint(i, "lat", e.target.value)}
                    className="w-full border border-border rounded-lg px-2 py-1.5 text-sm mt-0.5" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Longitude</label>
                  <input type="number" step="any" value={wp.lng}
                    onChange={e => updateWaypoint(i, "lng", e.target.value)}
                    className="w-full border border-border rounded-lg px-2 py-1.5 text-sm mt-0.5" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-colors ${saved ? "bg-green-600 text-white" : "bg-primary text-white"}`}>
        <Save className="w-4 h-4" /> {saved ? "✓ Saved!" : "Save Route Coordinates"}
      </button>
      <p className="text-xs text-muted-foreground text-center">Note: Route coordinate changes apply for this session. Update <code>lib/routeData.js</code> to make them permanent.</p>
    </div>
  );
}

// --- Main Component ---
export default function CoordinatesEditor({ registrations, sosAlerts, onSave }) {
  const [section, setSection] = useState("registrations");

  const sections = [
    { key: "registrations", label: "Registrations" },
    { key: "sos", label: "SOS Alerts" },
    { key: "routes", label: "Route Waypoints" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {sections.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${section === s.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">
            {section === "registrations" && "Set Rider Coordinates"}
            {section === "sos" && "Edit SOS Alert Coordinates"}
            {section === "routes" && "Edit Route Waypoint Coordinates"}
          </h3>
        </div>
        {section === "registrations" && <RegistrationCoords registrations={registrations} onSave={onSave} />}
        {section === "sos" && <SosCoords sosAlerts={sosAlerts} onSave={onSave} />}
        {section === "routes" && <RouteWaypointCoords />}
      </div>
    </div>
  );
}