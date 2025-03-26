// utils/searchUtils.js
export function performSearch({
  activeFilters,
  fromDate,
  toDate,
  dataSets,
  allTeamData,
  router,
  setIsLoading,
}) {
  // Set loading state
  setIsLoading(true);

  // Utility to format a date as YYYY-MM-DD
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

  // Delay execution by 5 seconds (if needed)
  setTimeout(() => {
    // 1) If Agent(s) exist, agent is top priority
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

    // 2) If only a Supervisor is chosen (no Manager, no Agent)
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
          supervisor: sup, // Now singular!
          managers: managerOfSupervisor,
          agents: allAgentsUnderSupervisor.join(","),
        },
      });
      return;
    }

    // 3) If Manager + Supervisor are chosen (and no Agent)
    if (
      selectedSupervisors.length > 0 &&
      selectedManagers.length > 0 &&
      selectedAgents.length === 0
    ) {
      // For simplicity, assume only one manager & one supervisor are picked.
      const mgr = selectedManagers[0];
      const sup = selectedSupervisors[0];
      // Filter rows matching that manager and supervisor
      const rows = allTeamData.filter(
        (d) => d.manager === mgr && d.supervisor === sup
      );
      const agentsUnderManagerAndSupervisor = [
        ...new Set(rows.map((r) => r.agent).filter(Boolean)),
      ];

      // Corrected branch 3
      router.push({
        pathname: "/customer-service/daily-metrics/supervisor",
        query: {
          ...dateQuery,
          dataSets: JSON.stringify(dataSets),
          supervisor: sup, // Changed here
          managers: mgr,
          agents: agentsUnderManagerAndSupervisor.join(","),
        },
      });

      return;
    }

    // 4) If only Manager is chosen => gather ALL supervisors & agents under that manager
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

    // 5) Fallback: If Manager + Supervisor are chosen but no Agent
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

    // Otherwise, no valid filters have been selected.
    alert("Please select a Manager, Supervisor, or Agent before searching.");
  }, 5000);
}
