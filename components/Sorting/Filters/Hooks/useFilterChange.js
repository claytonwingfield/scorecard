import { useCallback } from "react";

export default function useFilterChange({
  activeFilters,
  setActiveFilters,
  allTeamData,
}) {
  const handleFilterChange = useCallback(
    (type, selectedValues) => {
      let otherFilters = activeFilters.filter((f) => f.type !== type);

      const newFilters = selectedValues.map((value) => ({
        type,
        label: value,
      }));

      if (type === "Agent" && selectedValues.length === 1) {
        const selectedAgent = selectedValues[0];

        const row = allTeamData.find((d) => d.agent === selectedAgent);

        if (row) {
          const hasCorrectManager = otherFilters.some(
            (f) => f.type === "Manager" && f.label === row.manager
          );
          if (!hasCorrectManager) {
            otherFilters = otherFilters.filter((f) => f.type !== "Manager");

            otherFilters.push({
              type: "Manager",
              label: row.manager,
            });
          }

          const hasCorrectSupervisor = otherFilters.some(
            (f) => f.type === "Supervisor" && f.label === row.supervisor
          );
          if (!hasCorrectSupervisor) {
            otherFilters = otherFilters.filter((f) => f.type !== "Supervisor");

            otherFilters.push({
              type: "Supervisor",
              label: row.supervisor,
            });
          }
        }
      }

      if (type === "Supervisor" && selectedValues.length === 1) {
        const selectedSupervisor = selectedValues[0];

        const row = allTeamData.find(
          (d) => d.supervisor === selectedSupervisor
        );

        if (row) {
          const hasCorrectManager = otherFilters.some(
            (f) => f.type === "Manager" && f.label === row.manager
          );
          if (!hasCorrectManager) {
            otherFilters = otherFilters.filter((f) => f.type !== "Manager");

            otherFilters.push({
              type: "Manager",
              label: row.manager,
            });
          }
        }
      }

      setActiveFilters([...otherFilters, ...newFilters]);
    },
    [activeFilters, setActiveFilters, allTeamData]
  );

  return { handleFilterChange };
}
