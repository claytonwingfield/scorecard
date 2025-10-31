// claytonwingfield/scorecard/scorecard-df0083917b0a689308eabf73078d01dcdba168cb/components/Tables/Hooks/useGetTableData.js

import { useCallback, useMemo } from "react";

// Helper functions (calculateAverage, formatSecondsToMMSS, formatPercent remain the same)
const calculateAverage = (dataArray, key) => {
  // ... (omitted for brevity, assume logic remains the same)
  if (!dataArray || dataArray.length === 0) return null;

  const validValues = dataArray
    .map((item) => item[key])
    .filter((value) => value !== null && value !== undefined && !isNaN(value));

  if (validValues.length === 0) return null;

  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

const formatSecondsToMMSS = (seconds) => {
  // ... (omitted for brevity, assume logic remains the same)
  if (seconds === null || seconds === undefined) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const formatPercent = (value) => {
  // ... (omitted for brevity, assume logic remains the same)
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(2)}%`;
};

export default function useGetTableData({ dataSets }) {
  const processedData = useMemo(() => {
    if (!dataSets || dataSets.length === 0) return {};

    const supervisors = new Set(
      dataSets.map((s) => s.teamname).filter(Boolean)
    );

    const transformedStaffs = dataSets.map((staff) => {
      const isTeamLeader = supervisors.has(staff.agentname);

      const avgAHT = calculateAverage(
        staff.webexes,
        "average_inbound_handle_time_seconds"
      );
      const formattedAHT = formatSecondsToMMSS(avgAHT);

      let formattedAdherence;
      if (isTeamLeader) {
        formattedAdherence = "N/A";
      } else {
        const avgAdherence = calculateAverage(staff.wfms, "adherence");
        formattedAdherence = formatPercent(avgAdherence);
      }

      const avgQuality = calculateAverage(staff.qualities, "totalscore");
      const formattedQuality = formatPercent(avgQuality);

      const formattedScore = "N/A";

      return {
        // Keep these fields for compatibility with existing components (filters, sorting, column visibility)
        agent: staff.agentname,
        supervisor: staff.teamname,
        manager: null,

        // Metric keys for overview tables
        ahtTeam: formattedAHT,
        adherence: formattedAdherence,
        qualityTeam: formattedQuality,
        mtdScore: formattedScore,

        // Additional info
        department: staff.department,
        name: staff.agentname,
        team: staff.teamname || "N/A",
      };
    });

    // Create the canonical composite list, which all team tables and the ScoreCard table will use
    const compositeList = transformedStaffs.map((d) => ({
      agent: d.agent,
      supervisor: d.supervisor,
      manager: d.manager,
      score: d.mtdScore,
      aht: d.ahtTeam,
      adherence: d.adherence,
      quality: d.qualityTeam,
    }));

    // 4. Map ALL table names explicitly to the appropriate data structure
    return {
      AverageHandleTimeTable: transformedStaffs.map((d) => ({
        agent: d.agent,
        supervisor: d.supervisor,
        manager: d.manager,
        ahtTeam: d.ahtTeam,
      })),

      AdherenceTable: transformedStaffs.map((d) => ({
        agent: d.agent,
        supervisor: d.supervisor,
        manager: d.manager,
        adherence: d.adherence,
      })),

      QualityTable: transformedStaffs.map((d) => ({
        agent: d.agent,
        supervisor: d.supervisor,
        manager: d.manager,
        qualityTeam: d.qualityTeam,
      })),

      AverageScoreTable: transformedStaffs.map((d) => ({
        agent: d.agent,
        supervisor: d.supervisor,
        manager: d.manager,
        mtdScore: d.mtdScore,
      })),

      // The ScoreCardTable is loading, so its name is likely correct.
      ScoreCardTable: compositeList,

      // Explicitly map all other known team tables to the composite list data
      TeamOne: compositeList,
      TeamTwo: compositeList,
      TeamThree: compositeList,
      TeamFour: compositeList,
      TeamFive: compositeList,
      TeamSix: compositeList,
    };
  }, [dataSets]);

  const getTableData = useCallback(
    (tableName) => {
      // Simplification: just return the data based on the table name key
      // This is much safer than conditional logic on the name.
      return processedData[tableName] || [];
    },
    [processedData]
  );

  return { getTableData };
}
