export const scoreCardConfig = {
  title: "Scorecard",
  id: "ScoreCardTable",
  columns: [
    { key: "manager", label: "Manager" },
    { key: "supervisor", label: "Supervisor" },
    { key: "agent", label: "Agent" },
    { key: "mtdScore", label: "Score" },
    { key: "mtdRanking", label: "Ranking" },
  ],
  chartConfig: {
    defaultXAxis: "agent",
    groupByOptions: [
      { value: "", label: "Agent" },
      { value: "supervisor", label: "Supervisor" },
      { value: "manager", label: "Manager" },
    ],
    chartTypeOptions: [
      { value: "Bar Chart", label: "Bar Chart" },
      { value: "Line Chart", label: "Line Chart" },
    ],
    yDataKey: "mtdScore",
    percentColumns: ["mtdScore"],
    numericColumns: ["mtdRanking"],
    isScoreCard: true,
  },
  filterFn: (data, activeFilters) => {
    const selectedManagers = activeFilters
      .filter((f) => f.type === "Manager")
      .map((f) => f.label);
    const selectedSupervisors = activeFilters
      .filter((f) => f.type === "Supervisor")
      .map((f) => f.label);
    const selectedAgents = activeFilters
      .filter((f) => f.type === "Agent")
      .map((f) => f.label);

    return data.filter((item) => {
      const managerOk =
        selectedManagers.length === 0 ||
        selectedManagers.includes(item.manager);
      const supervisorOk =
        selectedSupervisors.length === 0 ||
        selectedSupervisors.includes(item.supervisor);
      const agentOk =
        selectedAgents.length === 0 || selectedAgents.includes(item.agent);

      return managerOk && supervisorOk && agentOk;
    });
  },
};
