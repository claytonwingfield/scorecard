"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { performSearch } from "@/components/Sorting/Search/Hooks/searchUtils";
import { Transition } from "@headlessui/react";
import Header from "@/components/Navigation/header";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import StatCard from "@/components/Card/StatCard"; // Your current stat card component
const LineChartTime = dynamic(
  () => import("@/components/Charts/LineChartTime"),
  { ssr: false }
);

const DashboardSection = ({
  title,
  headerLink,
  subordinateTitle,
  agent,
  name,
  subordinateLink,
  parentStats, // Array of metric objects for the parent item (for example: [{ id, name, stat }, ...])
  subordinateStats, // Array of subordinate objects; each object should have a `name` and a `metrics` array (each metric: { id, name, stat })
  chartDataMap, // Mapping from metric name to its chart dataset
  metricMap, // Mapping from metric name to the yDataKey for your chart (e.g.: { "Average Handle Time": "ahtTeam", ... })
  initialActiveMetric = "Average Handle Time",
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  dataSets,
  allTeamData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [subExpanded, setSubExpanded] = useState(false);
  const [activeMetric, setActiveMetric] = useState(initialActiveMetric);
  const handleTitleClick = () => {
    if (name === "Department") {
      // Navigate directly to the department dashboard using the headerLink
      router.push(headerLink);
      return;
    }

    const activeFilters = [{ type: name, label: title }];

    // Start the loading state
    setIsLoading(true);

    performSearch({
      activeFilters,
      fromDate,
      toDate,
      dataSets,
      allTeamData,
      router,
      setIsLoading, // This can be used to reset the loading flag when search is done
    });
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
    // Collapse subordinate block when closing the parent section.
    if (expanded) setSubExpanded(false);
    setExpanded(!expanded);
  };

  const toggleSubExpanded = () => {
    setSubExpanded(!subExpanded);
  };

  const handleMetricClick = (metricName) => {
    setActiveMetric(metricName);
    if (!expanded) setExpanded(true);
  };

  const renderChart = () => {
    if (!expanded) return null;

    return (
      <>
        {/* Main chart for the parent's active metric */}
        <div className="my-4 h-80">
          <LineChartTime
            data={chartDataMap[activeMetric]}
            xDataKey="date"
            yDataKey={metricMap[activeMetric]}
            disableGrouping={true}
          />
        </div>

        {/* Subordinate Block */}
        {subExpanded && subordinateStats && (
          <div className="border-2 border-darkBorder dark:bg-darkBg bg-darkBorder mx-2 rounded-lg mt-4 p-4">
            <div className="border border-darkBorder shadow-md shadow-lovesBlack dark:bg-darkCompBg  bg-darkCompBg lg:m-8 rounded-lg">
              <div className=""></div>
              <div className="flex items-center  mt-4 mb-2 mx-4">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Link href={subordinateLink}>
                    <h1 className="text-2xl font-futura-bold dark:text-darkPrimaryText mr-2 text-lovesWhite hover:underline cursor-pointer">
                      {subordinateTitle}
                    </h1>
                  </Link>
                  <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                </div>
              </div>
              <div className="mt-4 text-center px-4 rounded-lg">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-x-16 gap-y-4">
                    {subordinateStats.map((subordinate) => (
                      <div key={subordinate.name} className="mb-8 py-2 px-2">
                        <div className="flex items-center justify-center mb-8">
                          <h2
                            onClick={handleTitleClick}
                            className="text-xl font-futura-bold text-lovesWhite mr-2 hover:underline cursor-pointer"
                          >
                            {subordinate.name}
                          </h2>
                          <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {subordinate.metrics &&
                            subordinate.metrics.map((m) => (
                              <StatCard
                                key={m.id}
                                id={m.id}
                                name={m.name}
                                stat={m.stat}
                                // Use your own logic to determine qualification (for example, based on background color)
                                qualifies={true}
                                delay={100}
                                allowGlow={toggleExpand}
                                isActive={activeMetric === m.name}
                                onClick={() => handleMetricClick(m.name)}
                              />
                            ))}
                        </div>
                        <div className="mt-4 h-80">
                          <LineChartTime
                            data={chartDataMap[activeMetric]}
                            xDataKey="date"
                            yDataKey={metricMap[activeMetric]}
                            disableGrouping={true}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-darkLightGray" />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="group bg-lightGray dark:bg-darkCompBg shadow-md p-4 rounded-lg mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1
            onClick={handleTitleClick}
            className="text-2xl dark:text-darkPrimaryText font-futura-bold text-lovesBlack hover:underline cursor-pointer"
          >
            {title}
          </h1>
          <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack ml-2" />
        </div>
        <div className="hidden lg:flex items-center space-x-2">
          {subExpanded && (
            <button
              onClick={toggleSubExpanded}
              className="flex items-center bg-darkCompBg dark:bg-darkBg text-lovesWhite px-4 py-2 rounded-lg font-futura-bold"
            >
              <XCircleIcon className="h-6 w-6 mr-2" />
              Hide {subordinateTitle}
            </button>
          )}
          {expanded && (
            <button
              onClick={toggleExpand}
              className="flex items-center bg-darkCompBg dark:bg-darkBg text-lovesWhite px-4 py-2 rounded-lg font-futura-bold"
            >
              <XCircleIcon className="h-6 w-6 mr-2" />
              Close {name}
            </button>
          )}
        </div>
      </div>

      {/* Parent Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {parentStats.map((item, index) => {
          // Only mark the StatCard active (and thus glow) if the section is expanded
          // and its metric equals the activeMetric.
          const isActiveForItem = expanded && activeMetric === item.name;
          return (
            <StatCard
              key={item.id}
              id={item.id}
              name={item.name}
              stat={item.stat}
              qualifies={true}
              delay={index * 300}
              isActive={isActiveForItem}
              onClick={() => handleMetricClick(item.name)}
            />
          );
        })}
      </div>

      {/* Chart and subordinate block */}
      <Transition
        show={expanded}
        appear
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div>{renderChart()}</div>
      </Transition>

      {/* Toggle button when not expanded */}
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

      {/* Button to toggle subordinate block if the section is open */}
      {expanded && (
        <div className="mt-4 lg:flex justify-center">
          <button
            onClick={toggleSubExpanded}
            className="inline-flex items-center justify-center text-lovesWhite bg-darkCompBg dark:bg-darkBg dark:text-darkPrimaryText font-futura-bold px-4 py-2 rounded-lg"
          >
            {subExpanded ? (
              <span className="flex items-center">
                {/* Optionally, you could show a different icon/text when expanded */}
                Hide {subordinateTitle}
              </span>
            ) : (
              <span className="flex items-center">
                <PlusCircleIcon className="h-6 w-6 mr-2" />
                Show {subordinateTitle}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardSection;
