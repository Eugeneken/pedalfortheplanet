import React from "react";
import { Locate } from "lucide-react";

export default function RecenterButton({ onClick, isFollowing }) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-3 z-[1000] w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all active:scale-95 ${
        isFollowing
          ? "bg-primary text-white"
          : "bg-white/95 backdrop-blur-sm text-foreground border border-border/50"
      }`}
      style={{ top: "calc(50% - 24px)" }}
    >
      <Locate className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}