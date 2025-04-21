"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/20/solid";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";

import Header from "@/components/Navigation/header";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import StatCard from "@/components/Card/StatCard";

const averageHandleTimeGoal = "5:30 - 6:30";
const qualityGoal = "88%";
const adherenceGoal = "88%";
const averageScoreGoal = "95%";

// Shared utils:
function getBgColor(statName, statValue) {
  /*... identical ...*/
}
function computeAverageTime(data, key) {
  /*... identical ...*/
}
function computeAveragePercentage(data, key) {
  /*... identical ...*/
}
function aggregateMetrics(data) {
  return {
    AHT: computeAverageTime(data, "AHT"),
    mtdScore: computeAveragePercentage(data, "mtdScore"),
    Adherence: computeAveragePercentage(data, "Adherence"),
    Quality: computeAveragePercentage(data, "Quality"),
  };
}

// The generic page:
export default function IndividualDashboard({
  role, // "agent" | "supervisor" | "manager"
  paramName, // "agents" | "supervisor" | "managers"
  DashboardComponent, // AgentDashboard, SupervisorDashboard, ManagerDashboard
  ChartControls, // a component to render e.g. metric & chartType selectors
  renderDetailView, // function to render the “detail” (stat cards + main chart + table)
  renderComparisonView, // function to render the comparison UI
  pages, // breadcrumb config array
}) {
  const router = useRouter();
  const queryValue = router.query[paramName];
  const isDetail = true;
  const [showComparison, setShowComparison] = useState(false);

  // date picker
  const {
    currentDate,
    fromDate,
    toDate,
    setCurrentDate,
    setFromDate,
    setToDate,
  } = useDateRange();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState({
    "Customer Service": true,
    "Help Desk": true,
    "Electronic Dispatch": true,
    "Written Communication": true,
    Resolutions: true,
  });
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // -- if no query param, render the top‐level dashboard --
  if (!queryValue) {
    return <DashboardComponent />;
  }

  // -- otherwise, render detail/comparison page --
  return (
    <div className="bg-lovesWhite dark:bg-darkBg mb-8">
      <Header />

      {/* Mobile breadcrumb & date picker */}
      <div className="lg:hidden px-4 py-2">
        {!showComparison && <nav>{/* home + pages breadcrumb */}</nav>}
        <div className="flex justify-between mt-2">
          <div onClick={() => setShowCalendar(true)}>
            {fromDate && toDate
              ? `${fromDate.toLocaleDateString()} – ${toDate.toLocaleDateString()}`
              : "Select Date Range"}
          </div>
          <FilterCalendarToggle
            {...{
              fromDate,
              toDate,
              setFromDate,
              setToDate,
              currentDate,
              setCurrentDate,
              selectedDateRange,
              setSelectedDateRange,
              selectedDepartments,
              setSelectedDepartments,
              showCalendar,
              setShowCalendar,
              isDetail,
              showComparison,
              setShowComparison,
            }}
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block px-8 py-4 relative h-16">
        {!showComparison ? <nav>{/* home + pages breadcrumb */}</nav> : null}
        <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-4">
          <div onClick={() => setShowCalendar(true)}>
            {fromDate && toDate
              ? `${fromDate.toLocaleDateString()} – ${toDate.toLocaleDateString()}`
              : "Select Date Range"}
          </div>
          <FilterCalendarToggle
            {...{
              fromDate,
              toDate,
              setFromDate,
              setToDate,
              currentDate,
              setCurrentDate,
              selectedDateRange,
              setSelectedDateRange,
              selectedDepartments,
              setSelectedDepartments,
              showCalendar,
              setShowCalendar,
              isDetail,
              showComparison,
              setShowComparison,
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 lg:px-8">
        {showComparison
          ? renderComparisonView({ queryValue, setShowComparison })
          : renderDetailView({
              queryValue,
              setShowComparison,
              currentDate,
              fromDate,
              toDate,
              selectedDepartments,
              selectedDateRange,
            })}
      </div>
    </div>
  );
}
