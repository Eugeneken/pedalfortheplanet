/**
 * ROUTE DATA CONFIG — Tatu City Riders 2026
 * 
 * Replace these coordinates with actual GPX data from Limitless Kenya.
 * Each route is an ordered array of waypoints with lat/lng and optional turn instructions.
 * 
 * Turn types: "start", "left", "right", "slight_left", "slight_right", 
 *             "straight", "u_turn", "checkpoint", "finish"
 */

// Tatu City approximate center: -1.0833, 36.8597
const TATU_CITY_CENTER = [-1.0833, 36.8597];

export const ROUTE_CONFIG = {
  red: {
    id: "red",
    name: "Kids Fun Race",
    distance: 5,
    color: "#EF4444",
    description: "5 km — Kids Fun Race",
    waypoints: [
      { lat: -1.0833, lng: 36.8597, label: "Start / Finish", type: "start", instruction: "Begin your ride! Head north on Main Avenue" },
      { lat: -1.0813, lng: 36.8597, label: null, type: "straight", instruction: "Continue straight for 300m" },
      { lat: -1.0793, lng: 36.8610, label: null, type: "right", instruction: "Turn right onto Park Road" },
      { lat: -1.0793, lng: 36.8640, label: "Aid Station 1", type: "checkpoint", instruction: "Aid station ahead — water and snacks" },
      { lat: -1.0780, lng: 36.8660, label: null, type: "left", instruction: "Turn left onto Forest Trail" },
      { lat: -1.0760, lng: 36.8660, label: null, type: "straight", instruction: "Keep straight through the forest section" },
      { lat: -1.0740, lng: 36.8640, label: "Checkpoint 1", type: "checkpoint", instruction: "Checkpoint — you're doing great!" },
      { lat: -1.0740, lng: 36.8620, label: null, type: "left", instruction: "Turn left onto River Road" },
      { lat: -1.0760, lng: 36.8600, label: null, type: "right", instruction: "Turn right and head south" },
      { lat: -1.0780, lng: 36.8600, label: "Aid Station 2", type: "checkpoint", instruction: "Last aid station before finish" },
      { lat: -1.0800, lng: 36.8597, label: null, type: "slight_left", instruction: "Bear left towards the finish line" },
      { lat: -1.0820, lng: 36.8597, label: null, type: "straight", instruction: "Final stretch — sprint to the finish!" },
      { lat: -1.0833, lng: 36.8597, label: "Finish!", type: "finish", instruction: "🎉 Congratulations! You've completed the Kids Fun Race!" },
    ],
  },
  blue: {
    id: "blue",
    name: "The Explorers",
    distance: 25,
    color: "#0075E1",
    description: "25 km — The Explorers",
    waypoints: [
      { lat: -1.0833, lng: 36.8597, label: "Start / Finish", type: "start", instruction: "Begin your ride! Head northeast on Tatu Boulevard" },
      { lat: -1.0810, lng: 36.8610, label: null, type: "straight", instruction: "Continue straight for 500m" },
      { lat: -1.0790, lng: 36.8630, label: null, type: "right", instruction: "Turn right onto Savanna Road" },
      { lat: -1.0770, lng: 36.8660, label: "Aid Station 1", type: "checkpoint", instruction: "Aid station — refuel and hydrate" },
      { lat: -1.0750, lng: 36.8690, label: null, type: "left", instruction: "Turn left onto Ridge Trail" },
      { lat: -1.0720, lng: 36.8690, label: null, type: "straight", instruction: "Climb ahead — steady pace" },
      { lat: -1.0700, lng: 36.8670, label: "Checkpoint 1", type: "checkpoint", instruction: "Checkpoint 1 — 10km mark" },
      { lat: -1.0680, lng: 36.8650, label: null, type: "slight_right", instruction: "Bear right onto Valley Path" },
      { lat: -1.0680, lng: 36.8620, label: null, type: "left", instruction: "Turn left at the junction" },
      { lat: -1.0700, lng: 36.8600, label: "Aid Station 2", type: "checkpoint", instruction: "Aid station — halfway point!" },
      { lat: -1.0720, lng: 36.8580, label: null, type: "right", instruction: "Turn right onto Acacia Lane" },
      { lat: -1.0740, lng: 36.8560, label: null, type: "straight", instruction: "Long straight — enjoy the views" },
      { lat: -1.0760, lng: 36.8560, label: "Checkpoint 2", type: "checkpoint", instruction: "Checkpoint 2 — 18km mark" },
      { lat: -1.0780, lng: 36.8570, label: null, type: "slight_left", instruction: "Bear left and head back" },
      { lat: -1.0800, lng: 36.8580, label: null, type: "right", instruction: "Turn right onto Return Road" },
      { lat: -1.0810, lng: 36.8590, label: "Aid Station 3", type: "checkpoint", instruction: "Last aid station — almost there!" },
      { lat: -1.0820, lng: 36.8597, label: null, type: "straight", instruction: "Final approach — give it everything!" },
      { lat: -1.0833, lng: 36.8597, label: "Finish!", type: "finish", instruction: "🎉 Amazing! You've conquered The Explorers route!" },
    ],
  },
  green: {
    id: "green",
    name: "Rising Heat",
    distance: 16,
    color: "#22C55E",
    description: "16 km — Rising Heat",
    waypoints: [
      { lat: -1.0833, lng: 36.8597, label: "Start / Finish", type: "start", instruction: "The marathon begins! Head north with determination" },
      { lat: -1.0800, lng: 36.8610, label: null, type: "straight", instruction: "Warm up — continue straight for 600m" },
      { lat: -1.0770, lng: 36.8630, label: null, type: "right", instruction: "Turn right onto Highland Road" },
      { lat: -1.0740, lng: 36.8660, label: "Aid Station 1", type: "checkpoint", instruction: "First aid station — pace yourself" },
      { lat: -1.0710, lng: 36.8690, label: null, type: "left", instruction: "Turn left onto Mountain Trail" },
      { lat: -1.0680, lng: 36.8710, label: null, type: "straight", instruction: "Big climb ahead — dig deep" },
      { lat: -1.0650, lng: 36.8720, label: "Checkpoint 1", type: "checkpoint", instruction: "Checkpoint 1 — 8km mark, great pace!" },
      { lat: -1.0620, lng: 36.8710, label: null, type: "slight_right", instruction: "Bear right onto Panorama Route" },
      { lat: -1.0600, lng: 36.8690, label: null, type: "left", instruction: "Turn left — scenic section ahead" },
      { lat: -1.0580, lng: 36.8670, label: "Aid Station 2", type: "checkpoint", instruction: "Aid station — eat and drink!" },
      { lat: -1.0580, lng: 36.8640, label: null, type: "right", instruction: "Turn right onto Baobab Boulevard" },
      { lat: -1.0600, lng: 36.8620, label: null, type: "straight", instruction: "Fast flat section — push the pace" },
      { lat: -1.0620, lng: 36.8600, label: "Checkpoint 2", type: "checkpoint", instruction: "Checkpoint 2 — 18km, almost half!" },
      { lat: -1.0640, lng: 36.8580, label: null, type: "left", instruction: "Turn left onto Elephant Pass" },
      { lat: -1.0660, lng: 36.8560, label: null, type: "slight_right", instruction: "Bear right at the fork" },
      { lat: -1.0680, lng: 36.8540, label: "Aid Station 3", type: "checkpoint", instruction: "Halfway aid station — you're crushing it!" },
      { lat: -1.0700, lng: 36.8530, label: null, type: "right", instruction: "Turn right onto Safari Circuit" },
      { lat: -1.0720, lng: 36.8530, label: null, type: "straight", instruction: "Rolling hills — maintain rhythm" },
      { lat: -1.0740, lng: 36.8540, label: "Checkpoint 3", type: "checkpoint", instruction: "Checkpoint 3 — 28km mark" },
      { lat: -1.0760, lng: 36.8550, label: null, type: "left", instruction: "Turn left onto Homeward Trail" },
      { lat: -1.0780, lng: 36.8560, label: null, type: "right", instruction: "Turn right at the roundabout" },
      { lat: -1.0790, lng: 36.8570, label: "Aid Station 4", type: "checkpoint", instruction: "Final aid station — last push!" },
      { lat: -1.0800, lng: 36.8580, label: null, type: "straight", instruction: "Downhill section — enjoy the speed" },
      { lat: -1.0810, lng: 36.8590, label: null, type: "slight_left", instruction: "Bear left towards Tatu City center" },
      { lat: -1.0820, lng: 36.8595, label: null, type: "straight", instruction: "The crowd is cheering — you can hear them!" },
      { lat: -1.0833, lng: 36.8597, label: "Finish!", type: "finish", instruction: "🎉 LEGENDARY! You've survived the Rising Heat!" },
    ],
  },
};

export const WAYPOINT_THRESHOLD_METERS = 30; // auto-advance within 30m
export const OFF_ROUTE_THRESHOLD_METERS = 100; // alert if 100m+ off route
export const EVENT_CENTER = TATU_CITY_CENTER;
export const EVENT_NAME = "Tatu City Riders 2026";
export const EVENT_TAGLINE = "Pedal for the Planet";
export const EVENT_DATE = "26 September 2026";
export const EVENT_LOCATION = "Tatu City, Kiambu, Kenya";