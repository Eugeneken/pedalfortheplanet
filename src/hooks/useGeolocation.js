import { useState, useEffect, useRef, useCallback } from "react";

export default function useGeolocation(enabled = false) {
  const [position, setPosition] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const onSuccess = (pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
      setSpeed(pos.coords.speed || 0);
      setAccuracy(pos.coords.accuracy);
      setError(null);
    };

    const onError = (err) => {
      setError(err.message);
    };

    watchId.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 2000,
    });

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [enabled]);

  return { position, speed, accuracy, error };
}