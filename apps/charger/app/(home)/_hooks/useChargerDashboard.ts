"use client"

import { useState, useMemo } from "react";
import { getStations } from "../../actions/charger";
import { STATIONS } from "../_components/constants";

export const useChargerDashboard = () => {
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const filteredStations = useMemo(() => {
    return STATIONS.filter((s) => {
      if (showOnlyAvailable) return s.status.code === "2" || s.status.code === "9";
      return true;
    });
  }, [showOnlyAvailable]);

  const availableSlow = useMemo(() =>
    STATIONS.filter((s) => s.type.code === "02" && s.status.code === "2" || s.status.code === "9").length
    , []);

  const availableFast = useMemo(() =>
    STATIONS.filter((s) => s.type.code === "06" && s.status.code === "2" || s.status.code === "9").length
    , []);

  const handleRefresh = async () => {
    try {
      const response = await getStations();
      console.log("Charger status refreshed:", response);
    } catch (error) {
      console.error("Failed to refresh charger status:", error);
    }
  };

  return {
    showOnlyAvailable,
    setShowOnlyAvailable,
    filteredStations,
    availableSlow,
    availableFast,
    handleRefresh,
  };
};
