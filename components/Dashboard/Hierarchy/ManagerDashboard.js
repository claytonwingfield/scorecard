"use client";

import React, { useState, Fragment } from "react";
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
} from "@/data/customerServiceData";
import { Transition } from "@headlessui/react";

function generateRandomMetricValue(metricName) {
  if (metricName === "Average Handle Time") {
    const seconds = Math.floor(Math.random() * (390 - 300 + 1)) + 300;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else if (metricName === "Average Score") {
    const value = (Math.random() * 15 + 90).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Adherence") {
    const value = (Math.random() * 10 + 85).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Quality") {
    const value = (Math.random() * 15 + 80).toFixed(2);
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

function generateRandomAHTFormatted() {
  const minSeconds = 5 * 60;
  const maxSeconds = 7 * 60;
  const seconds =
    Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
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

export const fakeDataMap = {
  "Average Handle Time": fakeAHTData,
  Adherence: fakeAdherenceData,
  Quality: fakeQualityData,
  "Average Score": fakeMtdScoreData,
};

function averagePercentageForManager(dataArray, key, managerName) {
  const filtered = dataArray.filter((item) => item.manager === managerName);
  if (filtered.length === 0) return "N/A";
  const sum = filtered.reduce(
    (acc, cur) => acc + parseFloat(cur[key].replace("%", "")),
    0
  );
  return (sum / filtered.length).toFixed(2) + "%";
}

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
    if (!cur.ahtTeam) return acc;
    const parts = cur.ahtTeam.split(":");
    if (parts.length < 2) return acc;
    const [m, s] = parts.map(Number);
    return acc + m * 60 + s;
  }, 0);
  const validEntriesCount = filtered.filter(
    (item) => item.ahtTeam && item.ahtTeam.includes(":")
  ).length;
  if (validEntriesCount === 0) return "N/A";
  const avgSeconds = sumSeconds / validEntriesCount;
  const m = Math.floor(avgSeconds / 60);
  const s = Math.round(avgSeconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
const dataSets = customerServiceData.dataSets;

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
const managerOptions = computedCustomerServiceManagerStats.map((m) => ({
  label: m.name,
  value: m.name,
}));
const getSupervisorStatsForManager = (managerName) => {
  const filteredData = allTeamData.filter(
    (item) => item.manager === managerName
  );

  const uniqueSupervisors = Array.from(
    new Set(filteredData.map((item) => item.supervisor))
  );
  return uniqueSupervisors.map((supervisorName) => ({
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
};

const formatMetrics = (entity) => {
  return Object.entries(entity)
    .filter(([key]) => key !== "name")
    .map(([metric, value], idx) => ({
      id: idx,
      name: metric,
      stat: value,
    }));
};

const formatSupervisorData = (managerName) => {
  const supervisorStats = getSupervisorStatsForManager(managerName);
  return supervisorStats.map((supervisor) => {
    const metrics = Object.entries(supervisor)
      .filter(([key]) => key !== "name")
      .map(([metric, value], idx) => ({
        id: idx,
        name: metric,
        stat: value,
      }));
    return {
      name: supervisor.name,
      metrics,
    };
  });
};

const metricMap = {
  "Average Handle Time": "ahtTeam",
  Adherence: "adherence",
  Quality: "qualityTeam",
  "Average Score": "mtdScore",
};

export default function ManagerDashboard() {
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

  const [selectedManagers, setSelectedManagers] = useState(
    managerOptions.reduce((acc, opt) => ({ ...acc, [opt.value]: true }), {})
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
          name="Manager"
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          filterOptions={managerOptions}
          selectedFilters={selectedManagers}
          setSelectedFilters={setSelectedManagers}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-0 mb-8">
        {computedCustomerServiceManagerStats.map((manager, idx) => {
          const parentStats = formatMetrics(manager);
          const subordinateStats = formatSupervisorData(manager.name);

          return (
            <Transition
              key={manager.name}
              show={selectedManagers[manager.name]}
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
                  key={manager.name}
                  name={"Manager"}
                  title={manager.name}
                  headerLink={`/customer-service/daily-metrics/manager/${manager.name}`}
                  subordinateTitle="Supervisors"
                  subordinateLink="/customer-service/daily-metrics/supervisor"
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
