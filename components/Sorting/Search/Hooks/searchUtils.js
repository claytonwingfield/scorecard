export function performSearch({
  activeFilters,
  fromDate,
  toDate,
  dataSets,
  allTeamData,
  router,
  setIsLoading,
}) {
  setIsLoading(true);

  const dateToParam = (date) =>
    date ? date.toISOString().split("T")[0] : undefined;

  const selectedAgents = activeFilters
    .filter((f) => f.type === "Agent")
    .map((f) => f.label);
  const selectedSupervisors = activeFilters
    .filter((f) => f.type === "Supervisor")
    .map((f) => f.label);
  const selectedManagers = activeFilters
    .filter((f) => f.type === "Manager")
    .map((f) => f.label);

  const dateQuery = {
    from: dateToParam(fromDate),
    to: dateToParam(toDate),
  };

  setTimeout(() => {
    if (selectedAgents.length > 0) {
      router.push({
        pathname: "/customer-service/daily-metrics/agent",
        query: {
          ...dateQuery,
          dataSets: JSON.stringify(dataSets),
          agents: selectedAgents.join(","),
          supervisors: selectedSupervisors.join(","),
          managers: selectedManagers.join(","),
        },
      });
      return;
    }

    if (
      selectedSupervisors.length > 0 &&
      selectedManagers.length === 0 &&
      selectedAgents.length === 0
    ) {
      const sup = selectedSupervisors[0];
      const rowsForSupervisor = allTeamData.filter((d) => d.supervisor === sup);
      if (rowsForSupervisor.length === 0) {
        alert("No data found for that supervisor.");
        return;
      }
      const managerOfSupervisor = rowsForSupervisor[0].manager;
      const allAgentsUnderSupervisor = [
        ...new Set(rowsForSupervisor.map((r) => r.agent).filter(Boolean)),
      ];

      router.push({
        pathname: "/customer-service/daily-metrics/supervisor",
        query: {
          ...dateQuery,
          dataSets: JSON.stringify(dataSets),
          supervisor: sup,
          managers: managerOfSupervisor,
          agents: allAgentsUnderSupervisor.join(","),
        },
      });
      return;
    }

    if (
      selectedSupervisors.length > 0 &&
      selectedManagers.length > 0 &&
      selectedAgents.length === 0
    ) {
      const mgr = selectedManagers[0];
      const sup = selectedSupervisors[0];

      const rows = allTeamData.filter(
        (d) => d.manager === mgr && d.supervisor === sup
      );
      const agentsUnderManagerAndSupervisor = [
        ...new Set(rows.map((r) => r.agent).filter(Boolean)),
      ];

      router.push({
        pathname: "/customer-service/daily-metrics/supervisor",
        query: {
          ...dateQuery,
          dataSets: JSON.stringify(dataSets),
          supervisor: sup,
          managers: mgr,
          agents: agentsUnderManagerAndSupervisor.join(","),
        },
      });

      return;
    }

    if (selectedManagers.length > 0 && selectedSupervisors.length === 0) {
      const mgr = selectedManagers[0];
      const rowsForManager = allTeamData.filter((d) => d.manager === mgr);

      const allSupervisors = [
        ...new Set(rowsForManager.map((r) => r.supervisor).filter(Boolean)),
      ];
      const allAgents = [
        ...new Set(rowsForManager.map((r) => r.agent).filter(Boolean)),
      ];

      router.push({
        pathname: "/customer-service/daily-metrics/manager",
        query: {
          ...dateQuery,
          dataSets: JSON.stringify(dataSets),
          managers: mgr,
          supervisors: allSupervisors.join(","),
          agents: allAgents.join(","),
        },
      });
      return;
    }

    if (selectedManagers.length > 0) {
      router.push({
        pathname: "/customer-service/daily-metrics/manager",
        query: {
          ...dateQuery,
          dataSets: JSON.stringify(dataSets),
          managers: selectedManagers.join(","),
          supervisors: selectedSupervisors.join(","),
        },
      });
      return;
    }

    alert("Please select a Manager, Supervisor, or Agent before searching.");
  }, 5000);
}
