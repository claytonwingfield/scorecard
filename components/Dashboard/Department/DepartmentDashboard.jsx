// Dashboard/Department/DepartmentDashboard.jsx
"use client";
import React, { useState, Fragment, useMemo, useEffect, useRef } from "react"; // Added useRef
import Header from "@/components/Navigation/header";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange"; // Ensure this path is correct
import { Transition } from "@headlessui/react";
import { useQuery } from "@apollo/client";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";

// --- Helper Functions ---
const isValidDate = (d) => d instanceof Date && !isNaN(d); // Added isValidDate helper

function formatSecondsToMMSS(totalSeconds) {
  if (isNaN(totalSeconds) || !isFinite(totalSeconds) || totalSeconds <= 0)
    return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes.toString().padStart(2, "0")}:${seconds}`;
}
function parseMetric(value) {
  if (typeof value === "number" && isFinite(value)) return value;
  if (typeof value === "string") {
    const cleanedValue = value.replace("%", "").trim();
    if (cleanedValue === "") return null;
    const parsed = parseFloat(cleanedValue);
    return isNaN(parsed) || !isFinite(parsed) ? null : parsed;
  }
  return null;
}
function parseDateString(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      ) {
        return new Date(Date.UTC(year, month - 1, day));
      } else {
        console.error(`Invalid date components: ${dateStr}`);
        return null;
      }
    } else {
      console.error(`Invalid date format: ${dateStr}`);
      return null;
    }
  } catch (e) {
    console.error(`Error parsing date: ${dateStr}`, e);
  }
  return null;
}
function calculateAHT(staffList, startDateStr, endDateStr) {
  let totalSeconds = 0;
  let validEntries = 0;
  const startDate = parseDateString(startDateStr);
  const endDate = parseDateString(endDateStr);
  if (!startDate || !endDate) return "N/A";
  staffList.forEach((staff) => {
    (staff.webexes || []).forEach((webex) => {
      const metricValue = parseMetric(
        webex.average_inbound_handle_time_seconds
      );
      const recordDate = parseDateString(webex.date);
      if (
        metricValue !== null &&
        recordDate &&
        recordDate >= startDate &&
        recordDate <= endDate
      ) {
        totalSeconds += metricValue;
        validEntries++;
      }
    });
  });
  return validEntries > 0
    ? formatSecondsToMMSS(totalSeconds / validEntries)
    : "N/A";
}
function calculateAdherence(staffList, startDateStr, endDateStr) {
  let totalAdherence = 0;
  let validEntries = 0;
  const startDate = parseDateString(startDateStr);
  const endDate = parseDateString(endDateStr);
  if (!startDate || !endDate) return "N/A";
  staffList.forEach((staff) => {
    (staff.wfms || []).forEach((wfm) => {
      const metricValue = parseMetric(wfm.adherence);
      const recordDate = parseDateString(wfm.date);
      if (
        metricValue !== null &&
        recordDate &&
        recordDate >= startDate &&
        recordDate <= endDate
      ) {
        totalAdherence += metricValue;
        validEntries++;
      }
    });
  });
  return validEntries > 0
    ? (totalAdherence / validEntries).toFixed(2) + "%"
    : "N/A";
}
function calculateQuality(staffList, startDateStr, endDateStr) {
  let totalScore = 0;
  let validEntries = 0;
  const startDate = parseDateString(startDateStr);
  const endDate = parseDateString(endDateStr);
  if (!startDate || !endDate) return "N/A";
  staffList.forEach((staff) => {
    (staff.qualities || []).forEach((quality) => {
      const metricValue = parseMetric(quality.totalscore);
      const recordDate = parseDateString(quality.date);
      if (
        metricValue !== null &&
        recordDate &&
        recordDate >= startDate &&
        recordDate <= endDate
      ) {
        totalScore += metricValue;
        validEntries++;
      }
    });
  });
  return validEntries > 0
    ? (totalScore / validEntries).toFixed(2) + "%"
    : "N/A";
}
function calculateDailyAverages(staffList, startDateStr, endDateStr) {
  const dailyData = {
    "Average Handle Time": [],
    Adherence: [],
    Quality: [],
    "Average Score": [],
  };
  const startDate = parseDateString(startDateStr);
  const endDate = parseDateString(endDateStr);
  if (!startDate || !endDate) {
    return dailyData;
  }
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const currentDayStr = currentDate.toISOString().split("T")[0];
    const displayDate = `${
      currentDate.getUTCMonth() + 1
    }/${currentDate.getUTCDate()}`;
    let dailyTotalAHT = 0,
      dailyAHTCount = 0;
    let dailyTotalAdherence = 0,
      dailyAdherenceCount = 0;
    let dailyTotalQuality = 0,
      dailyQualityCount = 0;
    staffList.forEach((staff) => {
      (staff.webexes || []).forEach((webex) => {
        if (webex.date === currentDayStr) {
          const val = parseMetric(webex.average_inbound_handle_time_seconds);
          if (val !== null) {
            dailyTotalAHT += val;
            dailyAHTCount++;
          }
        }
      });
      (staff.wfms || []).forEach((wfm) => {
        if (wfm.date === currentDayStr) {
          const val = parseMetric(wfm.adherence);
          if (val !== null) {
            dailyTotalAdherence += val;
            dailyAdherenceCount++;
          }
        }
      });
      (staff.qualities || []).forEach((quality) => {
        if (quality.date === currentDayStr) {
          const val = parseMetric(quality.totalscore);
          if (val !== null) {
            dailyTotalQuality += val;
            dailyQualityCount++;
          }
        }
      });
    });
    dailyData["Average Handle Time"].push({
      date: displayDate,
      value: dailyAHTCount > 0 ? dailyTotalAHT / dailyAHTCount / 60 : null,
    });
    dailyData["Adherence"].push({
      date: displayDate,
      value:
        dailyAdherenceCount > 0
          ? dailyTotalAdherence / dailyAdherenceCount
          : null,
    });
    dailyData["Quality"].push({
      date: displayDate,
      value:
        dailyQualityCount > 0 ? dailyTotalQuality / dailyQualityCount : null,
    });
    dailyData["Average Score"].push({ date: displayDate, value: null });
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dailyData;
}
// --- End Helper Functions ---

export default function DashboardPage({
  departmentSectionsConfig,
  departmentOptions,
  query,
}) {
  // Date State - Include ALL needed values from the hook
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    currentDate,
    setCurrentDate,
    navigateMonth,
  } = useDateRange();
  const toYYYYMMDD = (d) => (d ? d.toISOString().split("T")[0] : null);
  const startDateStr = useMemo(() => toYYYYMMDD(fromDate), [fromDate]);
  const endDateStr = useMemo(() => toYYYYMMDD(toDate), [toDate]);

  // Fetch Data
  const { data: rawData, loading: queryLoading, error } = useQuery(query);

  // Filter States
  const [selectedDateRange, setSelectedDateRange] = useState("MTD"); // Default to MTD label
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(() =>
    (departmentOptions || []).reduce(
      (acc, opt) => ({ ...acc, [opt.value]: true }),
      {}
    )
  );

  // *** State for DISPLAYED data ***
  const [displayedDataMap, setDisplayedDataMap] = useState(() => new Map());
  // Ref to track if initial load calculation is done
  const initialCalculationDone = useRef(false);

  // Process Data Memo
  const processedDepartmentData = useMemo(() => {
    // Return null if still loading, error, dates invalid, or NO DATES YET SELECTED
    if (
      queryLoading ||
      error ||
      !rawData?.staffs ||
      !startDateStr ||
      !endDateStr
    ) {
      return null; // Indicate data isn't ready for calculation
    }

    // console.log(`useMemo: Processing data for range: ${startDateStr} to ${endDateStr}`);

    const departmentsMap = new Map();
    // Initialize map from config
    departmentSectionsConfig.forEach((config) => {
      departmentsMap.set(config.key, {
        name: config.key,
        staff: [],
        supervisors: new Map(),
        calculatedData: {
          name: config.key,
          parentStats: [],
          subordinateStats: [],
          dailyChartData: {},
        },
      });
    });

    // Group raw staff data
    rawData.staffs.forEach((staff) => {
      if (
        !staff.department ||
        !staff.teamname ||
        !departmentsMap.has(staff.department)
      )
        return;

      const dept = departmentsMap.get(staff.department);
      dept.staff.push(staff);

      if (!dept.supervisors.has(staff.teamname)) {
        dept.supervisors.set(staff.teamname, {
          name: staff.teamname,
          staff: [],
        });
      }
      dept.supervisors.get(staff.teamname).staff.push(staff);
    });

    // Calculate stats for each department
    departmentsMap.forEach((dept) => {
      if (dept.staff.length > 0) {
        dept.calculatedData.name = dept.name; // Ensure name is set

        dept.calculatedData.parentStats = [
          {
            id: `${dept.name}-1`,
            name: "Average Handle Time",
            stat: calculateAHT(dept.staff, startDateStr, endDateStr),
          },
          {
            id: `${dept.name}-2`,
            name: "Adherence",
            stat: calculateAdherence(dept.staff, startDateStr, endDateStr),
          },
          {
            id: `${dept.name}-3`,
            name: "Quality",
            stat: calculateQuality(dept.staff, startDateStr, endDateStr),
          },
          { id: `${dept.name}-4`, name: "Average Score", stat: "N/A" },
        ];

        dept.calculatedData.subordinateStats = Array.from(
          dept.supervisors.values()
        ).map((sup) => ({
          name: sup.name,
          metrics: [
            {
              id: `${sup.name}-aht`,
              name: "Average Handle Time",
              stat: calculateAHT(sup.staff, startDateStr, endDateStr),
            },
            {
              id: `${sup.name}-adh`,
              name: "Adherence",
              stat: calculateAdherence(sup.staff, startDateStr, endDateStr),
            },
            {
              id: `${sup.name}-qual`,
              name: "Quality",
              stat: calculateQuality(sup.staff, startDateStr, endDateStr),
            },
            { id: `${sup.name}-score`, name: "Average Score", stat: "N/A" },
          ],
        }));

        dept.calculatedData.dailyChartData = calculateDailyAverages(
          dept.staff,
          startDateStr,
          endDateStr
        );
      } else {
        // Ensure structure exists even for empty departments
        dept.calculatedData = {
          name: dept.name,
          parentStats: [],
          subordinateStats: [],
          dailyChartData: {},
        };
      }
    });

    // console.log("useMemo: Finished Processing. Result:", departmentsMap);
    return departmentsMap;
  }, [
    queryLoading,
    error,
    rawData,
    departmentSectionsConfig,
    startDateStr,
    endDateStr,
  ]);

  // *** Effect to update DISPLAYED data ***
  useEffect(() => {
    if (processedDepartmentData && startDateStr && endDateStr) {
      // console.log("useEffect: Updating displayedDataMap");
      setDisplayedDataMap(processedDepartmentData);
      if (!initialCalculationDone.current) {
        initialCalculationDone.current = true; // Mark initial calculation as done only once
      }
    } else if (!startDateStr || !endDateStr) {
      // console.log("useEffect: Dates incomplete, keeping previous displayed data.");
    } else if (!processedDepartmentData && !queryLoading && !error) {
      // console.log("useEffect: No processed data (but not loading/error), keeping previous display.");
    }
  }, [processedDepartmentData, startDateStr, endDateStr, queryLoading, error]);

  // Loading/Error UI - Only show loading initially
  if (queryLoading && !initialCalculationDone.current)
    return <LoadingAnimation />;
  if (error) return <p>Error loading dashboard data: {error.message}</p>;

  // Render Dashboard
  return (
    <div className="bg-lovesWhite dark:bg-darkBg min-h-screen">
      <Header />

      {/* Date Range Display & Filter Toggle */}
      <div className="px-6 sm:px-6 lg:px-8 mt-4 flex items-center justify-between">
        <div
          className="text-lovesBlack dark:text-darkPrimaryText dark:bg-darkCompBg font-futura-bold border border-lightGray shadow-sm shadow-lovesBlack dark:border-darkBorder rounded-lg lg:px-1 px-1 py-1 cursor-pointer bg-lightGray"
          onClick={() => setShowCalendar(true)}
        >
          {/* Display dates from state, ensure validity */}
          {isValidDate(fromDate) && isValidDate(toDate)
            ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
            : "Select Date Range"}
        </div>

        <FilterCalendarToggle
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          currentDate={currentDate} // Pass currentDate for calendar view
          setCurrentDate={setCurrentDate} // Pass setter for calendar view
          navigateMonth={navigateMonth} // Pass navigateMonth for calendar view
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          filterOptions={departmentOptions || []}
          selectedFilters={selectedDepartments}
          setSelectedFilters={setSelectedDepartments}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      {/* Department Sections */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4 space-y-8">
        {/* ** Iterate using displayedDataMap ** */}
        {(departmentSectionsConfig || []).map(({ key, Component }, idx) => {
          // *** Get data from DISPLAYED state ***
          const displayDeptData = displayedDataMap.get(key)?.calculatedData;

          // Don't render if no data has ever been calculated and it's not the initial load
          if (!displayDeptData && initialCalculationDone.current) {
            console.warn(
              `No display data found for key: ${key} after initial load.`
            );
            return null;
          }
          // If it's initial load and no display data yet, but processed data exists, use that immediately
          const initialData =
            !displayDeptData &&
            !initialCalculationDone.current &&
            processedDepartmentData?.get(key)?.calculatedData;

          return (
            <Transition
              key={key}
              show={selectedDepartments[key] === true}
              appear={initialCalculationDone.current} // Only appear animate after initial load
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Transition.Child
                as="div"
                enter="transform"
                enterFrom="translate-y-4"
                enterTo="translate-y-0"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <Component
                  key={`${key}-component`}
                  // Use initialData on first render if displayData isn't ready, otherwise use displayData
                  departmentData={initialData || displayDeptData}
                />
              </Transition.Child>
            </Transition>
          );
        })}
      </div>
    </div>
  );
}
