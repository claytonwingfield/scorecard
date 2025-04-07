"use client";
import Header from "@/components/Navigation/header";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import bgCard from "@/public/animations/bgCard.json";
import down from "@/public/animations/down.json";
import award from "@/public/animations/award.json";
import dynamic from "next/dynamic";
import BarChart from "@/components/Charts/BarChart";
import warning from "@/public/warning.png";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import LineChartTime from "@/components/Charts/LineChartTime";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import { Transition } from "@headlessui/react";

import {
  customerServiceAverageScore,
  customerServiceAHT,
  qualityInfo,
  customerServiceAdherence,
  allTeamData,
} from "@/data/customerServiceData";
import Image from "next/image";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const averageHandleTimeGoal = "5:30 - 6:30";
const qualityGoal = "88%";
const adherenceGoal = "88%";
const averageScoreGoal = "95%";
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

function formatSecondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function generateRandomAHTSeconds() {
  const minSeconds = 5 * 60;
  const maxSeconds = 7 * 60;
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

function generateRandomAHTFormatted() {
  const seconds = generateRandomAHTSeconds();
  return formatSecondsToMMSS(seconds);
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

export const fakeAHTData = generateFakeDataForMarch2025ForMetric(
  "ahtTeam",
  generateRandomAHTFormatted
);

export const fakeAdherenceData = generateFakeDataForMarch2025ForMetric(
  "adherence",
  () => generateRandomMetricValue("Adherence")
);
export const fakeQualityData = generateFakeDataForMarch2025ForMetric(
  "qualityTeam",
  () => generateRandomMetricValue("Quality")
);
export const fakeMtdScoreData = generateFakeDataForMarch2025ForMetric(
  "mtdScore",
  () => generateRandomMetricValue("Average Score")
);

const fakeDataMap = {
  "Average Handle Time": fakeAHTData,
  Adherence: fakeAdherenceData,
  Quality: fakeQualityData,
  "Average Score": fakeMtdScoreData,
};
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
const customerServiceManagers = Array.from(
  new Set(allTeamData.map((item) => item.manager))
).map((managerName) => ({ name: managerName }));
const computedCustomerServiceManagerStats = customerServiceManagers.map(
  (manager) => {
    const managerName = manager.name;
    return {
      name: managerName,
      "Average Handle Time": averageAHTForManager(
        customerServiceAHT,
        managerName
      ),
      Adherence: averagePercentageForManager(
        customerServiceAdherence,
        "qualityTeam",
        managerName
      ),
      Quality: averagePercentageForManager(
        qualityInfo,
        "qualityTeam",
        managerName
      ),
      "Average Score": averagePercentageForManager(
        customerServiceAverageScore,
        "mtdScore",
        managerName
      ),
    };
  }
);
const helpDeskManagerStats = [
  {
    name: "Stephen Thomas",
    "Average Handle Time": "04:46",
    Adherence: "92%",
    Quality: "93%",
    "Average Score": "95%",
  },
  {
    name: "Debra Scarberry",
    "Average Handle Time": "04:51",
    Adherence: "91%",
    Quality: "92%",
    "Average Score": "94%",
  },
];

const electronicDispatchManagerStats = [
  {
    name: "Eric Turberville",
    "Average Handle Time": "06:00",
    Adherence: "90%",
    Quality: "92%",
    "Average Score": "94%",
  },
  {
    name: "Linda McKown",
    "Average Handle Time": "06:05",
    Adherence: "89%",
    Quality: "91%",
    "Average Score": "93%",
  },
  {
    name: "Kelli Marburger",
    "Average Handle Time": "05:55",
    Adherence: "90%",
    Quality: "89%",
    "Average Score": "92%",
  },
];

const writtenCommunicationManagerStats = [
  {
    name: "Erik Turberville",
    "Average Handle Time": "05:50",
    Adherence: "91%",
    Quality: "90%",
    "Average Score": "93%",
  },
  {
    name: "Kelli Marburger",
    "Average Handle Time": "05:55",
    Adherence: "90%",
    Quality: "89%",
    "Average Score": "92%",
  },
];

const resolutionsManagerStats = [
  {
    name: "Kurt Van Kley",
    "Average Handle Time": "06:10",
    Adherence: "89%",
    Quality: "91%",
    "Average Score": "92%",
  },
  {
    name: "Brian Ditmore",
    "Average Handle Time": "06:15",
    Adherence: "88%",
    Quality: "90%",
    "Average Score": "91%",
  },
  {
    name: "Teri Carrier",
    "Average Handle Time": "05:35",
    Adherence: "91%",
    Quality: "89%",
    "Average Score": "89%",
  },
];

// Mapping for all departments
const departmentManagerStats = {
  "Customer Service": computedCustomerServiceManagerStats,
  "Help Desk": helpDeskManagerStats,
  "Electronic Dispatch": electronicDispatchManagerStats,
  "Written Communication": writtenCommunicationManagerStats,
  Resolutions: resolutionsManagerStats,
};
function averagePercentageForManager(dataArray, key, managerName) {
  const filtered = dataArray.filter((item) => item.manager === managerName);
  if (filtered.length === 0) return "N/A";
  const sum = filtered.reduce(
    (acc, cur) => acc + parseFloat(cur[key].replace("%", "")),
    0
  );
  const avg = sum / filtered.length;
  return avg.toFixed(2) + "%";
}

// Computes average AHT in MM:SS for a manager
function averageAHTForManager(dataArray, managerName) {
  const filtered = dataArray.filter((item) => item.manager === managerName);
  if (filtered.length === 0) return "N/A";
  const sumSeconds = filtered.reduce((acc, cur) => {
    const [m, s] = cur.ahtTeam.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);
  const avgSeconds = sumSeconds / filtered.length;
  const m = Math.floor(avgSeconds / 60);
  const s = Math.round(avgSeconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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

function generateRandomStat(metricName) {
  return generateRandomMetricValue(metricName);
}
const customerServiceStats = [
  {
    id: 1,
    name: "Average Handle Time",
    stat: generateRandomStat("Average Handle Time"),
  },
  { id: 2, name: "Adherence", stat: generateRandomStat("Adherence") },
  { id: 3, name: "Quality", stat: generateRandomStat("Quality") },
  { id: 4, name: "Average Score", stat: generateRandomStat("Average Score") },
];

const helpDeskStats = [
  { id: 1, name: "Average Handle Time", stat: "05:45" },
  { id: 2, name: "Adherence", stat: "92%" },
  { id: 3, name: "Quality", stat: "93%" },
  { id: 4, name: "Average Score", stat: "95%" },
];
const electronicDispatchStats = [
  { id: 1, name: "Average Handle Time", stat: "06:00" },
  { id: 2, name: "Adherence", stat: "90%" },
  { id: 3, name: "Quality", stat: "92%" },
  { id: 4, name: "Average Score", stat: "94%" },
];
const writtenCommunicationStats = [
  { id: 1, name: "Average Handle Time", stat: "05:50" },
  { id: 2, name: "Adherence", stat: "91%" },
  { id: 3, name: "Quality", stat: "90%" },
  { id: 4, name: "Average Score", stat: "93%" },
];
const resolutionsStats = [
  { id: 1, name: "Average Handle Time", stat: "06:10" },
  { id: 2, name: "Adherence", stat: "89%" },
  { id: 3, name: "Quality", stat: "91%" },
  { id: 4, name: "Average Score", stat: "92%" },
];
export default function OklahomaCity() {
  const avgScore = useMemo(() => {
    const scores = customerServiceAverageScore.map((item) =>
      parseFloat(item.mtdScore.replace("%", ""))
    );
    const total = scores.reduce((acc, s) => acc + s, 0);
    const avg = total / scores.length;
    return avg.toFixed(2) + "%";
  }, []);

  const avgAdherence = useMemo(() => {
    const adherences = customerServiceAdherence.map((item) =>
      parseFloat(item.qualityTeam.replace("%", ""))
    );
    const total = adherences.reduce((acc, a) => acc + a, 0);
    const avg = total / adherences.length;
    return avg.toFixed(2) + "%";
  }, []);

  const avgQuality = useMemo(() => {
    const qualities = qualityInfo.map((item) =>
      parseFloat(item.qualityTeam.replace("%", ""))
    );
    const total = qualities.reduce((acc, q) => acc + q, 0);
    const avg = total / qualities.length;
    return avg.toFixed(2) + "%";
  }, []);

  const avgAHT = useMemo(() => {
    const timesInSeconds = customerServiceAHT.map((item) => {
      const [mins, secs] = item.ahtTeam.split(":").map(Number);
      return mins * 60 + secs;
    });
    const totalSeconds = timesInSeconds.reduce((acc, t) => acc + t, 0);
    const avgSeconds = totalSeconds / timesInSeconds.length;
    const mins = Math.floor(avgSeconds / 60);
    const secs = Math.round(avgSeconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);
  const [selectedDepartments, setSelectedDepartments] = useState({
    "Customer Service": true,
    "Help Desk": true,
    "Electronic Dispatch": true,
    "Written Communication": true,
    Resolutions: true,
  });
  const customerServiceStats = [
    { id: 1, name: "Average Handle Time", stat: avgAHT },
    { id: 2, name: "Adherence", stat: avgAdherence },
    { id: 3, name: "Quality", stat: avgQuality },
    { id: 4, name: "Average Score", stat: avgScore },
  ];
  const helpDeskStats = [
    { id: 1, name: "Average Handle Time", stat: "05:45" },
    { id: 2, name: "Adherence", stat: "92%" },
    { id: 3, name: "Quality", stat: "93%" },
    { id: 4, name: "Average Score", stat: "95%" },
  ];

  const electronicDispatchStats = [
    { id: 1, name: "Average Handle Time", stat: "06:00" },
    { id: 2, name: "Adherence", stat: "90%" },
    { id: 3, name: "Quality", stat: "92%" },
    { id: 4, name: "Average Score", stat: "94%" },
  ];

  const writtenCommunicationStats = [
    { id: 1, name: "Average Handle Time", stat: "05:50" },
    { id: 2, name: "Adherence", stat: "91%" },
    { id: 3, name: "Quality", stat: "90%" },
    { id: 4, name: "Average Score", stat: "93%" },
  ];

  const resolutionsStats = [
    { id: 1, name: "Average Handle Time", stat: "06:10" },
    { id: 2, name: "Adherence", stat: "89%" },
    { id: 3, name: "Quality", stat: "91%" },
    { id: 4, name: "Average Score", stat: "92%" },
  ];

  const [expandedRows, setExpandedRows] = useState({
    "Customer Service": false,
    "Help Desk": false,
    "Electronic Dispatch": false,
    "Written Communication": false,
    Resolutions: false,
  });
  const [managersExpanded, setManagersExpanded] = useState({
    "Customer Service": false,
    "Help Desk": false,
    "Electronic Dispatch": false,
    "Written Communication": false,
    Resolutions: false,
  });
  const [activeMetrics, setActiveMetrics] = useState({
    "Customer Service": "Average Handle Time",
    "Help Desk": "Average Handle Time",
    "Electronic Dispatch": "Average Handle Time",
    "Written Communication": "Average Handle Time",
    Resolutions: "Average Handle Time",
  });

  const toggleExpand = (dept) => {
    setExpandedRows((prev) => {
      const isCurrentlyExpanded = prev[dept];
      // If the department is being closed, reset the manager's expanded state.
      if (isCurrentlyExpanded) {
        setManagersExpanded((prevManagers) => ({
          ...prevManagers,
          [dept]: false,
        }));
      }
      return { ...prev, [dept]: !isCurrentlyExpanded };
    });
  };
  const toggleManagerExpand = (dept) => {
    setManagersExpanded((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };
  const [activeMetric, setActiveMetric] = useState("Average Handle Time");
  const departmentManagerLinks = {
    "Customer Service": "/customer-service/daily-metrics/manager",
    "Help Desk": "/help-desk/daily-metrics/manager",
    "Electronic Dispatch": "/electronic-dispatch/daily-metrics/manager",
    "Written Communication": "/written-communication/daily-metrics/manager",
    Resolutions: "/resolutions/daily-metrics/manager",
  };
  const metricMap = {
    "Average Handle Time": "ahtTeam",
    Adherence: "adherence",
    Quality: "qualityTeam",
    "Average Score": "mtdScore",
  };
  const handleStatCardClick = (department, metricName) => {
    setActiveMetrics((prev) => ({
      ...prev,
      [department]: metricName,
    }));

    setExpandedRows((prev) => {
      if (!prev[department]) {
        return { ...prev, [department]: true };
      }
      return prev;
    });
  };
  const renderChart = (dept) => {
    if (!expandedRows[dept]) return null;
    const currentMetric = activeMetrics[dept];

    return (
      <>
        {/* Main Chart */}
        <div className="my-4 h-80">
          <LineChartTime
            data={fakeDataMap[currentMetric]}
            xDataKey="date"
            yDataKey={metricMap[currentMetric]}
            disableGrouping={true}
          />
        </div>

        {/* Department Managers Heading */}

        {/* Conditionally render button or managers block based on managersExpanded */}
        {!managersExpanded[dept] ? (
          <div className="lg:flex justify-center mt-4 hidden">
            <button
              onClick={() => toggleManagerExpand(dept)}
              className="flex items-center text-lovesWhite bg-darkCompBg dark:bg-darkBg dark:text-darkPrimaryText font-futura-bold px-4 py-2 rounded-lg"
            >
              <PlusCircleIcon className="h-6 w-6 mr-2 " />
              Show Managers
            </button>
          </div>
        ) : (
          <>
            <div className="border-2 border-darkBorder dark:bg-darkBg  bg-darkBorder mx-2 rounded-lg">
              <div className="border border-darkBorder shadow-md shadow-lovesBlack dark:bg-darkCompBg  bg-darkCompBg lg:m-8 rounded-lg">
                <div className=""></div>
                <div className="flex items-center  mt-4 mb-2 mx-4">
                  <Link
                    href={departmentManagerLinks[dept] || "/default-managers"}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <h1 className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesWhite hover:underline cursor-pointer">
                      {dept} Managers
                    </h1>
                    <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                  </Link>
                </div>
                <Transition
                  show={managersExpanded[dept]}
                  appear
                  enter="transition ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="mt-4 text-center px-4 rounded-lg">
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-x-16 gap-y-4 ">
                        {departmentManagerStats[dept]?.map((manager) => {
                          const { name, ...metrics } = manager;
                          return (
                            <div key={name} className="mb-8 py-2 px-2">
                              <div className="flex items-center justify-center mb-8">
                                <h2 className="text-xl font-futura-bold text-lovesWhite mr-2 hover:underline cursor-pointer">
                                  {name}
                                </h2>
                                <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                              </div>
                              <dl className="grid grid-cols-2 gap-8">
                                {Object.entries(metrics).map(
                                  ([metric, value], idx) => {
                                    const bgColorClass = getBgColor(
                                      metric,
                                      value
                                    );
                                    return (
                                      <StatCardComponent
                                        key={metric}
                                        id={metric}
                                        name={metric}
                                        stat={value}
                                        qualifies={
                                          bgColorClass.trim() ===
                                          "bg-lovesGreen"
                                        }
                                        bgColorClass={bgColorClass}
                                        delay={idx * 300}
                                        isActive={
                                          activeMetrics[dept] === metric
                                        }
                                        onClick={() =>
                                          handleStatCardClick(dept, metric)
                                        }
                                      />
                                    );
                                  }
                                )}
                              </dl>
                              <div className="mt-4 h-80">
                                <LineChartTime
                                  data={fakeDataMap[currentMetric]}
                                  xDataKey="date"
                                  yDataKey={metricMap[currentMetric]}
                                  disableGrouping={true}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Vertical divider for medium screens and above */}
                      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-darkLightGray" />
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

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

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="bg-lovesWhite dark:bg-darkBg min-h-screen">
      <Header />
      <div className="px-5 sm:px-6 lg:px-8 mt-4 flex items-center justify-between">
        <div
          className="text-lovesBlack dark:text-darkPrimaryText dark:bg-darkCompBg font-futura-bold 
                     border border-lightGray shadow-sm shadow-lovesBlack   dark:border-darkBorder
                     rounded-lg lg:px-1 px-1 py-1 cursor-pointer bg-lightGray"
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
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-0 mb-8">
        <Transition
          show={selectedDepartments["Customer Service"]}
          appear
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="group bg-lightGray dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder border dark:border-darkBorder   dark:shadow-sm p-4 rounded-lg mt-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/customer-service/daily-metrics"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h1
                    className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesBlack 
hover:underline cursor-pointer"
                  >
                    Customer Service
                  </h1>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack" />
                </Link>
                <div className="lg:flex items-center space-x-2 hidden">
                  {managersExpanded["Customer Service"] && (
                    <button
                      onClick={() => toggleManagerExpand("Customer Service")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Hide Managers
                    </button>
                  )}
                  {expandedRows["Customer Service"] && (
                    <button
                      onClick={() => toggleExpand("Customer Service")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText lg:px-4 lg:py-2 px-1 py-1 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="lg:h-6 lg:w-6  mr-2" />
                      Close Department
                    </button>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {customerServiceStats.map((item, index) => {
                const isActive =
                  expandedRows["Customer Service"] &&
                  activeMetrics["Customer Service"] === item.name;
                const bgColorClass = getBgColor(item.name, item.stat);
                return (
                  <StatCardComponent
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    stat={item.stat}
                    qualifies={bgColorClass.trim() === "bg-lovesGreen"}
                    bgColorClass={bgColorClass}
                    delay={index * 300}
                    isActive={isActive}
                    onClick={() =>
                      handleStatCardClick("Customer Service", item.name)
                    }
                  />
                );
              })}
            </dl>

            {renderChart("Customer Service")}

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out   transform ${
                expandedRows["Customer Service"]
                  ? "max-h-0 opacity-0"
                  : "max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100"
              }`}
            >
              <button
                onClick={() => toggleExpand("Customer Service")}
                className="w-full mt-4 dark:bg-darkBg text-center py-3 bg-darkBorder dark:text-darkPrimaryText border-2 border-lovesBlack dark:border dark:border-darkBorder rounded-lg text-lovesWhite font-futura-bold text-xl "
              >
                Expand Department
              </button>
            </div>
          </div>
        </Transition>
        <Transition
          show={selectedDepartments["Help Desk"]}
          appear
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="group bg-lightGray dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder border dark:border-darkBorder   dark:shadow-sm p-4 rounded-lg mt-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/help-desk/daily-metrics"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h1
                    className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesBlack 
hover:underline cursor-pointer"
                  >
                    Help Desk
                  </h1>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack" />
                </Link>
                <div className="lg:flex items-center space-x-2 hidden">
                  {managersExpanded["Help Desk"] && (
                    <button
                      onClick={() => toggleManagerExpand("Help Desk")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Hide Managers
                    </button>
                  )}
                  {expandedRows["Help Desk"] && (
                    <button
                      onClick={() => toggleExpand("Help Desk")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Close Department
                    </button>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {helpDeskStats.map((item, index) => {
                const isActive =
                  expandedRows["Help Desk"] &&
                  activeMetrics["Help Desk"] === item.name;
                const bgColorClass = getBgColor(item.name, item.stat);
                return (
                  <StatCardComponent
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    stat={item.stat}
                    qualifies={bgColorClass.trim() === "bg-lovesGreen"}
                    bgColorClass={bgColorClass}
                    delay={index * 300}
                    isActive={isActive}
                    onClick={() => handleStatCardClick("Help Desk", item.name)}
                  />
                );
              })}
            </dl>

            {renderChart("Help Desk")}

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out   transform ${
                expandedRows["Help Desk"]
                  ? "max-h-0 opacity-0"
                  : "max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100"
              }`}
            >
              <button
                onClick={() => toggleExpand("Help Desk")}
                className="w-full mt-4 dark:bg-darkBg text-center py-3 bg-darkBorder dark:text-darkPrimaryText border-2 border-lovesBlack dark:border dark:border-darkBorder rounded-lg text-lovesWhite font-futura-bold text-xl "
              >
                Expand Department
              </button>
            </div>
          </div>
        </Transition>

        {/* Electronic Dispatch */}
        <Transition
          show={selectedDepartments["Electronic Dispatch"]}
          appear
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="group bg-lightGray dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder border dark:border-darkBorder   dark:shadow-sm p-4 rounded-lg mt-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/electronic-dispatch/daily-metrics"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h1
                    className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesBlack 
hover:underline cursor-pointer"
                  >
                    Electronic Dispatch
                  </h1>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack" />
                </Link>
                <div className="lg:flex items-center space-x-2 hidden">
                  {managersExpanded["Electronic Dispatch"] && (
                    <button
                      onClick={() => toggleManagerExpand("Electronic Dispatch")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Hide Managers
                    </button>
                  )}
                  {expandedRows["Electronic Dispatch"] && (
                    <button
                      onClick={() => toggleExpand("Electronic Dispatch")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Close Department
                    </button>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {electronicDispatchStats.map((item, index) => {
                const isActive =
                  expandedRows["Electronic Dispatch"] &&
                  activeMetrics["Electronic Dispatch"] === item.name;
                const bgColorClass = getBgColor(item.name, item.stat);
                return (
                  <StatCardComponent
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    stat={item.stat}
                    qualifies={bgColorClass.trim() === "bg-lovesGreen"}
                    bgColorClass={bgColorClass}
                    delay={index * 300}
                    isActive={isActive}
                    onClick={() =>
                      handleStatCardClick("Electronic Dispatch", item.name)
                    }
                  />
                );
              })}
            </dl>

            {renderChart("Electronic Dispatch")}

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out   transform ${
                expandedRows["Electronic Dispatch"]
                  ? "max-h-0 opacity-0"
                  : "max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100"
              }`}
            >
              <button
                onClick={() => toggleExpand("Electronic Dispatch")}
                className="w-full mt-4 dark:bg-darkBg text-center py-3 bg-darkBorder dark:text-darkPrimaryText border-2 border-lovesBlack dark:border dark:border-darkBorder rounded-lg text-lovesWhite font-futura-bold text-xl "
              >
                Expand Department
              </button>
            </div>
          </div>
        </Transition>

        {/* Written Communication */}
        <Transition
          show={selectedDepartments["Written Communication"]}
          appear
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="group bg-lightGray dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder border dark:border-darkBorder   dark:shadow-sm p-4 rounded-lg mt-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/written-communication/daily-metrics"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h1
                    className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesBlack 
hover:underline cursor-pointer"
                  >
                    Written Communication
                  </h1>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack" />
                </Link>
                <div className="lg:flex items-center space-x-2 hidden">
                  {managersExpanded["Written Communication"] && (
                    <button
                      onClick={() =>
                        toggleManagerExpand("Written Communication")
                      }
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Hide Managers
                    </button>
                  )}
                  {expandedRows["Written Communication"] && (
                    <button
                      onClick={() => toggleExpand("Written Communication")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Close Department
                    </button>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {writtenCommunicationStats.map((item, index) => {
                const isActive =
                  expandedRows["Written Communication"] &&
                  activeMetrics["Written Communication"] === item.name;
                const bgColorClass = getBgColor(item.name, item.stat);
                return (
                  <StatCardComponent
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    stat={item.stat}
                    qualifies={bgColorClass.trim() === "bg-lovesGreen"}
                    bgColorClass={bgColorClass}
                    delay={index * 300}
                    isActive={isActive}
                    onClick={() =>
                      handleStatCardClick("Written Communication", item.name)
                    }
                  />
                );
              })}
            </dl>

            {renderChart("Written Communication")}

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out   transform ${
                expandedRows["Written Communication"]
                  ? "max-h-0 opacity-0"
                  : "max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100"
              }`}
            >
              <button
                onClick={() => toggleExpand("Written Communication")}
                className="w-full mt-4 dark:bg-darkBg text-center py-3 bg-darkBorder dark:text-darkPrimaryText border-2 border-lovesBlack dark:border dark:border-darkBorder rounded-lg text-lovesWhite font-futura-bold text-xl "
              >
                Expand Department
              </button>
            </div>
          </div>
        </Transition>

        {/* Resolutions */}
        <Transition
          show={selectedDepartments["Resolutions"]}
          appear
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="group bg-lightGray dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder border dark:border-darkBorder   dark:shadow-sm p-4 rounded-lg mt-4">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/resolutions/daily-metrics"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <h1
                    className="text-2xl font-futura-bold dark:text-darkPrimaryText text-lovesBlack 
hover:underline cursor-pointer"
                  >
                    Resolutions
                  </h1>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack" />
                </Link>
                <div className="lg:flex items-center space-x-2 hidden">
                  {managersExpanded["Resolutions"] && (
                    <button
                      onClick={() => toggleManagerExpand("Resolutions")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Hide Managers
                    </button>
                  )}
                  {expandedRows["Resolutions"] && (
                    <button
                      onClick={() => toggleExpand("Resolutions")}
                      className="flex items-center bg-darkCompBg text-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText px-4 py-2 rounded-lg font-futura-bold"
                    >
                      <XCircleIcon className="h-6 w-6 mr-2" />
                      Close Department
                    </button>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {resolutionsStats.map((item, index) => {
                const isActive =
                  expandedRows["Resolutions"] &&
                  activeMetrics["Resolutions"] === item.name;
                const bgColorClass = getBgColor(item.name, item.stat);
                return (
                  <StatCardComponent
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    stat={item.stat}
                    qualifies={bgColorClass.trim() === "bg-lovesGreen"}
                    bgColorClass={bgColorClass}
                    delay={index * 300}
                    isActive={isActive}
                    onClick={() =>
                      handleStatCardClick("Resolutions", item.name)
                    }
                  />
                );
              })}
            </dl>

            {renderChart("Resolutions")}

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out   transform ${
                expandedRows["Resolutions"]
                  ? "max-h-0 opacity-0"
                  : "max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100"
              }`}
            >
              <button
                onClick={() => toggleExpand("Resolutions")}
                className="w-full mt-4 dark:bg-darkBg text-center py-3 bg-darkBorder dark:text-darkPrimaryText border-2 border-lovesBlack dark:border dark:border-darkBorder rounded-lg text-lovesWhite font-futura-bold text-xl "
              >
                Expand Department
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
