"use client"; // Ensure this page is a client component if using Next.js 13+

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
import { allTeamData, customerServiceData } from "@/data/customerServiceData";

import bgCard from "@/public/animations/bgCard.json";
import award from "@/public/animations/award.json";
import down from "@/public/animations/down.json";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import CompareRed from "@/public/compare-red.svg";
import CompareYellow from "@/public/compare-yellow.svg";
import Change from "@/public/change.svg";
import dynamic from "next/dynamic";
import Calendar from "@/components/Sorting/DateFilters/Calendar";
import Image from "next/image";
import ManagerSelectionForm from "@/components/Sorting/Filters/ManagerSelectionForm";
import { qualityGoalTableConfig } from "@/components/Tables/CustomerService/Overview/QualityTable/qualityGoalTableConfig";
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

const StatCardComponent = ({
  id,
  name,
  stat,
  qualifies,
  bgColorClass,
  delay = 0,
  onClick,
  isActive,
}) => {
  const [animationFinished, setAnimationFinished] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  const textColorClass = isActive
    ? qualifies
      ? "text-lovesGreen"
      : "text-lovesPrimaryRed"
    : qualifies
    ? "text-lovesGreen"
    : "text-lovesPrimaryRed";

  const cardBg = isActive
    ? "bg-darkCompBg dark:bg-darkBg "
    : animationFinished
    ? "bg-darkBorder"
    : "bg-lovesBlack dark:bg-darkPrimaryText";
  const nameTextColorClass = isActive ? "text-lovesWhite" : "text-lovesWhite";
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-lg shadow-md dark:shadow-sm shadow-lovesBlack dark:shadow-darkBorder overflow-hidden border-2 dark:border ${
        isActive
          ? qualifies
            ? "animate-glow border-lovesGreen dark:border-lovesGreen"
            : "border-lovesPrimaryRed dark:border-lovesPrimaryRed"
          : "border-lovesBlack dark:border-lovesBlack"
      } ${cardBg}`}
      style={{ transition: "background-color 1s ease-in-out" }}
    >
      {animationFinished &&
        (qualifies ? (
          <div className="absolute top-0 right-0 p-2">
            <Lottie
              animationData={award}
              loop={true}
              speed={0.1}
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        ) : (
          <div className="absolute top-2 right-3 p-2">
            {/* <Image
              src={warning}
              alt="Warning"
              width={20}
              height={20}
              // style={{ width: "50px", height: "50px" }}
            /> */}
          </div>
        ))}

      <div
        className="relative p-6 flex flex-col items-center justify-center"
        style={{
          opacity: animationFinished ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <dt className="flex flex-col items-center text-center">
          <p
            className={`truncate text-lg font-futura-bold ${nameTextColorClass}`}
          >
            {name}
          </p>
        </dt>
        <dd className="flex flex-col items-center justify-center pt-4">
          <p
            className={`text-3xl font-semibold font-futura-bold ${textColorClass} glow`}
          >
            {stat}
          </p>
        </dd>
      </div>
    </div>
  );
};

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

function aggregateMetrics(data) {
  return {
    AHT: computeAverageTime(data, "AHT"),
    mtdScore: computeAveragePercentage(data, "mtdScore"),
    Adherence: computeAveragePercentage(data, "Adherence"),
    Quality: computeAveragePercentage(data, "Quality"),
  };
}
function generateRandomMetricValue(metricName) {
  if (metricName === "Average Handle Time") {
    // generate a random time between 5:00 (300 sec) and 6:30 (390 sec)
    let seconds = Math.floor(Math.random() * (390 - 300 + 1)) + 300;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else if (metricName === "Average Score") {
    // generate a random percentage between 90% and 105%
    let value = (Math.random() * 15 + 90).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Adherence") {
    // generate a random percentage between 85% and 95%
    let value = (Math.random() * 10 + 85).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Quality") {
    // generate a random percentage between 80% and 95%
    let value = (Math.random() * 15 + 80).toFixed(2);
    return `${value}%`;
  }
  return "0%";
}

function createUniqueAHTGenerator(minSeconds, maxSeconds) {
  const possibleValues = [];
  for (let s = minSeconds; s <= maxSeconds; s++) {
    possibleValues.push(s);
  }
  // Shuffle the array using Fisher–Yates
  for (let i = possibleValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possibleValues[i], possibleValues[j]] = [
      possibleValues[j],
      possibleValues[i],
    ];
  }
  let index = 0;
  return function getNextAHT() {
    if (index >= possibleValues.length) {
      index = 0;
      // reshuffle
      for (let i = possibleValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleValues[i], possibleValues[j]] = [
          possibleValues[j],
          possibleValues[i],
        ];
      }
    }
    return possibleValues[index++];
  };
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

const combinedFakeData = fakeAHTDataMain.map((item, index) => ({
  date: item.date,
  mainValue: item.ahtTeam,
  comparedValue: fakeAHTDataComparison[index]?.ahtTeam,
}));

export default function ManagerDailyMetricsPage() {
  const router = useRouter();
  const { from, to, managers } = router.query;
  const [selectedManager, setSelectedManager] = useState(null);
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const pages = [{ name: "Manager", href: "#", current: false }];
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const formattedFrom = from
    ? new Date(from).toLocaleDateString("en-US")
    : "None";
  const formattedTo = to ? new Date(to).toLocaleDateString("en-US") : "None";
  const allTeamData = customerServiceData.allTeamData;
  const allManagers = [...new Set(allTeamData.map((item) => item.manager))];
  const dataSets = customerServiceData.dataSets;

  const isDetail = true;
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonManager, setComparisonManager] = useState(null);

  const managerOptions = allManagers.map((manager) => ({
    label: manager,
    value: manager,
  }));

  const filteredDataSets = dataSets.map((set) => ({
    ...set,
    data: set.data.filter((row) => row.manager === managers),
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

  const mainManagerData = aggregateMetrics(
    mainChartData.filter((item) => item.manager === managers)
  );
  const comparedManagerData = comparisonManager
    ? aggregateMetrics(
        fullChartData.filter((item) => item.manager === comparisonManager.value)
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

  const combinedData = [
    {
      metric: "Average Handle Time",
      mainValue: parseAHT(mainManagerData.AHT),
      comparedValue: comparedManagerData.AHT
        ? parseAHT(comparedManagerData.AHT)
        : null,
    },
    {
      metric: "Average Score",
      mainValue: parsePercentage(mainManagerData.mtdScore),
      comparedValue: comparedManagerData.mtdScore
        ? parsePercentage(comparedManagerData.mtdScore)
        : null,
    },
    {
      metric: "Adherence",
      mainValue: parsePercentage(mainManagerData.Adherence),
      comparedValue: comparedManagerData.Adherence
        ? parsePercentage(comparedManagerData.Adherence)
        : null,
    },
    {
      metric: "Quality",
      mainValue: parsePercentage(mainManagerData.Quality),
      comparedValue: comparedManagerData.Quality
        ? parsePercentage(comparedManagerData.Quality)
        : null,
    },
  ];

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
  const filteredManagerOptions = managerOptions.filter(
    (option) => option.label !== managers
  );

  const statCards = [
    { id: 1, name: "Average Handle Time", stat: avgAHT },
    { id: 2, name: "Adherence", stat: avgAdherence },
    { id: 3, name: "Quality", stat: avgQuality },
    { id: 4, name: "Average Score", stat: avgScore },
  ];

  const [groupByField, setGroupByField] = useState("supervisor");
  const [metric, setMetric] = useState("Average Score");
  const [chartType, setChartType] = useState("Bar Chart");

  const groupByOptions = [
    { value: "supervisor", label: "Supervisor" },
    { value: "agent", label: "Agent" },
  ];

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
    navigateMonth,
    handleDateSelect,
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
  const yAxisField = metricMapping[metric];

  const aggregatedData = useMemo(() => {
    const groups = {};
    chartData.forEach((row) => {
      const key = row.supervisor;
      if (!groups[key]) {
        groups[key] = {
          supervisor: row.supervisor,
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
        supervisor: group.supervisor,
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
    { key: "supervisor", label: "Supervisor" },
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
  if (!managers) {
    return (
      <ManagerSelectionForm allTeamData={allTeamData} dataSets={dataSets} />
    );
  }

  const legendPayload = [
    { value: managers, color: "#FF0000" },
    { value: comparisonManager?.label || "Compared", color: "#FFEB00" },
  ];
  const renderCustomLegend = (props) => {
    const { payload } = props;
    // Assume theme is a string, 'dark' or 'light'
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
      <div className="lg:hidden">
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex space-x-4 rounded-md bg-lovesWhite dark:bg-darkCompBg px-4 py-1 shadow-sm shadow-lovesBlack">
            <li className="flex">
              <div className="flex items-center">
                <Link
                  href="/customer-service/daily-metrics"
                  className="text-lovesBlack hover:text-lovesPrimaryRed"
                >
                  <HomeIcon aria-hidden="true" className="w-5 h-5 shrink-0" />
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
                    className="w-6 shrink-0 text-lovesGray dark:text-darkPrimaryText"
                  >
                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                  </svg>
                  <a
                    href={page.href}
                    aria-current={page.current ? "page" : undefined}
                    className="ml-2 text-md font-futura-bold text-lovesBlack hover:text-lovesPrimaryRed"
                  >
                    {page.name}
                  </a>
                  <div className="ml-4 font-futura-bold text-sm">
                    {formattedFrom} - {formattedTo}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex items-center text-center justify-center pt-4">
          <h1 className="text-xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
            {managers}
          </h1>
        </div>
      </div>
      {showComparison ? (
        <>
          <div className="flex flex-col lg:flex-row gap-4 items-stretch text-center ">
            <div className="flex-1">
              <h1 className="text-xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText px-4 mt-4">
                {managers}
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
              {!comparisonManager || isManagerDropdownOpen ? (
                <>
                  <h2 className="text-lg font-bold text-lovesBlack dark:text-darkPrimaryText mb-2">
                    Select Manager
                  </h2>
                  <Listbox
                    value={comparisonManager}
                    onChange={(manager) => {
                      setComparisonManager(manager);
                      setIsManagerDropdownOpen(false);
                    }}
                  >
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-lovesWhite dark:bg-darkBg py-2 pl-3 pr-10 text-left  focus:outline-none text-md border border-lovesBlack shadow-sm shadow-lovesBlack">
                        <span className="block truncate">
                          {comparisonManager
                            ? comparisonManager.label
                            : "Select a manager"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon
                            className="h-5 w-5 text-lovesBlack dark:text-darkPrimaryText"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-lovesWhite dark:bg-darkBg py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filteredManagerOptions.map((option) => (
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

                  <div className="text-center whitespace-nowrap">
                    <h2 className="text-lg font-bold text-lovesBlack dark:text-darkPrimaryText">
                      {comparisonManager.label}
                    </h2>
                  </div>

                  <div className="text-right">
                    <button onClick={() => setIsManagerDropdownOpen(true)}>
                      <Image
                        src={Change}
                        alt="Change Icon"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </div>
              )}

              {comparisonManager && !isManagerDropdownOpen && (
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
          <hr className="border-lovesBlack mt-4 mx-4 mb-4" />
          {!comparisonManager || isManagerDropdownOpen ? (
            <div className="my-4 ">
              <div className="grid grid-cols-2 p-2 ">
                <div className="p-2">
                  <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-4 bg-gray-300 dark:bg-darkCompBg rounded w-1/3" />

                      <div className="flex flex-col space-y-2">
                        <div
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "20px" }}
                        />
                        <div
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "20px" }}
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
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "20px" }}
                        />
                        <div
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "20px" }}
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
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "20px" }}
                        />
                        <div
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "20px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg p-4">
                    <div className="animate-pulse flex flex-col space-y-4">
                      <div className="h-4 bg-gray-300 dark:bg-darkCompBgrounded w-1/3" />

                      <div className="flex flex-col space-y-2">
                        <div
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "50%", height: "20px" }}
                        />
                        <div
                          className="bg-gray-300 dark:bg-darkCompBg rounded"
                          style={{ width: "70%", height: "20px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className=" bg-lightGray dark:bg-darkCompBg  p-4 ">
              <div className="grid grid-cols-2 gap-4 px-2">
                <div className=" bg-lovesWhite dark:bg-darkBg  px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">
                    Average Handle Time
                  </h3>

                  <CompareBarChart
                    data={combinedData.filter(
                      (d) => d.metric === "Average Handle Time"
                    )}
                    xDataKey="metric"
                    managers={managers}
                    comparisonManager={comparisonManager}
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
                    managers={managers}
                    comparisonManager={comparisonManager}
                  />
                </div>
                <div className=" bg-lovesWhite dark:bg-darkBg dark:bg-darkBg  px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">Adherence</h3>
                  <CompareBarChart
                    data={combinedData.filter((d) => d.metric === "Adherence")}
                    xDataKey="metric"
                    managers={managers}
                    comparisonManager={comparisonManager}
                  />
                </div>
                <div className=" bg-lovesWhite dark:bg-darkBg  px-2 pt-4 border-2 border-darkBorder rounded-lg relative z-10">
                  <h3 className="font-futura-bold text-md pb-4">Quality</h3>
                  <CompareBarChart
                    data={combinedData.filter((d) => d.metric === "Quality")}
                    xDataKey="metric"
                    managers={managers}
                    comparisonManager={comparisonManager}
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
                      {managers}
                    </h1>
                  </div>
                </div>
              </div>
              <dl className="mt-5 py-0 px-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ">
                {statCards.map((item, index) => {
                  const bgColorClass = getBgColor(item.name, item.stat);
                  const qualifies = bgColorClass.trim() === "bg-lovesGreen";

                  const delay = index * 300;
                  return (
                    <StatCardComponent
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      stat={item.stat}
                      qualifies={qualifies}
                      bgColorClass={bgColorClass}
                      delay={delay}
                    />
                  );
                })}
              </dl>
            </div>
            <div className="mt-0 p-6 lg:block hidden">
              <div className="border-2 border-darkCompBg dark:border-darkBg shadow-md shadow-darkBorder border-2 border-darkBorder dark:bg-darkBg  bg-darkBorder lg:m-4 rounded-lg p-2">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between dark:bg-darkBg shadow-md dark:shadow-darkBg border-2 border-darkBorder dark:border dark:border-darkBg dark:shadow-sm pl-4 pt-2 pb-4 ">
                    <h2 className="text-xl font-futura-bold dark:text-darkPrimaryText text-lovesWhite rounded-lg">
                      Performance Chart
                    </h2>
                    <div className="flex space-x-2 pr-2">
                      <div className="w-48">
                        <Listbox
                          value={groupByField}
                          onChange={setGroupByField}
                        >
                          <div className="relative">
                            <Listbox.Button className="bg-lightGray dark:bg-darkBorder relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                              <span className="block truncate">
                                {
                                  groupByOptions.find(
                                    (option) => option.value === groupByField
                                  )?.label
                                }
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <ChevronDownIcon
                                  className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-lightGray dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                              {groupByOptions.map((option) => (
                                <Listbox.Option
                                  key={option.value}
                                  value={option.value}
                                  className={({ active }) =>
                                    `${
                                      active
                                        ? "text-lovesBlack dark:text-darkPrimaryText bg-lightGray dark:bg-darkBorder font-futura-bold"
                                        : "text-lovesBlack dark:text-darkPrimaryText bg-lightGray dark:bg-darkBorder font-futura"
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

                      <div className="w-48">
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

                      <div className="w-48">
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
              <div className="lg:p-4 py-2">
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
                                <span className="ml-2 sm:inline hidden">
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

      <div className="px-4 sm:px-2 lg:px-8 mt-4">
        <div className="hidden lg:block relative h-16">
          <div className="flex items-center justify-center h-full">
            {showComparison ? (
              <h1 className="text-2xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                Compare Managers
              </h1>
            ) : (
              <div></div>
            )}
          </div>
          {showComparison ? (
            <div className="absolute inset-y-0 left-0 flex items-center px-2">
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
          ) : (
            <div className="absolute inset-y-0 left-0 flex items-center px-2">
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
            <div className="absolute inset-y-0 right-0 flex items-center px-2">
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
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center px-2">
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

        {/* Show the Compare Managers button only if isDetail is true */}

        {showComparison ? (
          // Split-screen layout when comparing
          <div className="flex flex-col lg:flex-row gap-1 bg-lightGray dark:bg-darkCompBg shadow-md shadow-darkBg dark:shadow-none dark:border-2 dark:border-darkBorder rounded-lg mb-2">
            {/* Left column: your current detail view */}
            <div className="w-full lg:w-2/5 pt-4">{detailView}</div>

            {/* Right column: manager selection for comparison */}
            {comparisonManager && !isManagerDropdownOpen && (
              <div className="flex flex-col items-center w-full lg:w-3/5 mt-20 ">
                <div className="flex justify-center items-center border border-lovesBlack rounded-lg shadow-sm shadow-lovesBlack bg-lovesWhite dark:bg-darkBg">
                  {metricOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMetric(option.value)}
                      className={`px-4 py-2  font-futura text-lg cursor-pointer focus:outline-none 
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

                {/* Set a fixed height for the chart container */}

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
          // Normal view when not in comparison mode
          <div>{detailView}</div>
        )}
      </div>
    </div>
  );
}

function getTextAlignment(index) {
  return index === 0 ? "text-left" : "text-center";
}
