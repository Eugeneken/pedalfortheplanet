import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTurnArrow, formatDistance } from "@/lib/geoUtils";
import {
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  CornerUpRight,
  CornerUpLeft,
  Undo2,
  Flag,
  MapPin
} from "lucide-react";

const turnIcons = {
  start: ArrowUp,
  straight: ArrowUp,
  right: ArrowRight,
  left: ArrowLeft,
  slight_right: CornerUpRight,
  slight_left: CornerUpLeft,
  u_turn: Undo2,
  checkpoint: MapPin,
  finish: Flag,
};

export default function DirectionBanner({ waypoint, distanceToWaypoint, routeColor }) {
  if (!waypoint) return null;

  const Icon = turnIcons[waypoint.type] || ArrowUp;
  const arrow = getTurnArrow(waypoint.type);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={waypoint.instruction}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 z-[1000] safe-top"
      >
        <div
          className="mx-3 mt-3 rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: routeColor }}
        >
          <div className="flex items-center gap-3 p-4">
            {/* Direction icon */}
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-white arrow-bounce" strokeWidth={3} />
            </div>

            {/* Instruction text */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base leading-snug line-clamp-2">
                {waypoint.instruction}
              </p>
              {waypoint.label && (
                <p className="text-white/75 text-xs font-semibold mt-0.5">
                  📍 {waypoint.label}
                </p>
              )}
            </div>

            {/* Distance badge */}
            <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[64px]">
              <span className="text-white font-black text-lg leading-none block">
                {distanceToWaypoint < 1000
                  ? Math.round(distanceToWaypoint)
                  : (distanceToWaypoint / 1000).toFixed(1)}
              </span>
              <span className="text-white/80 text-[10px] font-bold uppercase">
                {distanceToWaypoint < 1000 ? "m" : "km"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}