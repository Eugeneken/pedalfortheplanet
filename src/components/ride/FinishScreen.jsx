import React from "react";
import { motion } from "framer-motion";
import { Trophy, Timer, Route, TrendingUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, formatPace } from "@/lib/geoUtils";

export default function FinishScreen({ stats, route, onRestart }) {
  const avgSpeedMps = stats.elapsedTime > 0 ? stats.distanceCovered / stats.elapsedTime : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary to-blue-900 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-white/5" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-white/5" />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
        className="relative z-10"
      >
        <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <Trophy className="w-14 h-14 text-yellow-300" strokeWidth={2} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        <h1 className="text-3xl font-black text-white mb-2">Ride Complete!</h1>
        <p className="text-white/80 text-sm font-medium mb-8">
          {route.name} — {route.distance} km
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 w-full max-w-xs mx-auto">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Timer className="w-5 h-5 text-white/60 mx-auto mb-1" />
              <p className="text-2xl font-black text-white">{formatTime(stats.elapsedTime)}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Total Time</p>
            </div>
            <div>
              <Route className="w-5 h-5 text-white/60 mx-auto mb-1" />
              <p className="text-2xl font-black text-white">{(stats.distanceCovered / 1000).toFixed(1)}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">km Ridden</p>
            </div>
            <div>
              <TrendingUp className="w-5 h-5 text-white/60 mx-auto mb-1" />
              <p className="text-2xl font-black text-white">{formatPace(avgSpeedMps)}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Avg Pace</p>
            </div>
            <div>
              <TrendingUp className="w-5 h-5 text-white/60 mx-auto mb-1" />
              <p className="text-2xl font-black text-white">
                {stats.elapsedTime > 0 ? ((stats.distanceCovered / stats.elapsedTime) * 3.6).toFixed(1) : "0.0"}
              </p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Avg km/h</p>
            </div>
          </div>
        </div>

        <p className="text-lg font-bold text-white/90 mb-6">
          🌍 Pedal for the Planet 🌍
        </p>

        <Button
          onClick={onRestart}
          className="bg-white text-primary hover:bg-white/90 font-bold text-base px-8 py-6 rounded-xl"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Back to Start
        </Button>
      </motion.div>
    </div>
  );
}