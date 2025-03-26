// components/Sorting/Filters/Hooks/useFilterChange.js

import { useCallback } from "react";

export default function useFilterChange({
  activeFilters,
  setActiveFilters,
  allTeamData,
}) {
  // 1) handleFilterChange
  const handleFilterChange = useCallback(
    (type, selectedValues) => {
      // 1. Remove existing filters of this category
      let otherFilters = activeFilters.filter((f) => f.type !== type);

      // 2. Build new filters for this category
      const newFilters = selectedValues.map((value) => ({
        type,
        label: value,
      }));

      // -----------------------------
      // AUTO-FILL LOGIC
      // -----------------------------

      // A) If user picks an Agent, auto-fill its Supervisor and Manager
      if (type === "Agent" && selectedValues.length === 1) {
        const selectedAgent = selectedValues[0];

        // find the row in allTeamData for this agent
        const row = allTeamData.find((d) => d.agent === selectedAgent);

        if (row) {
          // Check if we already have the correct Manager; if not, replace Manager filters
          const hasCorrectManager = otherFilters.some(
            (f) => f.type === "Manager" && f.label === row.manager
          );
          if (!hasCorrectManager) {
            // Remove any existing Manager filters
            otherFilters = otherFilters.filter((f) => f.type !== "Manager");

            // Add the correct manager
            otherFilters.push({
              type: "Manager",
              label: row.manager,
            });
          }

          // Check if we already have the correct Supervisor; if not, replace Supervisor filters
          const hasCorrectSupervisor = otherFilters.some(
            (f) => f.type === "Supervisor" && f.label === row.supervisor
          );
          if (!hasCorrectSupervisor) {
            // Remove any existing Supervisor filters
            otherFilters = otherFilters.filter((f) => f.type !== "Supervisor");

            // Add the correct supervisor
            otherFilters.push({
              type: "Supervisor",
              label: row.supervisor,
            });
          }
        }
      }

      // B) If user picks a Supervisor, auto-fill its Manager
      if (type === "Supervisor" && selectedValues.length === 1) {
        const selectedSupervisor = selectedValues[0];

        // find the row in allTeamData for this supervisor
        const row = allTeamData.find(
          (d) => d.supervisor === selectedSupervisor
        );

        if (row) {
          const hasCorrectManager = otherFilters.some(
            (f) => f.type === "Manager" && f.label === row.manager
          );
          if (!hasCorrectManager) {
            // Remove any existing Manager filters
            otherFilters = otherFilters.filter((f) => f.type !== "Manager");

            // Add the correct manager
            otherFilters.push({
              type: "Manager",
              label: row.manager,
            });
          }
        }
      }

      // -----------------------------
      // Merge everything and update
      // -----------------------------
      setActiveFilters([...otherFilters, ...newFilters]);
    },
    [activeFilters, setActiveFilters, allTeamData]
  );

  return { handleFilterChange };
}
