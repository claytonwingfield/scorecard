"use client";
import React from "react";
import DashboardSection from "@/components/Dashboard/Hierarchy/DashboardSection";

// --- Generic Department Section Creator ---
const createDepartmentSection = (
  defaultDeptName,
  metricsPath,
  supervisorPath
) => {
  const DepartmentSectionComponent = ({ departmentData }) => {
    // Fallback logic
    const data = departmentData || {
      name: defaultDeptName,
      parentStats: [
        /* ... N/A stats ... */
      ],
      subordinateStats: [],
      dailyChartData: {
        // Add fallback for chart data
        "Average Handle Time": [],
        Adherence: [],
        Quality: [],
        "Average Score": [],
      },
    };

    const parentStatsArray = Array.isArray(data.parentStats)
      ? data.parentStats
      : [];
    const subordinateStatsArray = Array.isArray(data.subordinateStats)
      ? data.subordinateStats
      : [];
    // Get dailyChartData (with fallback)
    const dailyChartData = data.dailyChartData || {
      "Average Handle Time": [],
      Adherence: [],
      Quality: [],
      "Average Score": [],
    };

    return (
      <DashboardSection
        name="Department"
        title={data.name}
        headerLink={metricsPath}
        subordinateTitle="Supervisors"
        subordinateLink={supervisorPath}
        parentStats={parentStatsArray}
        subordinateStats={subordinateStatsArray}
        // *** Pass REAL daily chart data ***
        realChartData={dailyChartData}
      />
    );
  };
  DepartmentSectionComponent.displayName = `${defaultDeptName.replace(
    / /g,
    ""
  )}Section`;
  return DepartmentSectionComponent;
};

// --- Exporting Specific Sections ---

export const CustomerServiceSection = createDepartmentSection(
  "Customer Service",
  "/customer-service/daily-metrics",
  "/customer-service/daily-metrics/supervisor"
);

export const HelpDeskSection = createDepartmentSection(
  "Help Desk",
  "/help-desk/daily-metrics",
  "/help-desk/daily-metrics/supervisor" // Assuming this path exists
);

export const ElectronicDispatchSection = createDepartmentSection(
  "Electronic Dispatch",
  "/electronic-dispatch/daily-metrics",
  "/electronic-dispatch/daily-metrics/supervisor" // Assuming this path exists
);

export const WrittenCommunicationSection = createDepartmentSection(
  "Written Communication",
  "/written-communication/daily-metrics",
  "/written-communication/daily-metrics/supervisor" // Assuming this path exists
);

export const ResolutionsSection = createDepartmentSection(
  "Resolutions",
  "/resolutions/daily-metrics",
  "/resolutions/daily-metrics/supervisor" // Assuming this path exists
);
