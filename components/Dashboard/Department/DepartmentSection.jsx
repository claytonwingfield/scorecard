"use client";
import React, { useMemo } from "react";
import DashboardSection from "@/components/Dashboard/Hierarchy/DashboardSection";
import {
  customerServiceAverageScore,
  customerServiceAHT,
  qualityInfo,
  customerServiceAdherence,
  allTeamData,
} from "@/data/customerServiceData";
import { useRouter } from "next/router";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import {
  fakeAHTData,
  fakeAdherenceData,
  fakeQualityData,
  fakeMtdScoreData,
} from "@/data/fakeMetricsData";
import { useQuery } from "@apollo/client";
import { GET_ALL_DEPARTMENTS } from "@/graphql/queries";

// Customer Service Section (shared)
const fakeDataMap = {
  "Average Handle Time": fakeAHTData,
  Adherence: fakeAdherenceData,
  Quality: fakeQualityData,
  "Average Score": fakeMtdScoreData,
};
const metricMap = {
  "Average Handle Time": "ahtTeam",
  Adherence: "adherence",
  Quality: "qualityTeam",
  "Average Score": "mtdScore",
};

// helper to build subordinateStats skeleton
const makeSubordinateStats = (managerNames, parentStats) =>
  managerNames.map((name) => ({
    name,
    metrics: parentStats.map(({ name: metricName }) => ({
      id: `${name}-${metricName}`,
      name: metricName,
      stat: "—", // placeholder until real data arrives
    })),
  }));

// ----------------------------------------------------------------------
// Customer Service Section
// ----------------------------------------------------------------------
export const CustomerServiceSection = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_DEPARTMENTS);
  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  // find the right department
  const dept = data.departments.find((d) => d.name === "Customer Service");

  // compute your parentStats exactly as before
  const avg = (arr, key) =>
    (
      arr.reduce((sum, x) => sum + parseFloat(x[key].replace("%", "")), 0) /
      arr.length
    ).toFixed(2) + "%";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const avgAHT = useMemo(() => {
    const secs = customerServiceAHT.map(({ ahtTeam }) => {
      const [m, s] = ahtTeam.split(":").map(Number);
      return m * 60 + s;
    });
    const avgSec = secs.reduce((a, b) => a + b, 0) / secs.length;
    const m = Math.floor(avgSec / 60);
    const s = Math.round(avgSec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: avgAHT },
    { id: 2, name: "Adherence", stat: avg(qualityInfo, "qualityTeam") },
    { id: 3, name: "Quality", stat: avg(qualityInfo, "qualityTeam") },
    {
      id: 4,
      name: "Average Score",
      stat: avg(customerServiceAverageScore, "mtdScore"),
    },
  ];

  const cityParam = router.query.city || "";
  const isOKC = cityParam.toLowerCase() === "oklahoma-city";

  // build the OKC filter
  let managersToShow = dept.managers;
  if (isOKC) {
    const okcManagerIds = new Set(
      dept.supervisors
        .filter((s) => s.location === "Oklahoma_City")
        .map((s) => s.manager.documentId)
    );
    managersToShow = dept.managers.filter((m) =>
      okcManagerIds.has(m.documentId)
    );
  }

  // then everything else stays the same…
  const managerNames = managersToShow.map((m) => m.name);
  const subordinateStats = makeSubordinateStats(managerNames, parentStats);

  return (
    <DashboardSection
      name="Department"
      title={dept.name}
      headerLink="/customer-service/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/customer-service/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
    />
  );
};

// ----------------------------------------------------------------------
// Help Desk Section
// ----------------------------------------------------------------------
export const HelpDeskSection = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_DEPARTMENTS);
  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  const dept = data.departments.find((d) => d.name === "Help Desk");

  // your existing static parentStats
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "05:45" },
    { id: 2, name: "Adherence", stat: "92%" },
    { id: 3, name: "Quality", stat: "93%" },
    { id: 4, name: "Average Score", stat: "95%" },
  ];
  const cityParam = router.query.city || "";
  const isOKC = cityParam.toLowerCase() === "oklahoma-city";
  let managersToShow = dept.managers;
  if (isOKC) {
    managersToShow = dept.managers.filter((_, idx) => {
      const sup = dept.supervisors[idx];
      return sup?.location === "Oklahoma_City";
    });
  }
  const managerNames = managersToShow.map((m) => m.name);
  const subordinateStats = makeSubordinateStats(managerNames, parentStats);

  return (
    <DashboardSection
      name="Department"
      title={dept.name}
      headerLink="/help-desk/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/help-desk/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
    />
  );
};

export const ElectronicDispatchSection = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_DEPARTMENTS);
  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  const dept = data.departments.find((d) => d.name === "Electronic Dispatch");
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "06:00" },
    { id: 2, name: "Adherence", stat: "90%" },
    { id: 3, name: "Quality", stat: "92%" },
    { id: 4, name: "Average Score", stat: "94%" },
  ];

  const cityParam = router.query.city || "";
  const isOKC = cityParam.toLowerCase() === "oklahoma-city";
  let managersToShow = dept.managers;
  if (isOKC) {
    managersToShow = dept.managers.filter((_, idx) => {
      const sup = dept.supervisors[idx];
      return sup?.location === "Oklahoma_City";
    });
  }
  const managerNames = managersToShow.map((m) => m.name);
  const subordinateStats = makeSubordinateStats(managerNames, parentStats);

  return (
    <DashboardSection
      name="Department"
      title={dept.name}
      headerLink="/electronic-dispatch/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/electronic-dispatch/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
    />
  );
};

export const WrittenCommunicationSection = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_DEPARTMENTS);
  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  const dept = data.departments.find((d) => d.name === "Written Communication");
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "05:50" },
    { id: 2, name: "Adherence", stat: "91%" },
    { id: 3, name: "Quality", stat: "90%" },
    { id: 4, name: "Average Score", stat: "93%" },
  ];
  const cityParam = router.query.city || "";
  const isOKC = cityParam.toLowerCase() === "oklahoma-city";
  let managersToShow = dept.managers;
  if (isOKC) {
    managersToShow = dept.managers.filter((_, idx) => {
      const sup = dept.supervisors[idx];
      return sup?.location === "Oklahoma_City";
    });
  }
  const managerNames = managersToShow.map((m) => m.name);
  const subordinateStats = makeSubordinateStats(managerNames, parentStats);

  return (
    <DashboardSection
      name="Department"
      title={dept.name}
      headerLink="/written-communication/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/written-communication/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
    />
  );
};

export const ResolutionsSection = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_DEPARTMENTS);
  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  const dept = data.departments.find((d) => d.name === "Resolutions");
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "06:10" },
    { id: 2, name: "Adherence", stat: "89%" },
    { id: 3, name: "Quality", stat: "91%" },
    { id: 4, name: "Average Score", stat: "92%" },
  ];
  const cityParam = router.query.city || "";
  const isOKC = cityParam.toLowerCase() === "oklahoma-city";
  let managersToShow = dept.managers;
  if (isOKC) {
    managersToShow = dept.managers.filter((_, idx) => {
      const sup = dept.supervisors[idx];
      return sup?.location === "Oklahoma_City";
    });
  }
  const managerNames = managersToShow.map((m) => m.name);
  const subordinateStats = makeSubordinateStats(managerNames, parentStats);

  return (
    <DashboardSection
      name="Department"
      title={dept.name}
      headerLink="/resolutions/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/resolutions/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
      agent={false}
    />
  );
};
