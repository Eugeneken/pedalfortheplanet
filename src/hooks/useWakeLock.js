import { useEffect, useRef } from "react";

export default function useWakeLock(enabled = false) {
  const wakeLock = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const requestWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          wakeLock.current = await navigator.wakeLock.request("screen");
        } catch (err) {
          console.log("Wake Lock failed:", err.message);
        }
      }
    };

    requestWakeLock();

    // Re-acquire on visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && enabled) {
        requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLock.current) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
    };
  }, [enabled]);
}