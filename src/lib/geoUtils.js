/**
 * Geolocation & navigation utility functions
 */

// Haversine distance in meters between two points
export function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Bearing between two points in degrees (0-360)
export function getBearing(lat1, lng1, lat2, lng2) {
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// Format distance for display
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Format time as hh:mm:ss
export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Format speed in km/h
export function formatSpeed(metersPerSecond) {
  if (!metersPerSecond || metersPerSecond < 0.3) return "0.0";
  return (metersPerSecond * 3.6).toFixed(1);
}

// Format pace in min/km
export function formatPace(metersPerSecond) {
  if (!metersPerSecond || metersPerSecond < 0.3) return "--:--";
  const paceSecsPerKm = 1000 / metersPerSecond;
  const mins = Math.floor(paceSecsPerKm / 60);
  const secs = Math.floor(paceSecsPerKm % 60);
  if (mins > 99) return "--:--";
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Calculate total route distance from waypoints
export function calculateRouteDistance(waypoints) {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += getDistanceMeters(
      waypoints[i - 1].lat, waypoints[i - 1].lng,
      waypoints[i].lat, waypoints[i].lng
    );
  }
  return total;
}

// Find nearest point on route (simplified: nearest segment)
export function getDistanceFromRoute(lat, lng, waypoints) {
  let minDist = Infinity;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const d = pointToSegmentDistance(
      lat, lng,
      waypoints[i].lat, waypoints[i].lng,
      waypoints[i + 1].lat, waypoints[i + 1].lng
    );
    if (d < minDist) minDist = d;
  }
  return minDist;
}

function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) {
    return getDistanceMeters(px, py, ax, ay);
  }
  let t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  const closestLat = ax + t * dx;
  const closestLng = ay + t * dy;
  return getDistanceMeters(px, py, closestLat, closestLng);
}

// Get arrow rotation for turn type
export function getTurnArrow(type) {
  const arrows = {
    start: { symbol: "▲", rotation: 0, label: "Go" },
    straight: { symbol: "▲", rotation: 0, label: "Straight" },
    right: { symbol: "▲", rotation: 90, label: "Right" },
    left: { symbol: "▲", rotation: -90, label: "Left" },
    slight_right: { symbol: "▲", rotation: 45, label: "Bear right" },
    slight_left: { symbol: "▲", rotation: -45, label: "Bear left" },
    u_turn: { symbol: "▲", rotation: 180, label: "U-turn" },
    checkpoint: { symbol: "◆", rotation: 0, label: "Checkpoint" },
    finish: { symbol: "🏁", rotation: 0, label: "Finish" },
  };
  return arrows[type] || arrows.straight;
}