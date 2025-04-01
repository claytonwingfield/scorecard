import { useEffect } from "react";

export default function useInitializeFilterOptions({
  dataSets,
  tableVisibilityOptions,
  setActiveFilters,
  setFilterOptions,
}) {
  useEffect(() => {
    setActiveFilters([{ type: "Date Range", label: "MTD" }]);

    const combinedData = dataSets.reduce(
      (acc, dataSet) => [...acc, ...dataSet.data],
      []
    );
    const managers = [...new Set(combinedData.map((item) => item.manager))];
    const supervisors = [
      ...new Set(combinedData.map((item) => item.supervisor)),
    ];
    const agents = [
      ...new Set(
        combinedData.filter((item) => item.agent).map((item) => item.agent)
      ),
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
