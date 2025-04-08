"use client";

import React, { useState } from "react";
import Header from "@/components/Navigation/header";
import DashboardSection from "@/components/Dashboard/DashboardSection";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";

// Import agent-level data from your customer service data file
import {
  JohnTeamOverview,
  ShellyTeamOverview,
  JennaTeamOverview,
  BrendaTeamOverview,
  TylerTeamOverview,
  DestinyTeamOverview,
  allTeamData,
  customerServiceData,
} from "@/data/customerServiceData";

import {
  fakeAHTData,
  fakeAdherenceData,
  fakeQualityData,
  fakeMtdScoreData,
} from "@/data/fakeMetricsData";

// Create the fake data mapping for charts (adjust keys if needed)
const fakeDataMap = {
  "Average Handle Time": fakeAHTData,
  Adherence: fakeAdherenceData,
  Quality: fakeQualityData,
  "Average Score": fakeMtdScoreData,
};

// Mapping for the chart’s yDataKey per metric name
const metricMap = {
  "Average Handle Time": "ahtTeam",
  Adherence: "adherence",
  Quality: "qualityTeam",
  "Average Score": "mtdScore",
};

// Flatten all agent arrays into a single array.
// This ignores any supervisor mapping and treats all agents as a single list.
const agentData = [
  ...JohnTeamOverview,
  ...ShellyTeamOverview,
  ...JennaTeamOverview,
  ...BrendaTeamOverview,
  ...TylerTeamOverview,
  ...DestinyTeamOverview,
];

// Conversion mapping for renaming metric keys
const metricRenameMap = {
  mtdScore: "Average Score",
  AHT: "Average Handle Time",
};

// Utility function: Formats each agent’s metrics and renames certain keys,
// while filtering out unwanted keys (like "manager" or "supervisor").
const formatMetrics = (entity) =>
  Object.entries(entity)
    .filter(
      ([key]) => key !== "agent" && key !== "manager" && key !== "supervisor"
    )
    .map(([metric, value], idx) => ({
      id: idx,
      name: metricRenameMap[metric] || metric, // rename mtdScore and AHT as desired
      stat: value,
    }));
const dataSets = customerServiceData.dataSets;
// ─── AGENT DASHBOARD COMPONENT ───────────────────────────────
export default function AgentSelectionForm() {
  const {
    currentDate,
    setCurrentDate,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = useDateRange();

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState({
    "Customer Service": true,
    "Help Desk": true,
    "Electronic Dispatch": true,
    "Written Communication": true,
    Resolutions: true,
  });

  return (
    <div className="bg-lovesWhite dark:bg-darkBg min-h-screen">
      <Header />
      <div className="px-5 sm:px-6 lg:px-8 mt-4 flex items-center justify-between">
        <div
          className="text-lovesBlack dark:text-darkPrimaryText dark:bg-darkCompBg font-futura-bold 
                     border border-lightGray shadow-sm shadow-lovesBlack dark:border-darkBorder
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
        {/* Render a DashboardSection for each agent */}
        {agentData.map((agent) => {
          const parentStats = formatMetrics(agent);
          return (
            <DashboardSection
              key={agent.agent}
              title={agent.agent}
              name={"Agent"}
              headerLink={`/customer-service/daily-metrics/agent/${agent.agent}`}
              // Pass the "agent" prop to adjust the DashboardSection UI (e.g., hide subordinate features)
              agent={true}
              // Agents do not have subordinate data, so we only pass the parent's metrics.
              parentStats={parentStats}
              chartDataMap={fakeDataMap}
              metricMap={metricMap}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              dataSets={dataSets}
              allTeamData={allTeamData}
            />
          );
        })}
      </div>
    </div>
  );
}
