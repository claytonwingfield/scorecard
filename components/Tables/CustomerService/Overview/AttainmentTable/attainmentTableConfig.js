export const attainmentTableConfig = {
  title: "Attainment",
  columns: [
    { key: "manager", label: "Manager" },
    { key: "supervisor", label: "Supervisor" },
    { key: "mtdScore", label: "Score" },
    { key: "mtdRanking", label: "Ranking" },
  ],
  chartConfig: {
    defaultXAxis: "supervisor",
    groupByOptions: [
      { value: "", label: "Supervisor" },
      { value: "manager", label: "Manager" },
    ],
    chartTypeOptions: [
      { value: "Bar Chart", label: "Bar Chart" },
      { value: "Line Chart", label: "Line Chart" },
    ],
    yDataKey: "mtdScore",
    percentColumns: ["mtdScore"],
    numericColumns: ["mtdRanking"],
    isScoreCard: false,
  },
  filterFn: (data, activeFilters) => {
    const selectedManagers = activeFilters
      .filter((f) => f.type === "Manager")
      .map((f) => f.label);
    const selectedSupervisors = activeFilters
      .filter((f) => f.type === "Supervisor")
      .map((f) => f.label);

    return data.filter((item) => {
      const managerOk =
        selectedManagers.length === 0 ||
        selectedManagers.includes(item.manager);
      const supervisorOk =
        selectedSupervisors.length === 0 ||
        selectedSupervisors.includes(item.supervisor);
      return managerOk && supervisorOk;
    });
  },
};
