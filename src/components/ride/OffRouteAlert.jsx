import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function OffRouteAlert({ isOffRoute }) {
  return (
    <AnimatePresence>
      {isOffRoute && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-24 left-0 right-0 z-[1001] flex justify-center px-4"
        >
          <div className="bg-destructive text-destructive-foreground rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 max-w-sm">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
            <div>
              <p className="font-bold text-sm">Off Route!</p>
              <p className="text-xs opacity-90">Navigate back to the marked trail</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}