"use client";

import React, { useState, useMemo, Fragment } from "react";
import Header from "@/components/Navigation/header";
import DashboardSection from "@/components/Dashboard/Hierarchy/DashboardSection";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import {
  customerServiceAverageScore,
  customerServiceAHT,
  qualityInfo,
  customerServiceAdherence,
  allTeamData,
  customerServiceData,
  JohnTeamOverview,
  ShellyTeamOverview,
  JennaTeamOverview,
  BrendaTeamOverview,
  TylerTeamOverview,
  DestinyTeamOverview,
} from "@/data/customerServiceData";
import {
  fakeAHTData,
  fakeAdherenceData,
  fakeQualityData,
  fakeMtdScoreData,
} from "@/data/fakeMetricsData";
import { Transition } from "@headlessui/react";

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

function averagePercentageForSupervisor(dataArray, key, supervisorName) {
  const filtered = dataArray.filter(
    (item) => item.supervisor === supervisorName && item[key]
  );
  if (filtered.length === 0) return "N/A";
  const sum = filtered.reduce((acc, cur) => {
    const num = parseFloat(cur[key].replace("%", ""));
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
  return (sum / filtered.length).toFixed(2) + "%";
}

function averageAHTForSupervisor(dataArray, supervisorName) {
  const filtered = dataArray.filter(
    (item) => item.supervisor === supervisorName
  );
  if (filtered.length === 0) return "N/A";
  const sumSeconds = filtered.reduce((acc, cur) => {
    if (!cur.ahtTeam || !cur.ahtTeam.includes(":")) return acc;
    const [m, s] = cur.ahtTeam.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);
  const validEntries = filtered.filter(
    (item) => item.ahtTeam && item.ahtTeam.includes(":")
  ).length;
  if (validEntries === 0) return "N/A";
  const avgSeconds = sumSeconds / validEntries;
  const m = Math.floor(avgSeconds / 60);
  const s = Math.round(avgSeconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
const dataSets = customerServiceData.dataSets;

const computedCustomerServiceSupervisorStats = Array.from(
  new Set(allTeamData.map((item) => item.supervisor))
).map((supervisorName) => ({
  name: supervisorName,
  "Average Handle Time": averageAHTForSupervisor(
    customerServiceAHT,
    supervisorName
  ),
  Adherence: averagePercentageForSupervisor(
    customerServiceAdherence,
    "qualityTeam",
    supervisorName
  ),
  Quality: averagePercentageForSupervisor(
    qualityInfo,
    "qualityTeam",
    supervisorName
  ),
  "Average Score": averagePercentageForSupervisor(
    customerServiceAverageScore,
    "mtdScore",
    supervisorName
  ),
}));

const agentOverviewMapping = {
  "John Herrera": JohnTeamOverview,
  "Shelly Wynn": ShellyTeamOverview,
  "Jenna Adams": JennaTeamOverview,
  "Brenda Starks": BrendaTeamOverview,
  "Tyler Wheeler": TylerTeamOverview,
  "Destiny Turney": DestinyTeamOverview,
};

const getAgentStatsForSupervisor = (supervisorName) => {
  const data = agentOverviewMapping[supervisorName] || [];
  return data.map((item) => ({
    name: item.agent,
    "Average Handle Time": item.AHT,

    Adherence: item.Adherence.toString().includes("%")
      ? item.Adherence
      : item.Adherence + "%",
    Quality: item.Quality.toString().includes("%")
      ? item.Quality
      : item.Quality + "%",
    "Average Score": item.mtdScore,
  }));
};

const formatMetrics = (entity) =>
  Object.entries(entity)
    .filter(([key]) => key !== "name")
    .map(([metric, value], idx) => ({
      id: idx,
      name: metric,
      stat: value,
    }));

const formatAgentData = (supervisorName) => {
  const agentStats = getAgentStatsForSupervisor(supervisorName);
  return agentStats.map((agent) => {
    const metrics = Object.entries(agent)
      .filter(([key]) => key !== "name")
      .map(([metric, value], idx) => ({
        id: idx,
        name: metric,
        stat: value,
      }));
    return {
      name: agent.name,
      metrics,
    };
  });
};

export default function SupervisorDashboard() {
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
  const supervisorOptions = useMemo(
    () =>
      computedCustomerServiceSupervisorStats.map((sup) => ({
        label: sup.name,
        value: sup.name,
      })),
    []
  );
  const [selectedSupervisors, setSelectedSupervisors] = useState(() =>
    supervisorOptions.reduce((acc, opt) => {
      acc[opt.value] = true;
      return acc;
    }, {})
  );

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
          name="Supervisor"
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          filterOptions={supervisorOptions}
          selectedFilters={selectedSupervisors}
          setSelectedFilters={setSelectedSupervisors}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-0 mb-8">
        {computedCustomerServiceSupervisorStats.map((sup, idx) => {
          const isVisible = selectedSupervisors[sup.name];
          const parentStats = formatMetrics(sup);
          const subordinateStats = formatMetrics(sup.name);
          return (
            <Transition
              key={sup.name}
              show={selectedSupervisors[sup.name]}
              appear
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* child handles the translate-y for “up” + the delay */}
              <Transition.Child
                as="div"
                enter="transform"
                enterFrom="translate-y-4"
                enterTo="translate-y-0"
                leave="" // no extra transform on leave
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <DashboardSection
                  key={sup.name}
                  name="Supervisor"
                  title={sup.name}
                  headerLink={`/customer-service/daily-metrics/supervisor/${sup.name}`}
                  subordinateTitle="Agents"
                  subordinateLink="/customer-service/daily-metrics/agent"
                  parentStats={parentStats}
                  subordinateStats={subordinateStats}
                  chartDataMap={fakeDataMap}
                  metricMap={metricMap}
                  agent={false}
                  fromDate={fromDate}
                  setFromDate={setFromDate}
                  toDate={toDate}
                  setToDate={setToDate}
                  dataSets={dataSets}
                  allTeamData={allTeamData}
                />
              </Transition.Child>
            </Transition>
          );
        })}
      </div>
    </div>
  );
}
