import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ROUTE_CONFIG, EVENT_NAME, EVENT_DATE, EVENT_LOCATION } from "@/lib/routeData";
import { Bike, Users, MapPin, Flag, Shield, LogOut, Calendar, AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, Download } from "lucide-react";
import CoordinatesEditor from "@/components/admin/CoordinatesEditor";
import RouteEditor from "@/components/admin/RouteEditor";

const ROUTE_KM_CONFIG = {
  "5":  { color: "#EF4444", emoji: "🔴", label: "5 km — Fun Ride" },
  "16": { color: "#0075E1", emoji: "🔵", label: "16 km — Explorer" },
  "25": { color: "#2E7D32", emoji: "🟢", label: "25 km — Adventure" },
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("registrations");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then((u) => {
        if (!u || u.role !== "admin") { setUnauthorized(true); }
        else { setUser(u); loadData(); }
        setLoading(false);
      })
      .catch(() => base44.auth.redirectToLogin("/admin"));
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    const [regs, sos] = await Promise.all([
      base44.entities.Registration.list("-created_date", 200),
      base44.entities.SosAlert.list("-created_date", 50),
    ]);
    setRegistrations(regs);
    setSosAlerts(sos);
    setRefreshing(false);
  };

  const resolveAlert = async (id) => {
    await base44.entities.SosAlert.update(id, { status: "resolved" });
    setSosAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a));
  };

  const exportToExcel = () => {
    const headers = ["Name", "Email", "Phone", "Route (km)", "Tier", "T-Shirt Size", "Payment Status", "Bib Number", "Registered On"];
    const rows = registrations.map(r => [
      r.name,
      r.email,
      r.phone,
      r.route_km,
      r.tier,
      r.tshirt_size || "",
      r.payment_status,
      r.bib_number || "",
      new Date(r.created_date).toLocaleDateString("en-KE"),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TCR2026_Registrations_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const markAsPaid = async (id) => {
    await base44.entities.Registration.update(id, { payment_status: "paid" });
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, payment_status: "paid" } : r));
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (unauthorized) return (
    <div className="fixed inset-0 flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-xl font-black text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-sm mb-6">This dashboard is for event administrators only.</p>
        <a href="/" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl text-sm">← Back to Event Site</a>
      </div>
    </div>
  );

  const activeAlerts = sosAlerts.filter(a => a.status === "active");
  const byRoute = ["5", "16", "25"].map(km => ({
    km,
    count: registrations.filter(r => r.route_km === km).length,
    ...ROUTE_KM_CONFIG[km],
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white px-5 pt-12 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wide">Admin</span>
            </div>
            <button onClick={() => base44.auth.logout("/")}
              className="flex items-center gap-1.5 text-white/80 text-xs font-semibold hover:text-white">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
          <h1 className="text-2xl font-black">Race Dashboard</h1>
          <p className="text-white/75 text-sm mt-0.5">{EVENT_NAME}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{EVENT_DATE}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{EVENT_LOCATION}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Users className="w-5 h-5 text-primary" />} label="Registered" value={registrations.length} />
          <StatCard icon={<Flag className="w-5 h-5 text-accent" />} label="Routes" value={3} />
          <StatCard
            icon={<AlertTriangle className={`w-5 h-5 ${activeAlerts.length > 0 ? "text-red-500" : "text-yellow-500"}`} />}
            label="SOS Active"
            value={activeAlerts.length}
            highlight={activeAlerts.length > 0}
          />
        </div>

        {/* Route breakdown */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Bike className="w-4 h-4 text-primary" /> Registrations by Route
          </h2>
          <div className="space-y-3">
            {byRoute.map(r => {
              const pct = registrations.length ? Math.round((r.count / registrations.length) * 100) : 0;
              return (
                <div key={r.km} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{r.emoji}</span>
                      <span className="font-bold text-sm text-foreground">{r.label}</span>
                    </div>
                    <span className="text-sm font-black" style={{ color: r.color }}>{r.count} riders</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "registrations", label: `Riders (${registrations.length})` },
            { key: "sos", label: `SOS Alerts${activeAlerts.length > 0 ? ` 🔴${activeAlerts.length}` : ""}` },
            { key: "coordinates", label: "📍 Coordinates" },
            { key: "routes", label: "🗺️ Routes" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === tab.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {tab.label}
            </button>
          ))}
          <button onClick={loadData} disabled={refreshing}
            className="ml-auto p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Registrations tab */}
        {activeTab === "registrations" && (
          <div className="space-y-2">
            <div className="flex justify-end">
              <button onClick={exportToExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                <Download className="w-3.5 h-3.5" /> Export Excel (.csv)
              </button>
            </div>
            {registrations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No registrations yet.</p>
            )}
            {registrations.map(r => {
              const rc = ROUTE_KM_CONFIG[r.route_km] || { color: "#888", emoji: "⚪", label: r.route_km + " km" };
              return (
                <div key={r.id} className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">{rc.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground truncate">{r.name}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: rc.color + "18", color: rc.color }}>
                        {rc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{r.email}</span>
                      <span className="text-xs text-muted-foreground">{r.phone}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.payment_status === "paid" ? "✓ Paid" : "Pending"}
                    </span>
                    {r.payment_status !== "paid" && (
                      <button onClick={() => markAsPaid(r.id)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white hover:bg-blue-700 transition-colors">
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SOS tab */}
        {activeTab === "sos" && (
          <div className="space-y-3">
            {sosAlerts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No SOS alerts yet.</p>
            )}
            {sosAlerts.map(alert => (
              <div key={alert.id}
                className={`border rounded-2xl p-4 ${alert.status === "active" ? "bg-red-50 border-red-200" : "bg-card border-border opacity-60"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${alert.status === "active" ? "text-red-500" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-black text-sm text-foreground">
                        {alert.rider_name || "Unknown Rider"}
                        {alert.status === "resolved" && <span className="ml-2 text-xs font-semibold text-green-600">✓ Resolved</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.route_name} {alert.rider_phone && `· ${alert.rider_phone}`}
                      </p>
                      {alert.lat && alert.lng && (
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">
                          {alert.lat.toFixed(5)}, {alert.lng.toFixed(5)}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(alert.created_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {alert.maps_url && (
                      <a href={alert.maps_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                        <MapPin className="w-3 h-3" /> Map
                      </a>
                    )}
                    {alert.status === "active" && (
                      <button onClick={() => resolveAlert(alert.id)}
                        className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-3 h-3" /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coordinates tab */}
        {activeTab === "coordinates" && (
          <CoordinatesEditor registrations={registrations} sosAlerts={sosAlerts} onSave={loadData} />
        )}

        {/* Routes tab */}
        {activeTab === "routes" && (
          <RouteEditor />
        )}

        {/* Links */}
        <div className="text-center pt-2 pb-8 flex gap-4 justify-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary font-medium">← Event Site</a>
          <a href="/ride" className="text-sm text-muted-foreground hover:text-primary font-medium">🚴 Rider App</a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight }) {
  return (
    <div className={`border rounded-2xl p-3 text-center ${highlight ? "bg-red-50 border-red-200" : "bg-card border-border"}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className={`text-xl font-black ${highlight ? "text-red-600" : "text-foreground"}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{label}</div>
    </div>
  );
}