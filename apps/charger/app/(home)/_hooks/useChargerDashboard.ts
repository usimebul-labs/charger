import { useState, useMemo } from "react";
import { Station } from "../_components/types";
import { STATIONS } from "../_components/constants";
import { upsertChargers } from "../../actions/charger";

export const useChargerDashboard = () => {
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const filteredStations = useMemo(() => {
    return STATIONS.filter((s) => {
      if (showOnlyAvailable) return s.status === "충전 가능";
      return true;
    });
  }, [showOnlyAvailable]);

  const availableSlow = useMemo(() =>
    STATIONS.filter((s) => s.type === "완속" && s.status === "충전 가능").length
    , []);

  const availableFast = useMemo(() =>
    STATIONS.filter((s) => s.type === "급속" && s.status === "충전 가능").length
    , []);

  const handleRefresh = async () => {
    try {
      const response = await upsertChargers();
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
