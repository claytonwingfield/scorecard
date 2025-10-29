"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
// Assuming performSearch is correctly implemented elsewhere
// import { performSearch } from "@/components/Sorting/Search/Hooks/searchUtils";
import { Transition } from "@headlessui/react";
import Header from "@/components/Navigation/header";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import StatCard from "@/components/Card/StatCard";

const LineChartTime = dynamic(
  () => import("@/components/Charts/LineChartTime"),
  { ssr: false }
);

// Define goals constants
const defaultHandleTimeGoalRange = "5:30 - 6:30"; // Default AHT range
const helpDeskHandleTimeGoalRange = "3:30 - 5:30"; // Help Desk specific AHT range
const qualityGoal = 88; // Assuming percentage number
const adherenceGoal = 88; // Assuming percentage number
const averageScoreGoal = 95; // Assuming percentage number

// *** UPDATED Helper function to check qualification ***
// *** Now accepts 'departmentTitle' ***
function checkQualification(statName, statValue, departmentTitle) {
  if (!statValue || statValue === "N/A") {
    return false; // Cannot qualify if N/A
  }

  try {
    if (statName === "Average Handle Time") {
      const [mins, secs] = statValue.split(":").map(Number);
      if (isNaN(mins) || isNaN(secs)) return false;
      const totalSeconds = mins * 60 + secs;

      // *** Select goal range based on department ***
      const goalRangeString =
        departmentTitle === "Help Desk"
          ? helpDeskHandleTimeGoalRange
          : defaultHandleTimeGoalRange;

      // Parse selected goal range
      const [lowStr, highStr] = goalRangeString.split(" - ");
      const [lowMins, lowSecs] = lowStr.split(":").map(Number);
      const [highMins, highSecs] = highStr.split(":").map(Number);
      if (
        isNaN(lowMins) ||
        isNaN(lowSecs) ||
        isNaN(highMins) ||
        isNaN(highSecs)
      )
        return false; // Goal format error

      const lowerBound = lowMins * 60 + lowSecs;
      const upperBound = highMins * 60 + highSecs;
      return totalSeconds >= lowerBound && totalSeconds <= upperBound;
    } else {
      // Handle percentage-based goals
      const num = parseFloat(statValue.replace("%", ""));
      if (isNaN(num)) return false;

      if (statName === "Adherence") {
        return num >= adherenceGoal;
      } else if (statName === "Quality") {
        return num >= qualityGoal;
      } else if (statName === "Average Score") {
        return num >= averageScoreGoal; // Assuming 'Score' uses averageScoreGoal
      }
    }
  } catch (e) {
    console.error(
      `Error checking qualification for ${statName} (${statValue}) in ${departmentTitle}:`,
      e
    );
    return false; // Error during check means doesn't qualify
  }

  return false; // Default to not qualified if metric name doesn't match
}

const DashboardSection = ({
  title, // This is the department title (e.g., "Help Desk", "Customer Service")
  headerLink,
  subordinateTitle,
  name,
  subordinateLink,
  parentStats,
  subordinateStats,
  realChartData,
  chartDataMap,
  metricMap,
  initialActiveMetric = "Average Handle Time",
  fromDate,
  toDate,
}) => {
  // ... (rest of the component logic: router, state, handlers, renderChart) ...
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [subExpanded, setSubExpanded] = useState(false);
  const [activeMetric, setActiveMetric] = useState(initialActiveMetric);

  // Simplified handleTitleClick for hierarchy navigation
  const handleTitleClick = () => {
    if (name === "Department") {
      router.push(headerLink);
      return;
    }
    console.log(
      `Title clicked: ${title} (Type: ${name}). Navigating to: ${headerLink}`
    );
    router.push(headerLink);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingAnimation />
      </>
    );
  }

  const toggleExpand = () => {
    if (expanded) setSubExpanded(false);
    setExpanded(!expanded);
  };
  const toggleSubExpanded = () => setSubExpanded(!subExpanded);
  const handleMetricClick = (metricName) => {
    setActiveMetric(metricName);
    if (!expanded) setExpanded(true);
  };

  const renderChart = () => {
    if (!expanded || !realChartData || !realChartData[activeMetric]) {
      console.warn(
        "Cannot render chart. Missing realChartData for activeMetric:",
        activeMetric
      );
      return null;
    }
    const chartDataForMetric = realChartData[activeMetric];
    const overallAverageStat =
      (parentStats || []).find((stat) => stat.name === activeMetric)?.stat ??
      "N/A";
    return (
      <>
        {/* Main Chart */}
        <div className="my-4 h-80">
          <LineChartTime
            data={chartDataForMetric} // Or potentially subordinate-specific data if calculated
            xDataKey="date"
            yDataKey="value"
            metricName={activeMetric}
            cardAverageStat={overallAverageStat}
            departmentTitle={title} // Pass metric name
            disableGrouping
          />
        </div>

        {/* Subordinate Section (Supervisors) */}
        <Transition
          show={subExpanded}
          // ... transition props ...
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          as="div"
        >
          <div className="border-2 border-darkBorder dark:bg-darkBg bg-darkBorder mx-2 rounded-lg mt-16 p-4 ">
            <div className="border border-darkBorder shadow-md shadow-lovesBlack dark:bg-darkCompBg bg-darkCompBg lg:m-8 rounded-lg">
              {/* Subordinate Header */}
              <div className="flex items-center mt-4 mb-2 mx-4">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Link href={subordinateLink}>
                    <h1 className="text-2xl font-futura-bold dark:text-darkPrimaryText mr-2 text-lovesWhite hover:underline">
                      {subordinateTitle}
                    </h1>
                  </Link>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                </div>
              </div>
              {/* Subordinate Grid */}
              <div className="mt-4 text-center px-4 rounded-lg mb-8">
                <div className="relative">
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-16 gap-y-12">
                    {/* Iterate over supervisors */}
                    {(subordinateStats || []).map((subordinate) => (
                      <div key={subordinate.name} className="mb-8 py-2 px-2">
                        {/* Subordinate Name + Link */}
                        <div className="flex items-center justify-center mb-8">
                          <h2
                            onClick={() => {
                              console.log(
                                `Subordinate clicked: ${subordinate.name}`
                              );
                              // Optionally navigate: router.push(`${subordinateLink}/${encodeURIComponent(subordinate.name)}`);
                            }}
                            className="text-xl font-futura-bold text-lovesWhite mr-2 hover:underline cursor-pointer"
                          >
                            {subordinate.name}
                          </h2>
                          <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                        </div>
                        {/* Subordinate Stat Cards */}
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-2">
                          {(subordinate.metrics || []).map((m) => {
                            // *** Pass 'title' (department title) to checkQualification ***
                            const subQualifies = checkQualification(
                              m.name,
                              m.stat,
                              title
                            );
                            return (
                              <StatCard
                                key={m.id || `${subordinate.name}-${m.name}`}
                                id={m.id || `${subordinate.name}-${m.name}`}
                                {...m} // Includes name and stat
                                qualifies={subQualifies} // Use calculated qualification
                                delay={100}
                                allowGlow={toggleExpand} // Should this be toggleSubExpand?
                                isActive={activeMetric === m.name}
                                onClick={() => handleMetricClick(m.name)}
                              />
                            );
                          })}
                        </div>
                        {/* Subordinate Chart (Optional) */}
                        <div className="mt-4 h-80 lg:block hidden">
                          <LineChartTime
                            data={chartDataForMetric} // Or potentially subordinate-specific data if calculated
                            xDataKey="date"
                            yDataKey="value"
                            metricName={activeMetric}
                            cardAverageStat={overallAverageStat}
                            departmentTitle={title} // Pass metric name
                            disableGrouping
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Divider */}
                  <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-darkLightGray" />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </>
    );
  };

  return (
    <div className="group bg-lightGray dark:bg-darkCompBg shadow-md p-4 rounded-lg mt-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleTitleClick}
        >
          <h1 className="text-2xl dark:text-darkPrimaryText font-futura-bold text-lovesBlack hover:underline">
            {title} {/* This title is used for department check */}
          </h1>
          <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack ml-2" />
        </div>
        {/* ... Expand/Collapse Buttons ... */}
        <div className="flex lg:space-x-2 space-x-3">
          {expanded && subExpanded && (
            <button
              onClick={toggleSubExpanded}
              className="hidden lg:flex items-center bg-darkCompBg dark:bg-darkBg text-lovesWhite px-4 py-2 rounded-lg font-futura-bold"
            >
              <XCircleIcon className="h-6 w-6 mr-2" />
              Hide {subordinateTitle}
            </button>
          )}
          {expanded && (
            <button
              onClick={toggleExpand}
              className="flex items-center bg-darkCompBg dark:bg-darkBg text-lovesWhite px-2 py-2 lg:px-4 lg:py-2 rounded-lg font-futura-bold"
            >
              <XCircleIcon className="h-6 w-6 mr-2" />
              <span className="lg:hidden">Close</span>
              <span className="hidden lg:inline">Close {name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Parent Stat Cards Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(parentStats || []).map((item, i) => {
          // *** Pass 'title' (department title) to checkQualification ***
          const qualifies = checkQualification(item.name, item.stat, title);
          // Log the qualification result for debugging
          // console.log(`[${title}] Stat: ${item.name}, Value: ${item.stat}, Qualifies: ${qualifies}`);
          return (
            <StatCard
              key={item.id || `${item.name}-${i}`}
              id={item.id || `${item.name}-${i}`}
              name={item.name}
              stat={item.stat}
              qualifies={qualifies} // Pass dynamic value
              delay={i * 300}
              isActive={expanded && activeMetric === item.name}
              onClick={() => handleMetricClick(item.name)}
            />
          );
        })}
      </div>

      {/* Chart and Subordinate Section (conditionally rendered) */}
      <Transition
        show={expanded}
        // ... transition props ...
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        as="div"
      >
        <div>{renderChart()}</div>
      </Transition>

      {/* Expand Button (shown only when collapsed) */}
      {!expanded && (
        <div className="overflow-hidden transition-all duration-500 ease-in-out transform max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
          <button
            onClick={toggleExpand}
            className="w-full mt-4 dark:bg-darkBg text-center py-3 bg-darkBorder dark:text-darkPrimaryText border-2 border-lovesBlack rounded-lg text-lovesWhite font-futura-bold text-xl"
          >
            Expand {name}
          </button>
        </div>
      )}

      {/* Show/Hide Subordinates Button */}
      {expanded && name !== "Agent" && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={toggleSubExpanded}
            className="inline-flex items-center bg-darkCompBg dark:bg-darkBg text-lovesWhite px-4 py-2 rounded-lg font-futura-bold"
          >
            {subExpanded ? (
              <>
                <XCircleIcon className="h-6 w-6 mr-2" />
                Hide {subordinateTitle}
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-6 w-6 mr-2" />
                Show {subordinateTitle}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardSection;
