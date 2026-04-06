"use client"

import { useState, useMemo } from "react";
import { getStations } from "../../actions/charger";
import { STATIONS } from "../_components/constants";

export const useChargerDashboard = () => {
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const filteredStations = useMemo(() => {
    return STATIONS.filter((s) => {
      if (showOnlyAvailable) return s.status.value === "충전 가능";
      return true;
    });
  }, [showOnlyAvailable]);

  const availableSlow = useMemo(() =>
    STATIONS.filter((s) => s.type.value === "완속" && s.status.value === "충전 가능").length
    , []);

  const availableFast = useMemo(() =>
    STATIONS.filter((s) => s.type.value === "급속" && s.status.value === "충전 가능").length
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
