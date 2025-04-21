"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { defaultSort, upArrow, downArrow } from "@/components/Icons/icons";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/20/solid";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import Header from "@/components/Navigation/header";
import BarChart from "@/components/Charts/BarChart";
import LineChartTime from "@/components/Charts/LineChartTime";
import CompareBarChart from "@/components/Charts/CompareBarChart";
import CompareLineChart from "@/components/Charts/CompareLineChart";
import { customerServiceData } from "@/data/customerServiceData";
import award from "@/public/animations/award.json";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import CompareRed from "@/public/compare-red.svg";
import CompareYellow from "@/public/compare-yellow.svg";
import dynamic from "next/dynamic";
import SupervisorDashboard from "@/components/Dashboard/Hierarchy/SupervisorDashboard";
import Image from "next/image";
import StatCard from "@/components/Card/StatCard";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const averageHandleTimeGoal = "5:30 - 6:30";
const qualityGoal = "88%";
const adherenceGoal = "88%";
const averageScoreGoal = "95%";

function getBgColor(statName, statValue) {
  if (!statValue || statValue === "N/A") {
    return "bg-lovesWhite/20";
  }
  if (statName === "Average Handle Time") {
    const [mins, secs] = statValue.split(":").map(Number);
    const totalSeconds = mins * 60 + secs;
    const [lowStr, highStr] = averageHandleTimeGoal.split(" - ");
    const [lowMins, lowSecs] = lowStr.split(":").map(Number);
    const [highMins, highSecs] = highStr.split(":").map(Number);
    const lowerBound = lowMins * 60 + lowSecs;
    const upperBound = highMins * 60 + highSecs;
    return totalSeconds >= lowerBound && totalSeconds <= upperBound
      ? "bg-lovesGreen"
      : "bg-lovesPrimaryRed";
  } else {
    const num = parseFloat(statValue.replace("%", ""));
    if (statName === "Adherence") {
      return num >= parseFloat(adherenceGoal)
        ? "bg-lovesGreen"
        : "bg-lovesPrimaryRed";
    } else if (statName === "Quality") {
      return num >= parseFloat(qualityGoal)
        ? "bg-lovesGreen"
        : "bg-lovesPrimaryRed";
    } else if (statName === "Average Score") {
      return num >= parseFloat(averageScoreGoal)
        ? "bg-lovesGreen"
        : "bg-lovesPrimaryRed";
    }
  }
  return "bg-lovesWhite";
}

function computeAverageTime(data, key) {
  const values = data
    .map((item) => item[key])
    .filter((val) => val !== undefined && typeof val === "string");
  if (values.length === 0) return "N/A";
  const totalSeconds = values.reduce((sum, timeStr) => {
    const [mins, secs] = timeStr.split(":").map(Number);
    return sum + mins * 60 + secs;
  }, 0);
  const avgSeconds = totalSeconds / values.length;
  const avgMins = Math.floor(avgSeconds / 60);
  const avgSecs = Math.round(avgSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${avgMins}:${avgSecs}`;
}

const computeAveragePercentage = (data, key) => {
  const values = data
    .map((item) => item[key])
    .filter((val) => val !== undefined && typeof val === "string");
  if (values.length === 0) return "N/A";
  const numbers = values.map((val) => parseFloat(val.replace("%", "")));
  const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  return avg.toFixed(2) + "%";
};

function generateRandomMetricValue(metricName) {
  if (metricName === "Average Handle Time") {
    let seconds = Math.floor(Math.random() * (390 - 300 + 1)) + 300;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else if (metricName === "Average Score") {
    let value = (Math.random() * 15 + 90).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Adherence") {
    let value = (Math.random() * 10 + 85).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Quality") {
    let value = (Math.random() * 15 + 80).toFixed(2);
    return `${value}%`;
  }
  return "0%";
}

function generateRandomAHTValueInMinutes() {
  const minSeconds = 4 * 60 + 30;
  const maxSeconds = 6 * 60 + 30;

  const seconds = Math.random() * (maxSeconds - minSeconds) + minSeconds;
  return seconds / 60;
}

function generateFakeDataForMarch2025ForMetric(metricKey, generator) {
  const data = [];
  const startDate = new Date(2025, 2, 1);
  const endDate = new Date(2025, 2, 31);
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const formattedDate = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}`;
    data.push({ date: formattedDate, [metricKey]: generator() });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
}
export const fakeAHTDataMain = generateFakeDataForMarch2025ForMetric(
  "ahtTeam",
  generateRandomAHTValueInMinutes
);
export const fakeAHTDataComparison = generateFakeDataForMarch2025ForMetric(
  "ahtTeam",
  generateRandomAHTValueInMinutes
);

export const fakeAdherenceMain = generateFakeDataForMarch2025ForMetric(
  "adherence",
  () => generateRandomMetricValue("Adherence")
);
export const fakeAdherenceComparison = generateFakeDataForMarch2025ForMetric(
  "adherence",
  () => generateRandomMetricValue("Adherence")
);
export const fakeQualityMain = generateFakeDataForMarch2025ForMetric(
  "qualityTeam",
  () => generateRandomMetricValue("Quality")
);
export const fakeQualityComparison = generateFakeDataForMarch2025ForMetric(
  "qualityTeam",
  () => generateRandomMetricValue("Quality")
);
export const fakeMtdScoreMain = generateFakeDataForMarch2025ForMetric(
  "mtdScore",
  () => generateRandomMetricValue("Average Score")
);
export const fakeMtdScoreComparison = generateFakeDataForMarch2025ForMetric(
  "mtdScore",
  () => generateRandomMetricValue("Average Score")
);

export default function SupervisorDailyMetricsPage() {
  const router = useRouter();
  const { from, to, supervisor, managers } = router.query;
  const [isSupervisorDropdownOpen, setIsSupervisorDropdownOpen] =
    useState(false);
  const pages = [
    {
      name: "Manager",
      href: `/customer-service/daily-metrics/supervisor?supervisors=${encodeURIComponent(
        supervisor
      )}&from=${from}&to=${to}`,
      current: false,
    },
    { name: "Supervisor", href: "#", current: true },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const isDetail = true;
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSupervisor, setComparisonSupervisor] = useState(null);
  const allTeamData = customerServiceData.allTeamData;
  const allSupervisors = [
    ...new Set(allTeamData.map((item) => item.supervisor)),
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const supervisorOptions = allSupervisors.map((supervisor) => ({
    label: supervisor,
    value: supervisor,
  }));
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const dataSets = customerServiceData.dataSets;

  const filteredDataSets = dataSets.map((set) => ({
    ...set,
    data: set.data.filter((row) => row.supervisor === supervisor),
  }));

  const teamDataSets = filteredDataSets.filter((ds) =>
    ds.component.toLowerCase().startsWith("team")
  );
  const mainChartData = teamDataSets.reduce(
    (acc, ds) => acc.concat(ds.data),
    []
  );

  const fullTeamDataSets = dataSets.filter((ds) =>
    ds.component.toLowerCase().startsWith("team")
  );
  const fullChartData = fullTeamDataSets.reduce(
    (acc, ds) => acc.concat(ds.data),
    []
  );
  const chartData = teamDataSets.reduce((acc, ds) => acc.concat(ds.data), []);

  const computeAveragePercentage = (data, key) => {
    const values = data
      .map((item) => item[key])
      .filter((val) => val !== undefined && typeof val === "string");
    if (values.length === 0) return "N/A";
    const numbers = values.map((val) => parseFloat(val.replace("%", "")));
    const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    return avg.toFixed(2) + "%";
  };
  function aggregateMetrics(data) {
    return {
      AHT: computeAverageTime(data, "AHT"),
      mtdScore: computeAveragePercentage(data, "mtdScore"),
      Adherence: computeAveragePercentage(data, "Adherence"),
      Quality: computeAveragePercentage(data, "Quality"),
    };
  }

  const computeAverageTime = (data, key) => {
    const values = data
      .map((item) => item[key])
      .filter((val) => val !== undefined && typeof val === "string");
    if (values.length === 0) return "N/A";
    const totalSeconds = values.reduce((sum, timeStr) => {
      const [mins, secs] = timeStr.split(":").map(Number);
      return sum + mins * 60 + secs;
    }, 0);
    const avgSeconds = totalSeconds / values.length;
    const avgMins = Math.floor(avgSeconds / 60);
    const avgSecs = Math.round(avgSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${avgMins}:${avgSecs}`;
  };
  const mainSupervisorData = aggregateMetrics(
    mainChartData.filter((item) => item.supervisor === supervisor)
  );
  const comparedSupervisorData = comparisonSupervisor
    ? aggregateMetrics(
        fullChartData.filter(
          (item) => item.supervisor === comparisonSupervisor.value
        )
      )
    : {};

  const parsePercentage = (value) => {
    if (!value || value === "N/A") return null;
    return parseFloat(value.replace("%", ""));
  };

  const parseAHT = (value) => {
    if (!value || value === "N/A") return null;
    const [mins, secs] = value.split(":").map(Number);
    return mins * 60 + secs;
  };
  const avgScore = useMemo(
    () => computeAveragePercentage(chartData, "mtdScore"),
    [chartData]
  );
  const avgAdherence = useMemo(
    () => computeAveragePercentage(chartData, "Adherence"),
    [chartData]
  );
  const avgQuality = useMemo(
    () => computeAveragePercentage(chartData, "Quality"),
    [chartData]
  );
  const avgAHT = useMemo(
    () => computeAverageTime(chartData, "AHT"),
    [chartData]
  );
  const filteredSupervisorOptions = supervisorOptions.filter(
    (option) => option.label !== supervisor
  );
  const combinedData = [
    {
      metric: "Average Handle Time",
      mainValue: parseAHT(mainSupervisorData.AHT),
      comparedValue: comparedSupervisorData.AHT
        ? parseAHT(comparedSupervisorData.AHT)
        : null,
    },
    {
      metric: "Average Score",
      mainValue: parsePercentage(mainSupervisorData.mtdScore),
      comparedValue: comparedSupervisorData.mtdScore
        ? parsePercentage(comparedSupervisorData.mtdScore)
        : null,
    },
    {
      metric: "Adherence",
      mainValue: parsePercentage(mainSupervisorData.Adherence),
      comparedValue: comparedSupervisorData.Adherence
        ? parsePercentage(comparedSupervisorData.Adherence)
        : null,
    },
    {
      metric: "Quality",
      mainValue: parsePercentage(mainSupervisorData.Quality),
      comparedValue: comparedSupervisorData.Quality
        ? parsePercentage(comparedSupervisorData.Quality)
        : null,
    },
  ];
  const statCards = [
    { id: 1, name: "Average Handle Time", stat: avgAHT },
    { id: 2, name: "Adherence", stat: avgAdherence },
    { id: 3, name: "Quality", stat: avgQuality },
    { id: 4, name: "Average Score", stat: avgScore },
  ];

  const [groupByField, setGroupByField] = useState("agent");
  const [metric, setMetric] = useState("Average Score");
  const [chartType, setChartType] = useState("Bar Chart");

  const metricOptions = [
    { value: "Average Score", label: "Average Score" },
    { value: "Adherence", label: "Adherence" },
    { value: "AHT", label: "AHT" },
    { value: "Quality", label: "Quality" },
  ];

  const chartTypeOptions = [
    { value: "Bar Chart", label: "Bar Chart" },
    { value: "Line Chart", label: "Line Chart" },
  ];

  const metricMapping = {
    "Average Score": "mtdScore",
    Adherence: "Adherence",
    AHT: "AHT",
    Quality: "Quality",
  };
  const compareDataMapping = useMemo(
    () => ({
      "Average Score": {
        main: fakeMtdScoreMain,
        comparison: fakeMtdScoreComparison,
        yDataKey: "mtdScore",
      },
      Adherence: {
        main: fakeAdherenceMain,
        comparison: fakeAdherenceComparison,
        yDataKey: "adherence",
      },
      AHT: {
        main: fakeAHTDataMain,
        comparison: fakeAHTDataComparison,
        yDataKey: "ahtTeam",
      },
      Quality: {
        main: fakeQualityMain,
        comparison: fakeQualityComparison,
        yDataKey: "qualityTeam",
      },
    }),
    []
  );

  const compareChartData = useMemo(() => {
    const metricData = compareDataMapping[metric];
    if (!metricData) return [];
    return metricData.main.map((item, index) => ({
      date: item.date,
      mainValue: item[metricData.yDataKey],
      comparedValue: metricData.comparison[index]?.[metricData.yDataKey],
    }));
  }, [metric, compareDataMapping]);
  const {
    currentDate,
    setCurrentDate,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = useDateRange();

  const [selectedDepartments, setSelectedDepartments] = useState({
    "Customer Service": true,
    "Help Desk": true,
    "Electronic Dispatch": true,
    "Written Communication": true,
    Resolutions: true,
  });

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const xAxisField = groupByField;

  const aggregatedData = useMemo(() => {
    const groups = {};
    chartData.forEach((row) => {
      const key = row.agent;
      if (!groups[key]) {
        groups[key] = {
          agent: row.agent,
          mtdScore: [],
          Adherence: [],
          AHT: [],
          Quality: [],
        };
      }
      if (row.mtdScore)
        groups[key].mtdScore.push(parseFloat(row.mtdScore.replace("%", "")));
      if (row.Adherence)
        groups[key].Adherence.push(parseFloat(row.Adherence.replace("%", "")));
      if (row.Quality)
        groups[key].Quality.push(parseFloat(row.Quality.replace("%", "")));
      if (row.AHT) {
        const [mins, secs] = row.AHT.split(":").map(Number);
        groups[key].AHT.push(mins * 60 + secs);
      }
    });
    const result = [];
    Object.keys(groups).forEach((key) => {
      const group = groups[key];
      const avgMtdScore =
        group.mtdScore.length > 0
          ? (
              group.mtdScore.reduce((a, b) => a + b, 0) / group.mtdScore.length
            ).toFixed(2) + "%"
          : "N/A";
      const avgAdherence =
        group.Adherence.length > 0
          ? (
              group.Adherence.reduce((a, b) => a + b, 0) /
              group.Adherence.length
            ).toFixed(2) + "%"
          : "N/A";
      const avgQuality =
        group.Quality.length > 0
          ? (
              group.Quality.reduce((a, b) => a + b, 0) / group.Quality.length
            ).toFixed(2) + "%"
          : "N/A";
      const avgAHTSeconds =
        group.AHT.length > 0
          ? group.AHT.reduce((a, b) => a + b, 0) / group.AHT.length
          : null;
      let avgAHT = "N/A";
      if (avgAHTSeconds !== null) {
        const m = Math.floor(avgAHTSeconds / 60);
        const s = Math.round(avgAHTSeconds % 60)
          .toString()
          .padStart(2, "0");
        avgAHT = `${m}:${s}`;
      }
      result.push({
        agent: group.agent,
        mtdScore: avgMtdScore,
        Adherence: avgAdherence,
        AHT: avgAHT,
        Quality: avgQuality,
      });
    });
    return result;
  }, [chartData]);

  const sortedAggregatedData = useMemo(() => {
    let sortableItems = [...aggregatedData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const key = sortConfig.key;
        let aValue = a[key];
        let bValue = b[key];

        if (key === "AHT" && aValue !== "N/A" && bValue !== "N/A") {
          const [aM, aS] = aValue.split(":").map(Number);
          const [bM, bS] = bValue.split(":").map(Number);
          aValue = aM * 60 + aS;
          bValue = bM * 60 + bS;
        } else if (
          key !== "supervisor" &&
          key !== "agent" &&
          aValue !== "N/A" &&
          bValue !== "N/A"
        ) {
          aValue = parseFloat(aValue.replace("%", ""));
          bValue = parseFloat(bValue.replace("%", ""));
        } else {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [aggregatedData, sortConfig]);

  const columnsToDisplay = [
    { key: "agent", label: "Agent" },
    { key: "mtdScore", label: "Average Score" },
    { key: "Adherence", label: "Adherence" },
    { key: "AHT", label: "AHT" },
    { key: "Quality", label: "Quality" },
  ];

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return defaultSort;
    }
    return sortConfig.direction === "asc" ? upArrow : downArrow;
  };

  const getTextAlignment = (index) =>
    index === 0 ? "text-left" : "text-center";

  if (!supervisor) {
    return (
      <SupervisorDashboard allTeamData={allTeamData} dataSets={dataSets} />
    );
  }
  const legendPayload = [
    { value: supervisor, color: "#FF0000" },
    { value: comparisonSupervisor?.label || "Compared", color: "#FFEB00" },
  ];
  const renderCustomLegend = (props) => {
    const { payload } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        {payload.map((entry, index) => (
          <div
            key={`legend-item-${index}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: entry.color,
                marginRight: 4,
              }}
            />
            <span
              style={{
                color: isDarkMode ? "#E0E0E0" : "#000000",
                whiteSpace: "nowrap",
              }}
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };
  const detailView = (
    <>
      <div className="lg:hidden mt-4">
        {!showComparison && (
          <nav
            aria-label="Breadcrumb"
            className="inline-flex rounded-md bg-lightGray dark:bg-darkCompBg px-4 py-1 shadow-sm shadow-lovesBlack"
          >
            <ol className="flex space-x-1">
              <li className="flex">
                <div className="flex items-center">
                  <Link
                    href="/customer-service/daily-metrics"
                    className="text-lovesBlack dark:text-darkPrimaryText hover:text-lovesPrimaryRed"
                  >
                    <HomeIcon aria-hidden="true" className="w-4 h-4 shrink-0" />
                    <span className="sr-only font-futura-bold">Home</span>
                  </Link>
                </div>
              </li>

              {pages.map((page) => (
                <li key={page.name} className="flex">
                  <div className="flex items-center">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 44"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="w-4 shrink-0 text-darkBorder dark:text-darkPrimaryText"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a
                      href={page.href}
                      aria-current={page.current ? "page" : undefined}
                      className="ml-1 mr-1 text-sm font-futura-bold text-lovesBlack dark:text-darkPrimaryText hover:text-lovesPrimaryRed"
                    >
                      {page.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {!showComparison && (
          <div className="flex items-center justify-between px-0 lg:mt-0 mt-4 mb-4">
            <div
              className="text-lovesBlack dark:text-darkPrimaryText bg-lightGray dark:bg-darkCompBg font-futura-bold
               shadow-sm shadow-lovesBlack 
               rounded-lg lg:px-2 px-1 py-1 cursor-pointer"
              onClick={() => setShowCalendar(true)}
            >
              {fromDate && toDate
                ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                : "Date Range: Not Selected"}
            </div>

            <FilterCalendarToggle
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              isDetail={isDetail}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
            />
          </div>
        )}
      </div>
      {showComparison ? (
        <>
          <div className="flex flex-col lg:flex-row gap-4 items-stretch text-center ">
            <div className="flex-1">
              <h1 className="text-xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText px-4 mt-4">
                {supervisor}
              </h1>
              <div className="mt-2 flex justify-center">
                <Image
                  src={CompareRed}
                  alt="Compare Icon"
                  width={40}
                  height={40}
                />
              </div>
            </div>

            <div className="flex-1 p-4">
              {!comparisonSupervisor || isSupervisorDropdownOpen ? (
                <>
                  <h2 className="text-lg font-bold text-lovesBlack dark:text-darkPrimaryText mb-2">
                    Select Supervisor
                  </h2>
                  <Listbox
                    value={comparisonSupervisor}
                    onChange={(supervisor) => {
                      setComparisonSupervisor(supervisor);
                      setIsSupervisorDropdownOpen(false);
                    }}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-lovesWhite dark:bg-darkBg py-2 pl-3 pr-10 text-left  focus:outline-none text-md border border-lovesBlack shadow-sm shadow-lovesBlack">
                        <span className="block truncate">
                          {comparisonSupervisor
                            ? comparisonSupervisor.label
                            : "Select a supervisor"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon
                            className="h-5 w-5 text-lovesBlack dark:text-darkPrimaryText"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-lovesWhite dark:bg-darkBg py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filteredSupervisorOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option}
                            className="cursor-pointer select-none relative py-2 pl-10 pr-4"
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CheckIcon
                                      className="h-5 w-5 text-lovesPrimaryRed"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </>
              ) : (
                <div className="grid grid-cols-3 items-center justify-items-center">
                  <div></div>

                  <div className="text-center whitespace-nowrap lg:mr-4 mr-1">
                    <h2 className="text-xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                      {comparisonSupervisor.label}
                    </h2>
                  </div>

                  <div className="text-right ">
                    <button
                      className="border border-lovesBlack rounded-lg shadow-sm shadow-lovesBlack dark:border-darkPrimaryText p-1 "
                      onClick={() => setIsSupervisorDropdownOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        id="change"
                        fill="currentColor"
                        className="w-6 h-6 dark:text-darkPrimaryText"
                      >
                        <path
                          d="M12.0005 9.84354C11.1875 9.84354 10.5283 10.5027 10.5283 11.3158 10.5283 12.1288 11.1875 12.788 12.0005 12.788 12.8136 12.788 13.4728 12.1288 13.4728 11.3158 13.4728 10.5027 12.8136 9.84354 12.0005 9.84354zM9.02832 11.3158C9.02832 9.67425 10.359 8.34354 12.0005 8.34354 13.6421 8.34354 14.9728 9.67425 14.9728 11.3158 14.9728 12.9573 13.6421 14.288 12.0005 14.288 10.359 14.288 9.02832 12.9573 9.02832 11.3158zM12 16.0213C10.595 16.0213 9.34458 16.4483 8.44548 17.112 8.11223 17.3581 7.64265 17.2873 7.39665 16.9541 7.15064 16.6208 7.22137 16.1512 7.55462 15.9052 8.73177 15.0363 10.3002 14.5213 12 14.5213 13.6999 14.5213 15.2683 15.0363 16.4455 15.9052 16.7787 16.1512 16.8495 16.6208 16.6035 16.9541 16.3574 17.2873 15.8879 17.3581 15.5546 17.112 14.6555 16.4483 13.4051 16.0213 12 16.0213z"
                          clip-rule="evenodd"
                        ></path>
                        <path
                          d="M12 5.228C7.71979 5.228 4.25 8.69779 4.25 12.978C4.25 17.2582 7.71979 20.728 12 20.728C14.9594 20.728 17.5325 19.0695 18.8387 16.6278C19.034 16.2625 19.4885 16.1248 19.8538 16.3202C20.219 16.5156 20.3567 16.9701 20.1613 17.3353C18.6046 20.2455 15.5344 22.228 12 22.228C6.89137 22.228 2.75 18.0866 2.75 12.978C2.75 7.86936 6.89137 3.728 12 3.728C12.4142 3.728 12.75 4.06378 12.75 4.478C12.75 4.89221 12.4142 5.228 12 5.228ZM15.3422 5.12424C15.5376 4.759 15.9921 4.62129 16.3573 4.81667C19.2675 6.37338 21.25 9.44359 21.25 12.978C21.25 13.3922 20.9142 13.728 20.5 13.728C20.0858 13.728 19.75 13.3922 19.75 12.978C19.75 10.0186 18.0915 7.44547 15.6498 6.13932C15.2846 5.94395 15.1468 5.48948 15.3422 5.12424Z"
                          clip-rule="evenodd"
                        ></path>
                        <path
                          d="M9.52749 2.28401C9.78503 1.95959 10.2568 1.90539 10.5812 2.16293L12.7965 3.92155C13.1209 4.17909 13.1751 4.65086 12.9175 4.97527L11.1589 7.19051C10.9014 7.51492 10.4296 7.56913 10.1052 7.31159C9.78077 7.05404 9.72657 6.58227 9.98411 6.25786L11.2764 4.63003L9.64857 3.33773C9.32416 3.08019 9.26995 2.60842 9.52749 2.28401Z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {comparisonSupervisor && !isSupervisorDropdownOpen && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={CompareYellow}
                    alt="Compare Yellow Icon"
                    width={40}
                    height={40}
                  />
                </div>
              )}
            </div>
          </div>
          <hr className="border-lovesBlack mt-0 mx-4 mb-0" />
          {!comparisonSupervisor || isSupervisorDropdownOpen ? (
            <div className="my-4 ">
              <div className="grid lg:grid-cols-2 grid-cols-1 p-2 ">
                <div className="p-2">
                  <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-4 bg-lovesGray dark:bg-darkCompBg rounded w-1/3" />

                      <div className="flex flex-col space-y-2">
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "50px" }}
                        />
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "50px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-4 bg-lovesGray dark:bg-darkCompBg rounded w-1/3" />

                      <div className="flex flex-col space-y-2">
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "50px" }}
                        />
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "50px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-4 bg-gray-300 dark:bg-darkCompBg rounded w-1/3" />

                      <div className="flex flex-col space-y-2">
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "50px" }}
                        />
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "50px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-4 bg-gray-300 dark:bg-darkCompBg w-1/3" />

                      <div className="flex flex-col space-y-2">
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "50px" }}
                        />
                        <div
                          className="bg-lovesGray dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "50px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className=" bg-lightGray dark:bg-darkCompBg  p-4 ">
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 px-2">
                <div className=" bg-lovesWhite dark:bg-darkBg  px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">
                    Average Handle Time
                  </h3>

                  <CompareBarChart
                    data={combinedData.filter(
                      (d) => d.metric === "Average Handle Time"
                    )}
                    xDataKey="metric"
                    supervisor={supervisor}
                    comparisonSupervisor={comparisonSupervisor}
                  />
                </div>
                <div className=" bg-lovesWhite dark:bg-darkBg  px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">
                    Average Score
                  </h3>
                  <CompareBarChart
                    data={combinedData.filter(
                      (d) => d.metric === "Average Score"
                    )}
                    xDataKey="metric"
                    supervisor={supervisor}
                    comparisonSupervisor={comparisonSupervisor}
                  />
                </div>
                <div className=" bg-lovesWhite dark:bg-darkBg   px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">Adherence</h3>
                  <CompareBarChart
                    data={combinedData.filter((d) => d.metric === "Adherence")}
                    xDataKey="metric"
                    supervisor={supervisor}
                    comparisonSupervisor={comparisonSupervisor}
                  />
                </div>
                <div className=" bg-lovesWhite dark:bg-darkBg  px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">Quality</h3>
                  <CompareBarChart
                    data={combinedData.filter((d) => d.metric === "Quality")}
                    xDataKey="metric"
                    supervisor={supervisor}
                    comparisonSupervisor={comparisonSupervisor}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-8 ">
                {renderCustomLegend({ payload: legendPayload })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="group bg-lightGray dark:bg-darkCompBg shadow-md shadow-darkBorder dark:shadow-darkCompBg border-2 dark:border-darkCompBg border-lightGray dark:shadow-sm p-4 rounded-lg mt-4 mb-4">
            <div className="lg:px-8">
              <div className="mb-4 mt-2 text-center">
                <div className="flex justify-center">
                  <div className="cursor-pointer">
                    <h1 className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesBlack ">
                      {supervisor}
                    </h1>
                  </div>
                </div>
              </div>
              <dl className="mt-5 py-0 lg:px-2 px-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ">
                {statCards.map((item, index) => {
                  const bgColorClass = getBgColor(item.name, item.stat);
                  const qualifies = bgColorClass.trim() === "bg-lovesGreen";

                  const delay = index * 300;
                  return (
                    <StatCard
                      key={item.id}
                      name={item.name}
                      stat={item.stat}
                      qualifies={qualifies}
                      delay={delay}
                    />
                  );
                })}
              </dl>
            </div>
            <div className="lg:mt-0 mt-5 lg:p-6 p-0">
              <div className="border-2  dark:border-darkBg shadow-md shadow-darkBorder dark:shadow-none  border-darkBorder dark:bg-darkBg  bg-darkBorder lg:m-4 rounded-lg p-2">
                <div className="flex flex-col h-full">
                  <div
                    className="flex 
             flex-col items-center space-y-2    
             lg:flex-row lg:justify-between      
             dark:bg-darkBg shadow-md 
             border-2 border-darkBorder dark:border-darkBg dark:shadow-none 
             pl-4 pt-2 pb-4"
                  >
                    <h2 className="text-xl font-futura-bold dark:text-darkPrimaryText text-lovesWhite rounded-lg">
                      Performance Chart
                    </h2>
                    <div className="flex space-x-2 pr-2">
                      <div className="lg:w-48 w-32">
                        <Listbox value={metric} onChange={setMetric}>
                          <div className="relative">
                            <Listbox.Button className="bg-lightGray dark:bg-darkBorder relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                              <span className="block truncate">{metric}</span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronDownIcon
                                  className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-lightGray dark:bg-darkBorder shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                              {metricOptions.map((option) => (
                                <Listbox.Option
                                  key={option.value}
                                  value={option.value}
                                  className={({ active }) =>
                                    `${
                                      active
                                        ? "text-lovesBlack bg-lightGray dark:text-darkPrimaryText dark:bg-darkBorder font-futura-bold"
                                        : "text-lovesBlack bg-lightGray dark:text-darkPrimaryText dark:bg-darkBorder font-futura"
                                    } cursor-default select-none relative py-2 pl-10 pr-4`
                                  }
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {option.label}
                                      </span>
                                      {selected && (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active
                                              ? "text-lovesPrimaryRed"
                                              : "text-lovesPrimaryRed"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>

                      <div className="lg:w-48 w-32">
                        <Listbox value={chartType} onChange={setChartType}>
                          <div className="relative">
                            <Listbox.Button className="bg-lightGray dark:bg-darkBorder relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                              <span className="block truncate">
                                {chartType}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronDownIcon
                                  className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-lightGray dark:bg-darkBorder shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                              {chartTypeOptions.map((option) => (
                                <Listbox.Option
                                  key={option.value}
                                  value={option.value}
                                  className={({ active }) =>
                                    `${
                                      active
                                        ? "text-lovesBlack bg-lightGray dark:text-darkPrimaryText dark:bg-darkBorder font-futura-bold"
                                        : "text-lovesBlack bg-lightGray dark:text-darkPrimaryText dark:bg-darkBorder font-futura"
                                    } cursor-default select-none relative py-2 pl-10 pr-4`
                                  }
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {option.label}
                                      </span>
                                      {selected && (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active
                                              ? "text-lovesPrimaryRed"
                                              : "text-lovesPrimaryRed"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="w-5 h-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                    </div>
                  </div>

                  {chartType === "Bar Chart" ? (
                    <div className="h-[500px] ">
                      <BarChart
                        data={chartData}
                        xDataKey={xAxisField}
                        yDataKey={metricMapping[metric]}
                        groupByKey={groupByField}
                        disableGrouping={false}
                      />
                    </div>
                  ) : (
                    <div className="h-[500px] ">
                      <LineChartTime
                        data={chartData}
                        xDataKey={xAxisField}
                        yDataKey={metricMapping[metric]}
                        groupByKey={groupByField}
                        disableGrouping={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:p-4 py-2 mt-4">
                <div className="bg-darkBorder dark:bg-darkBg shadow-md shadow-darkBorder dark:shadow-darkBg rounded-lg p-1.5 w-full max-w-full no-scrollbar">
                  <div className="flex-grow overflow-y-auto no-scrollbar">
                    <table className="min-w-full divide-y divide-darkBorder dark:divide-darkBg">
                      <thead className="bg-darkBorder dark:bg-darkBg">
                        <tr>
                          {columnsToDisplay.map((col, index) => (
                            <th
                              key={col.key}
                              onClick={() => handleSort(col.key)}
                              className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-md font-futura text-lovesWhite dark:text-darkPrimaryText sm:pl-6 cursor-pointer ${getTextAlignment(
                                index
                              )}`}
                              title="Click to sort"
                            >
                              <span
                                className={`flex ${
                                  index === 0
                                    ? "justify-start"
                                    : "justify-center"
                                } items-center`}
                              >
                                {col.label}
                                <span className="ml-2 sm:inline ">
                                  {getSortIndicator(col.key)}
                                </span>
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-lovesBlack dark:divide-darkBorder bg-lovesWhite dark:bg-darkCompBg">
                        {sortedAggregatedData.map((item, rowIndex) => (
                          <tr key={rowIndex}>
                            {columnsToDisplay.map((col, colIndex) => (
                              <td
                                key={col.key}
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-md font-futura no-underline hover:underline text-lovesBlack dark:text-darkPrimaryText sm:pl-6 ${getTextAlignment(
                                  colIndex
                                )}`}
                              >
                                {item[col.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="bg-lovesWhite dark:bg-darkBg">
      <Header />
      {showComparison && (
        <>
          <div className="lg:hidden flex items-center justify-between px-4 lg:mb-4 my-4">
            <nav
              aria-label="Breadcrumb"
              className="inline-flex rounded-md bg-lightGray dark:bg-darkCompBg px-4 py-1 shadow-sm shadow-lovesBlack"
            >
              <ol className="flex space-x-1">
                <li className="flex">
                  <div className="flex items-center">
                    <Link
                      href="/customer-service/daily-metrics"
                      className="text-lovesBlack dark:text-darkPrimaryText hover:text-lovesPrimaryRed"
                    >
                      <HomeIcon
                        aria-hidden="true"
                        className="w-4 h-4 shrink-0"
                      />
                      <span className="sr-only font-futura-bold">Home</span>
                    </Link>
                  </div>
                </li>
                {pages.map((page) => (
                  <li key={page.name} className="flex">
                    <div className="flex items-center">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="w-4 shrink-0 text-darkBorder dark:text-darkPrimaryText"
                      >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                      </svg>
                      <a
                        href={page.href}
                        aria-current={page.current ? "page" : undefined}
                        className="ml-1 mr-1 text-sm font-futura-bold text-lovesBlack dark:text-darkPrimaryText hover:text-lovesPrimaryRed"
                      >
                        {page.name}
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="lg:hidden flex items-center justify-between px-4 lg:mb-4 my-4">
            <div
              className="text-lovesBlack dark:text-darkPrimaryText bg-lightGray dark:bg-darkCompBg font-futura-bold
               shadow-sm shadow-lovesBlack 
               rounded-lg lg:px-2 px-1 py-1 cursor-pointer"
              onClick={() => setShowCalendar(true)}
            >
              {fromDate && toDate
                ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                : "Date Range: Not Selected"}
            </div>

            <FilterCalendarToggle
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              isDetail={isDetail}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
            />
          </div>
        </>
      )}
      <div className=" px-4 lg:px-8 lg:mt-4 mt-0">
        <div className="hidden  lg:block relative h-16">
          <div className="flex items-center justify-center h-full">
            {showComparison ? (
              <h1 className="text-2xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                Compare Supervisor
              </h1>
            ) : (
              <div></div>
            )}
          </div>
          {showComparison ? (
            <>
              <div className="hidden absolute inset-y-0 left-0 lg:flex items-center px-2">
                <div
                  className="text-lovesBlack dark:text-darkPrimaryText font-futura-bold 
                      shadow-sm shadow-lovesBlack 
                     rounded-lg lg:px-2 px-1 py-1 cursor-pointer mr-4 bg-lightGray dark:bg-darkCompBg"
                  onClick={() => setShowCalendar(true)}
                >
                  {fromDate && toDate
                    ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                    : "Date Range: Not Selected"}
                </div>
              </div>
            </>
          ) : (
            <div className=" hidden absolute inset-y-0 left-0 lg:flex items-center px-2">
              <nav aria-label="Breadcrumb">
                <ol className="flex space-x-2 rounded-md bg-lightGray dark:bg-darkCompBg px-2 py-1 lg:px-4 lg:py-1 text-md  shadow-sm shadow-lovesBlack">
                  <li className="flex">
                    <div className="flex items-center">
                      <Link
                        href="/customer-service/daily-metrics"
                        className="text-lovesBlack dark:text-darkPrimaryText hover:text-lovesPrimaryRed"
                      >
                        <HomeIcon
                          aria-hidden="true"
                          className="w-4 h-4 shrink-0"
                        />
                        <span className="sr-only">Home</span>
                      </Link>
                    </div>
                  </li>
                  {pages.map((page) => (
                    <li key={page.name} className="flex">
                      <div className="flex items-center">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 44"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                          className="w-4 shrink-0 text-lovesBlack dark:text-darkPrimaryText"
                        >
                          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                        </svg>
                        <a
                          href={page.href}
                          aria-current={page.current ? "page" : undefined}
                          className="ml-2 text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText hover:text-lovesPrimaryRed"
                        >
                          {page.name}
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}

          {showComparison ? (
            <>
              <div className="hidden absolute inset-y-0 right-0 lg:flex items-center px-2">
                <FilterCalendarToggle
                  fromDate={fromDate}
                  toDate={toDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  selectedDateRange={selectedDateRange}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDepartments={selectedDepartments}
                  setSelectedDepartments={setSelectedDepartments}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                  isDetail={isDetail}
                  showComparison={showComparison}
                  setShowComparison={setShowComparison}
                />
              </div>
            </>
          ) : (
            <div className="hidden absolute inset-y-0 right-0 lg:flex items-center px-2">
              <div
                className="text-lovesBlack dark:text-darkPrimaryText bg-lightGray dark:bg-darkCompBg font-futura-bold 
                        shadow-sm shadow-lovesBlack 
                       rounded-lg lg:px-2 px-1 py-1 cursor-pointer mr-4"
                onClick={() => setShowCalendar(true)}
              >
                {fromDate && toDate
                  ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                  : "Date Range: Not Selected"}
              </div>
              <FilterCalendarToggle
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
                isDetail={isDetail}
                showComparison={showComparison}
                setShowComparison={setShowComparison}
              />
            </div>
          )}
        </div>

        {showComparison ? (
          <div className="flex flex-col lg:flex-row gap-1 bg-lightGray dark:bg-darkCompBg shadow-md shadow-darkBg dark:shadow-none dark:border-2 dark:border-darkBorder rounded-lg lg:mb-2 mb-0">
            <div className="w-full lg:w-2/5 lg:pt-4 pt-0">{detailView}</div>
            {!comparisonSupervisor || isSupervisorDropdownOpen ? (
              <div className="flex flex-col items-center w-full lg:w-3/5 lg:mt-36 lg:mb-8 mb-0 lg:mr-4 px-4 py-4 lg:px-0">
                <div className="w-full h-[500px] bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                  <div className="animate-pulse flex flex-col space-y-4">
                    <div className="h-4 bg-lovesGray dark:bg-darkCompBg rounded w-3/5" />
                    <div className="flex flex-col space-y-2">
                      <div
                        className="bg-lovesGray dark:bg-darkCompBg rounded"
                        style={{ width: "100%", height: "420px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {comparisonSupervisor && !isSupervisorDropdownOpen && (
              <div className="flex flex-col items-center w-full lg:w-3/5 lg:mt-20 mt-8">
                <div className="flex justify-center items-center border border-lovesBlack rounded-lg shadow-sm shadow-lovesBlack bg-lovesWhite dark:bg-darkBg">
                  {metricOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMetric(option.value)}
                      className={`lg:px-4 lg:py-2 px-2 py-1  font-futura text-lg cursor-pointer focus:outline-none 
            ${
              metric === option.value
                ? "text-lovesPrimaryRed font-bold"
                : "text-lovesBlack dark:text-darkPrimaryText"
            }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="w-full mt-4 mb-4 h-[500px]">
                  <CompareLineChart
                    data={compareChartData}
                    xDataKey="date"
                    yDataKey={compareDataMapping[metric].yDataKey}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>{detailView}</div>
        )}
      </div>
    </div>
  );
}
