// claytonwingfield/scorecard/scorecard-df0083917b0a689308eabf73078d01dcdba168cb/components/Sorting/Filters/Hooks/useInitializeFilterOptions.js

import { useEffect } from "react";

export default function useInitializeFilterOptions({
  dataSets,
  tableVisibilityOptions,
  setActiveFilters,
  setFilterOptions,
}) {
  useEffect(() => {
    setActiveFilters([{ type: "Date Range", label: "MTD" }]);

    // FIX: dataSets is now a flat array of staff objects (data.staffs from GraphQL).
    // We use it directly as the combined data.
    const combinedData = dataSets;

    // Managers list cannot be derived directly from the flat staff data.
    // Leaving as an empty array to keep the filter in place.
    const managers = [];

    // Supervisors are now derived from the unique 'teamname' values (which represents the supervisor).
    const supervisors = [
      ...new Set(combinedData.map((item) => item.teamname).filter(Boolean)),
    ];

    // Agents are now derived from the unique 'agentname' values.
    const agents = [
      ...new Set(combinedData.map((item) => item.agentname).filter(Boolean)),
    ];

    setFilterOptions([
      {
        id: "managerFilter",
        name: "Manager",
        options: managers.map((manager) => ({
          type: "Manager",
          value: manager,
          label: manager,
        })),
      },
      {
        id: "supervisorFilter",
        name: "Supervisor",
        options: supervisors.map((supervisor) => ({
          type: "Supervisor",
          value: supervisor,
          label: supervisor,
        })),
      },
      {
        id: "agentFilter",
        name: "Agent",
        options: agents.map((agent) => ({
          type: "Agent",
          value: agent,
          label: agent,
        })),
      },
    ]);
  }, [dataSets, tableVisibilityOptions, setActiveFilters, setFilterOptions]);
}
