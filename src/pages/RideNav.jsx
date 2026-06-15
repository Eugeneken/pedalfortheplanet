import React, { useState, useEffect, useRef, useCallback } from "react";
import { ROUTE_CONFIG, WAYPOINT_THRESHOLD_METERS, OFF_ROUTE_THRESHOLD_METERS } from "@/lib/routeData";
import { getDistanceMeters, getDistanceFromRoute, calculateRouteDistance } from "@/lib/geoUtils";
import useGeolocation from "@/hooks/useGeolocation";
import useWakeLock from "@/hooks/useWakeLock";

import StartScreen from "@/components/ride/StartScreen";
import RideMap from "@/components/ride/RideMap";
import DirectionBanner from "@/components/ride/DirectionBanner";
import StatsPanel from "@/components/ride/StatsPanel";
import OffRouteAlert from "@/components/ride/OffRouteAlert";
import RecenterButton from "@/components/ride/RecenterButton";
import FinishScreen from "@/components/ride/FinishScreen";
import SosButton from "@/components/ride/SosButton";

export default function RideNav() {
  // App state
  const [screen, setScreen] = useState("start"); // start | riding | finished
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [riderRegistration, setRiderRegistration] = useState(null);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(1); // start at waypoint 1 (after start)
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [followRider, setFollowRider] = useState(true);

  // Stats
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);
  const prevPositionRef = useRef(null);
  const timerRef = useRef(null);

  // Geolocation & wake lock
  const isRiding = screen === "riding";
  const { position: riderPosition, speed, accuracy, error: geoError } = useGeolocation(isRiding);
  useWakeLock(isRiding);

  const route = selectedRouteId ? ROUTE_CONFIG[selectedRouteId] : null;

  // Timer
  useEffect(() => {
    if (isRiding) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRiding]);

  // Navigation logic — runs whenever position updates
  useEffect(() => {
    if (!isRiding || !riderPosition || !route) return;

    const [lat, lng] = riderPosition;

    // Track distance covered
    if (prevPositionRef.current) {
      const moved = getDistanceMeters(
        prevPositionRef.current[0], prevPositionRef.current[1],
        lat, lng
      );
      // Only count if moved more than 2m and less than 100m (filter GPS jitter / teleport)
      if (moved > 2 && moved < 100) {
        setDistanceCovered((prev) => prev + moved);
      }
    }
    prevPositionRef.current = [lat, lng];

    // Check distance to current waypoint
    if (currentWaypointIndex < route.waypoints.length) {
      const wp = route.waypoints[currentWaypointIndex];
      const distToWp = getDistanceMeters(lat, lng, wp.lat, wp.lng);

      // Auto-advance waypoint
      if (distToWp < WAYPOINT_THRESHOLD_METERS) {
        if (wp.type === "finish") {
          // Ride complete!
          setScreen("finished");
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setCurrentWaypointIndex((prev) => Math.min(prev + 1, route.waypoints.length - 1));
        }
      }
    }

    // Check if off route
    const routeDist = getDistanceFromRoute(lat, lng, route.waypoints);
    setIsOffRoute(routeDist > OFF_ROUTE_THRESHOLD_METERS);
  }, [riderPosition, isRiding, route, currentWaypointIndex]);

  // Handlers
  const handleSelectRoute = useCallback((routeId, registration) => {
    setRiderRegistration(registration || null);
    setSelectedRouteId(routeId);
    setCurrentWaypointIndex(1);
    setDistanceCovered(0);
    setElapsedTime(0);
    prevPositionRef.current = null;
    setIsOffRoute(false);
    setFollowRider(true);
    setScreen("riding");
  }, []);

  const handleRestart = useCallback(() => {
    setScreen("start");
    setSelectedRouteId(null);
    setCurrentWaypointIndex(1);
    setDistanceCovered(0);
    setElapsedTime(0);
    prevPositionRef.current = null;
    setIsOffRoute(false);
  }, []);

  const handleRecenter = useCallback(() => {
    setFollowRider(true);
  }, []);

  // Current waypoint data
  const currentWaypoint =
    route && currentWaypointIndex < route.waypoints.length
      ? route.waypoints[currentWaypointIndex]
      : null;

  const distanceToWaypoint =
    riderPosition && currentWaypoint
      ? getDistanceMeters(riderPosition[0], riderPosition[1], currentWaypoint.lat, currentWaypoint.lng)
      : 0;

  const stats = {
    distanceCovered,
    currentSpeed: speed,
    elapsedTime,
    averageSpeed: elapsedTime > 0 ? distanceCovered / elapsedTime : 0,
  };

  // Screens
  if (screen === "start") {
    return <StartScreen onSelectRoute={handleSelectRoute} />;
  }

  if (screen === "finished" && route) {
    return (
      <FinishScreen
        stats={stats}
        route={route}
        onRestart={handleRestart}
      />
    );
  }

  // Riding screen
  return (
    <div className="fixed inset-0 bg-background">
      {/* Map */}
      <div className="absolute inset-0">
        {route && (
          <RideMap
            route={route}
            riderPosition={riderPosition}
            currentWaypointIndex={currentWaypointIndex}
            followRider={followRider}
          />
        )}
      </div>

      {/* Direction banner */}
      <DirectionBanner
        waypoint={currentWaypoint}
        distanceToWaypoint={distanceToWaypoint}
        routeColor={route?.color || "#0075E1"}
      />

      {/* Off-route alert */}
      <OffRouteAlert isOffRoute={isOffRoute} />

      {/* Recenter button */}
      <RecenterButton
        onClick={handleRecenter}
        isFollowing={followRider}
      />

      {/* SOS button */}
      <SosButton riderPosition={riderPosition} route={route} registration={riderRegistration} />

      {/* Stats panel */}
      {route && (
        <StatsPanel
          stats={stats}
          routeColor={route.color}
          routeDistance={route.distance}
        />
      )}

      {/* GPS error indicator */}
      {geoError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1001] bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          GPS: {geoError}
        </div>
      )}
    </div>
  );
}