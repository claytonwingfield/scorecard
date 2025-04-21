"use client";
import React, { useMemo, useState, Fragment } from "react";
import Header from "@/components/Navigation/header";
import DashboardSection from "@/components/Dashboard/DashboardSection";
import {
  customerServiceAverageScore,
  customerServiceAHT,
  qualityInfo,
  customerServiceAdherence,
  allTeamData,
} from "@/data/customerServiceData";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import { Transition } from "@headlessui/react";
import {
  fakeAHTData,
  fakeAdherenceData,
  fakeQualityData,
  fakeMtdScoreData,
} from "@/data/fakeMetricsData";
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
const departmentOptions = [
  { label: "Customer Service", value: "Customer Service" },
  { label: "Help Desk", value: "Help Desk" },
  { label: "Electronic Dispatch", value: "Electronic Dispatch" },
  { label: "Written Communication", value: "Written Communication" },
  { label: "Resolutions", value: "Resolutions" },
];

const CustomerServiceSection = () => {
  const avgScore = useMemo(() => {
    const scores = customerServiceAverageScore.map((item) =>
      parseFloat(item.mtdScore.replace("%", ""))
    );
    const total = scores.reduce((acc, s) => acc + s, 0);
    const avg = total / scores.length;
    return avg.toFixed(2) + "%";
  }, []);

  const avgAdherence = useMemo(() => {
    const adherencePercentages = customerServiceAdherence.map((item) =>
      parseFloat(item.qualityTeam.replace("%", ""))
    );
    const total = adherencePercentages.reduce((acc, a) => acc + a, 0);
    const avg = total / adherencePercentages.length;
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

  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: avgAHT },
    { id: 2, name: "Adherence", stat: avgAdherence },
    { id: 3, name: "Quality", stat: avgQuality },
    { id: 4, name: "Average Score", stat: avgScore },
  ];

  const customerServiceManagers = Array.from(
    new Set(allTeamData.map((item) => item.manager))
  ).map((managerName) => ({ name: managerName }));

  const averagePercentageForManager = (dataArray, key, managerName) => {
    const filtered = dataArray.filter((item) => item.manager === managerName);
    if (filtered.length === 0) return "N/A";
    const sum = filtered.reduce(
      (acc, cur) => acc + parseFloat(cur[key].replace("%", "")),
      0
    );
    const avg = sum / filtered.length;
    return avg.toFixed(2) + "%";
  };

  const averageAHTForManager = (dataArray, managerName) => {
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
  };

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

  const subordinateStats = computedCustomerServiceManagerStats.map(
    (manager) => ({
      name: manager.name,
      metrics: Object.entries(manager)
        .filter(([key]) => key !== "name")
        .map(([key, value]) => ({
          id: `${manager.name}-${key}`,
          name: key,
          stat: value,
        })),
    })
  );

  return (
    <DashboardSection
      name="Department"
      title="Customer Service"
      headerLink="/customer-service/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/customer-service/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
    />
  );
};

const HelpDeskSection = () => {
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "05:45" },
    { id: 2, name: "Adherence", stat: "92%" },
    { id: 3, name: "Quality", stat: "93%" },
    { id: 4, name: "Average Score", stat: "95%" },
  ];

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

  const subordinateStats = helpDeskManagerStats.map((manager) => ({
    name: manager.name,
    metrics: Object.entries(manager)
      .filter(([key]) => key !== "name")
      .map(([key, value]) => ({
        id: `${manager.name}-${key}`,
        name: key,
        stat: value,
      })),
  }));

  return (
    <DashboardSection
      title="Help Desk"
      name="Department"
      headerLink="/help-desk/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/help-desk/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
    />
  );
};

const ElectronicDispatchSection = () => {
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "06:00" },
    { id: 2, name: "Adherence", stat: "90%" },
    { id: 3, name: "Quality", stat: "92%" },
    { id: 4, name: "Average Score", stat: "94%" },
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

  const subordinateStats = electronicDispatchManagerStats.map((manager) => ({
    name: manager.name,
    metrics: Object.entries(manager)
      .filter(([key]) => key !== "name")
      .map(([key, value]) => ({
        id: `${manager.name}-${key}`,
        name: key,
        stat: value,
      })),
  }));

  return (
    <DashboardSection
      title="Electronic Dispatch"
      name="Department"
      headerLink="/electronic-dispatch/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/electronic-dispatch/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
    />
  );
};

const WrittenCommunicationSection = () => {
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "05:50" },
    { id: 2, name: "Adherence", stat: "91%" },
    { id: 3, name: "Quality", stat: "90%" },
    { id: 4, name: "Average Score", stat: "93%" },
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

  const subordinateStats = writtenCommunicationManagerStats.map((manager) => ({
    name: manager.name,
    metrics: Object.entries(manager)
      .filter(([key]) => key !== "name")
      .map(([key, value]) => ({
        id: `${manager.name}-${key}`,
        name: key,
        stat: value,
      })),
  }));

  return (
    <DashboardSection
      title="Written Communication"
      name="Department"
      headerLink="/written-communication/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/written-communication/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
    />
  );
};

const ResolutionsSection = () => {
  const parentStats = [
    { id: 1, name: "Average Handle Time", stat: "06:10" },
    { id: 2, name: "Adherence", stat: "89%" },
    { id: 3, name: "Quality", stat: "91%" },
    { id: 4, name: "Average Score", stat: "92%" },
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

  const subordinateStats = resolutionsManagerStats.map((manager) => ({
    name: manager.name,
    metrics: Object.entries(manager)
      .filter(([key]) => key !== "name")
      .map(([key, value]) => ({
        id: `${manager.name}-${key}`,
        name: key,
        stat: value,
      })),
  }));

  return (
    <DashboardSection
      title="Resolutions"
      name="Department"
      headerLink="/resolutions/daily-metrics"
      subordinateTitle="Managers"
      subordinateLink="/resolutions/daily-metrics/manager"
      parentStats={parentStats}
      subordinateStats={subordinateStats}
      chartDataMap={fakeDataMap}
      metricMap={metricMap}
      initialActiveMetric="Average Handle Time"
      agent={false}
    />
  );
};

export default function OklahomaCity() {
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
  const [selectedDepartments, setSelectedDepartments] = useState(() =>
    departmentOptions.reduce((acc, opt) => {
      acc[opt.value] = true;
      return acc;
    }, {})
  );
  const departmentSections = [
    { key: "Customer Service", Component: CustomerServiceSection },
    { key: "Help Desk", Component: HelpDeskSection },
    { key: "Electronic Dispatch", Component: ElectronicDispatchSection },
    { key: "Written Communication", Component: WrittenCommunicationSection },
    { key: "Resolutions", Component: ResolutionsSection },
  ];
  return (
    <div className="bg-lovesWhite dark:bg-darkBg min-h-screen">
      <Header />
      <div className="px-6 sm:px-6 lg:px-8 mt-4 flex items-center justify-between">
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
          name="Department"
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          filterOptions={departmentOptions}
          selectedFilters={selectedDepartments}
          setSelectedFilters={setSelectedDepartments}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-8 mt-4 space-y-8">
        {departmentSections.map(({ Component, key }, idx) => (
          <Transition
            key={key}
            show={selectedDepartments[key]}
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
              <Component />
            </Transition.Child>
          </Transition>
        ))}
      </div>
    </div>
  );
}
