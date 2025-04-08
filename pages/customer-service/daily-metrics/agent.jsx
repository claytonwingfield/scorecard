"use client"; // Ensure this page is a client component if using Next.js 13+

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { defaultSort, upArrow, downArrow } from "@/components/Icons/icons";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/20/solid";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import Header from "@/components/Navigation/header";
import BarChart from "@/components/Charts/BarChart";
import LineChartTime from "@/components/Charts/LineChartTime";
import { customerServiceData } from "@/data/customerServiceData";
import bgCard from "@/public/animations/bgCard.json";
import down from "@/public/animations/down.json";
import award from "@/public/animations/award.json";
import dynamic from "next/dynamic";
import Calendar from "@/components/Sorting/DateFilters/Calendar";

import warning from "@/public/warning.png";
import AgentSelectionForm from "@/components/Sorting/Filters/AgentSelectionForm";
// New selection form for supervisors
import { qualityGoalTableConfig } from "@/components/Tables/CustomerService/Overview/QualityTable/qualityGoalTableConfig";
import Image from "next/image";
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
  return "bg-lovesLightRed";
}

const StatCardComponent = ({
  id,
  name,
  stat,
  qualifies,
  bgColorClass,
  delay = 0,
}) => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative rounded-lg shadow-md shadow-lovesBlack overflow-hidden dark:border ${
        qualifies ? "dark:border-lovesGreen" : "dark:border-lovesPrimaryRed"
      }  ${animationFinished ? bgColorClass : "bg-lovesWhite"}`}
      style={{ transition: "background-color 1s ease-in-out" }}
    >
      {startAnimation && !animationFinished && (
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <Lottie
            animationData={qualifies ? bgCard : down}
            loop={false}
            speed={0.2}
            style={{ width: "100%", height: "100%" }}
            onComplete={() => setAnimationFinished(true)}
            className="opacity-70"
          />
        </div>
      )}

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
            <Image
              src={warning}
              alt="Warning"
              width={40}
              height={40}
              // style={{ width: "50px", height: "50px" }}
            />
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
            className={`truncate text-md font-futura-bold ${
              qualifies ? "text-gray-900" : "text-white"
            }`}
          >
            {name}
          </p>
        </dt>
        <dd className="flex flex-col items-center justify-center pt-4">
          <p
            className={`text-2xl font-semibold font-futura-bold ${
              qualifies ? "text-gray-900" : "text-white"
            }`}
          >
            {stat}
          </p>
        </dd>
      </div>
    </div>
  );
};

export default function AgentDailyMetricsPage() {
  const router = useRouter();
  const { from, to, agent, managers } = router.query;

  const pages = [
    {
      name: "Agent",
      href: `/customer-service/daily-metrics/agent?agents=${encodeURIComponent(
        agent
      )}&from=${from}&to=${to}`,
      current: false,
    },
    { name: "Agent", href: "#", current: true },
  ];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const formattedFrom = from
    ? new Date(from).toLocaleDateString("en-US")
    : "None";
  const formattedTo = to ? new Date(to).toLocaleDateString("en-US") : "None";
  const allTeamData = customerServiceData.allTeamData;
  const dataSets = customerServiceData.dataSets;
  // Filter by supervisor instead of manager
  const filteredDataSets = dataSets.map((set) => ({
    ...set,
    data: set.data.filter((row) => row.agent === agent),
  }));

  const teamDataSets = filteredDataSets.filter((ds) =>
    ds.component.toLowerCase().startsWith("team")
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

  const statCards = [
    { id: 1, name: "Average Handle Time", stat: avgAHT },
    { id: 2, name: "Adherence", stat: avgAdherence },
    { id: 3, name: "Quality", stat: avgQuality },
    { id: 4, name: "Average Score", stat: avgScore },
  ];

  const [groupByField, setGroupByField] = useState("agent");
  const [metric, setMetric] = useState("Average Score");
  const [chartType, setChartType] = useState("Bar Chart");

  const groupByOptions = [
    { value: "agent", label: "Agent" },
    // Remove supervisor option if you don't need it.
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

  const xAxisField = groupByField;
  const yAxisField = metricMapping[metric];

  // New grouping (by agent)
  const aggregatedData = useMemo(() => {
    const groups = {};
    chartData.forEach((row) => {
      const key = row.agent; // group by agent
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
          key !== "agent" &&
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

  if (!agent) {
    return <AgentSelectionForm allTeamData={allTeamData} dataSets={dataSets} />;
  }

  return (
    <div className="bg-lovesWhite dark:bg-darkBg">
      <Header />
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
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
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex items-center text-center justify-center pt-4">
            <h1 className="text-xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
              {agent}
            </h1>
          </div>
          <div className="flex items-center text-center justify-center pt-2">
            <div className="ml-4 font-futura-bold text-sm">
              {formattedFrom} - {formattedTo}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative h-16">
          <div className="flex items-center justify-center h-full">
            <h1 className="text-xl font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
              {agent}
            </h1>
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center px-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex space-x-4 rounded-md bg-lovesWhite dark:bg-darkCompBg px-4 py-1 shadow-sm shadow-lovesBlack">
                <li className="flex">
                  <div className="flex items-center">
                    <Link
                      href="/customer-service/daily-metrics"
                      className="text-lovesBlack hover:text-lovesPrimaryRed"
                    >
                      <HomeIcon
                        aria-hidden="true"
                        className="w-5 h-5 shrink-0"
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
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-16">
            <h3 className="font-futura-bold text-lg text-lovesBlack dark:text-darkPrimaryText pr-4">
              Date Range: {formattedFrom} - {formattedTo}
            </h3>
          </div>
        </div>

        <div className="lg:px-8">
          <dl className="mt-5 py-2 px-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 bg-black dark:bg-darkCompBg shadow-md shadow-lovesBlack rounded-lg">
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

        <div className="mt-4 p-8 hidden lg:block">
          <div className="h-full overflow-hidden dark:ring-0 ring-1 ring-lovesBlack rounded-lg bg-lovesBlack dark:bg-darkCompBg pb-2">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between bg-lovesBlack dark:bg-darkCompBg pl-4 pt-2 pb-4">
                <h2 className="text-xl font-futura-bold text-lovesWhite dark:text-darkPrimaryText">
                  Performance Chart
                </h2>
                <div className="flex space-x-2 pr-2">
                  <div className="w-48">
                    <Listbox value={groupByField} onChange={setGroupByField}>
                      <div className="relative">
                        <Listbox.Button className="bg-lovesWhite dark:bg-darkBg relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
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
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-lovesWhite dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                          {groupByOptions.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `${
                                  active
                                    ? "text-lovesBlack bg-lovesWhite dark:bg-darkCompBg font-futura-bold"
                                    : "text-lovesBlack dark:text-darkPrimaryText font-futura"
                                } cursor-default select-none relative py-2 pl-10 pr-4`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
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
                        <Listbox.Button className="bg-lovesWhite dark:bg-darkBg relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                          <span className="block truncate">{metric}</span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDownIcon
                              className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-lovesWhite dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                          {metricOptions.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `${
                                  active
                                    ? "text-lovesBlack bg-lovesWhite dark:bg-darkCompBg font-futura-bold"
                                    : "text-lovesBlack dark:text-darkPrimaryText font-futura"
                                } cursor-default select-none relative py-2 pl-10 pr-4`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
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
                        <Listbox.Button className="bg-lovesWhite dark:bg-darkBg relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                          <span className="block truncate">{chartType}</span>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDownIcon
                              className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-lovesWhite dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                          {chartTypeOptions.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `${
                                  active
                                    ? "text-lovesBlack bg-lovesWhite dark:bg-darkCompBg font-futura-bold"
                                    : "text-lovesBlack dark:text-darkPrimaryText font-futura"
                                } cursor-default select-none relative py-2 pl-10 pr-4`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
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
                <div className="h-[500px]">
                  <BarChart
                    data={chartData}
                    xDataKey={xAxisField}
                    yDataKey={metricMapping[metric]}
                    groupByKey={groupByField}
                    disableGrouping={false}
                  />
                </div>
              ) : (
                <div className="h-[500px]">
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
        </div>

        <div className="lg:p-8 py-4">
          <div className="bg-lovesBlack dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder rounded-md p-1.5 w-full max-w-full no-scrollbar">
            <div className="flex-grow overflow-y-auto no-scrollbar">
              <table className="min-w-full divide-y divide-lovesBlack">
                <thead className="bg-lovesBlack dark:bg-darkCompBg">
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
                            index === 0 ? "justify-start" : "justify-center"
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
                <tbody className="divide-y divide-lovesBlack dark:divide-darkBorder bg-lovesWhite dark:bg-darkBg">
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
  );
}

function getTextAlignment(index) {
  return index === 0 ? "text-left" : "text-center";
}
