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
import StatCard from "@/components/Card/StatCard";

const LineChartTime = dynamic(
  () => import("@/components/Charts/LineChartTime"),
  { ssr: false }
);

const DashboardSection = ({
  title,
  headerLink,
  subordinateTitle,
  name,
  subordinateLink,
  parentStats,
  subordinateStats,
  chartDataMap,
  metricMap,
  initialActiveMetric = "Average Handle Time",
  fromDate,
  toDate,
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
      router.push(headerLink);
      return;
    }
    setIsLoading(true);
    performSearch({
      activeFilters: [{ type: name, label: title }],
      fromDate,
      toDate,
      dataSets,
      allTeamData,
      router,
      setIsLoading,
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
    if (expanded) setSubExpanded(false);
    setExpanded(!expanded);
  };
  const toggleSubExpanded = () => setSubExpanded(!subExpanded);
  const handleMetricClick = (metricName) => {
    setActiveMetric(metricName);
    if (!expanded) setExpanded(true);
  };

  const renderChart = () => {
    if (!expanded) return null;
    return (
      <>
        <div className="my-4 h-80">
          <LineChartTime
            data={chartDataMap[activeMetric]}
            xDataKey="date"
            yDataKey={metricMap[activeMetric]}
            disableGrouping
          />
        </div>

        <Transition
          show={subExpanded}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          as="div"
        >
          <div className="border-2 border-darkBorder dark:bg-darkBg bg-darkBorder mx-2 rounded-lg mt-4 p-4">
            <div className="border border-darkBorder shadow-md shadow-lovesBlack dark:bg-darkCompBg bg-darkCompBg lg:m-8 rounded-lg">
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
              <div className="mt-4 text-center px-4 rounded-lg">
                <div className="relative">
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-16 gap-y-4">
                    {subordinateStats.map((subordinate) => (
                      <div key={subordinate.name} className="mb-8 py-2 px-2">
                        <div className="flex items-center justify-center mb-8">
                          <h2
                            onClick={handleTitleClick}
                            className="text-xl font-futura-bold text-lovesWhite mr-2 hover:underline"
                          >
                            {subordinate.name}
                          </h2>
                          <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesWhite" />
                        </div>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-2">
                          {subordinate.metrics.map((m) => (
                            <StatCard
                              key={m.id}
                              {...m}
                              qualifies
                              delay={100}
                              allowGlow={toggleExpand}
                              isActive={activeMetric === m.name}
                              onClick={() => handleMetricClick(m.name)}
                            />
                          ))}
                        </div>
                        <div className="mt-4 h-80 lg:block hidden">
                          <LineChartTime
                            data={chartDataMap[activeMetric]}
                            xDataKey="date"
                            yDataKey={metricMap[activeMetric]}
                            disableGrouping
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
        </Transition>
      </>
    );
  };

  return (
    <div className="group bg-lightGray dark:bg-darkCompBg shadow-md p-4 rounded-lg mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1
            onClick={handleTitleClick}
            className="text-2xl dark:text-darkPrimaryText font-futura-bold text-lovesBlack hover:underline"
          >
            {title}
          </h1>
          <ChevronRightIcon className="h-6 w-6 dark:text-darkPrimaryText text-lovesBlack ml-2" />
        </div>

        <div className="flex lg:space-x-2 space-x-3">
          {subExpanded && (
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {parentStats.map((item, i) => (
          <StatCard
            key={item.id}
            id={item.id}
            name={item.name}
            stat={item.stat}
            qualifies
            delay={i * 300}
            isActive={expanded && activeMetric === item.name}
            onClick={() => handleMetricClick(item.name)}
          />
        ))}
      </div>

      <Transition
        show={expanded}
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

      {expanded && name !== "Agent" && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleSubExpanded}
            className="inline-flex items-center bg-darkCompBg dark:bg-darkBg text-lovesWhite px-4 py-2 rounded-lg font-futura-bold"
          >
            {subExpanded ? (
              <span className="flex items-center">Hide {subordinateTitle}</span>
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
