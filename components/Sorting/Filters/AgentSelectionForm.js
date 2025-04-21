"use client";

import React, { useState, useMemo, Fragment } from "react";
import Header from "@/components/Navigation/header";
import DashboardSection from "@/components/Dashboard/DashboardSection";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
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

const agentData = [
  ...JohnTeamOverview,
  ...ShellyTeamOverview,
  ...JennaTeamOverview,
  ...BrendaTeamOverview,
  ...TylerTeamOverview,
  ...DestinyTeamOverview,
];

const metricRenameMap = {
  AHT: "Average Handle Time",
  Quality: "Quality",
  Adherence: "Adherence",
  mtdScore: "Average Score",
};
const INTERNAL_ORDER = ["AHT", "Adherence", "Quality", "mtdScore"];
const formatMetrics = (entity) =>
  Object.entries(entity)
    .filter(([k]) => !["agent", "manager", "supervisor"].includes(k))

    .sort(
      ([aKey], [bKey]) =>
        INTERNAL_ORDER.indexOf(aKey) - INTERNAL_ORDER.indexOf(bKey)
    )
    .map(([metric, value], idx) => ({
      id: idx,
      name: metricRenameMap[metric] || metric,
      stat: value,
    }));
const dataSets = customerServiceData.dataSets;

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
  const groupedAgentOptions = useMemo(() => {
    const supervisors = {};
    agentData.forEach(({ supervisor, agent }) => {
      if (!supervisors[supervisor]) supervisors[supervisor] = [];
      supervisors[supervisor].push({ label: agent, value: agent });
    });
    return Object.entries(supervisors).map(([sup, opts]) => ({
      label: sup,
      options: opts,
    }));
  }, []);

  const agentOptions = useMemo(() => {
    const unique = Array.from(new Set(agentData.map((a) => a.agent)));
    return unique.map((name) => ({ label: name, value: name }));
  }, []);
  const supervisorOptions = useMemo(() => {
    const unique = Array.from(new Set(agentData.map((a) => a.supervisor)));
    return unique.map((name) => ({ label: name, value: name }));
  }, []);

  const [selectedSupervisors, setSelectedSupervisors] = useState(() =>
    supervisorOptions.reduce((acc, opt) => {
      acc[opt.value] = true;
      return acc;
    }, {})
  );

  const [selectedAgents, setSelectedAgents] = useState(() =>
    agentOptions.reduce((acc, opt) => {
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
          name="Agent"
          isAgentFilter={true}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          filterOptions={groupedAgentOptions}
          selectedFilters={selectedAgents}
          setSelectedFilters={setSelectedAgents}
          supervisorOptions={supervisorOptions}
          selectedSupervisors={selectedSupervisors}
          setSelectedSupervisors={setSelectedSupervisors}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-0 mb-8">
        {agentData.map((agent, idx) => {
          const isVisible =
            selectedAgents[agent.agent] &&
            selectedSupervisors[agent.supervisor];
          const parentStats = formatMetrics(agent);

          return (
            <Transition
              key={agent.agent}
              as={Fragment}
              show={isVisible}
              appear
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
                  key={agent.agent}
                  title={agent.agent}
                  name={"Agent"}
                  headerLink={`/customer-service/daily-metrics/agent/${agent.agent}`}
                  agent={true}
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
              </Transition.Child>
            </Transition>
          );
        })}
      </div>
    </div>
  );
}
