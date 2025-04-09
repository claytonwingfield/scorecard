"use client"; // Ensure this page is a client component if using Next.js 13+

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { defaultSort, upArrow, downArrow } from "@/components/Icons/icons";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/20/solid";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import Header from "@/components/Navigation/header";
import BarChart from "@/components/Charts/BarChart";
import LineChartTime from "@/components/Charts/LineChartTime";

import CompareBarChart from "@/components/Charts/CompareBarChart";
import CompareLineChart from "@/components/Charts/CompareLineChart";
import { allTeamData, customerServiceData } from "@/data/customerServiceData";

import bgCard from "@/public/animations/bgCard.json";
import award from "@/public/animations/award.json";
import down from "@/public/animations/down.json";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import CompareRed from "@/public/compare-red.svg";
import CompareYellow from "@/public/compare-yellow.svg";
import Change from "@/public/change.svg";
import dynamic from "next/dynamic";
import Calendar from "@/components/Sorting/DateFilters/Calendar";
import Image from "next/image";
import ManagerSelectionForm from "@/components/Sorting/Filters/ManagerSelectionForm";
import { qualityGoalTableConfig } from "@/components/Tables/CustomerService/Overview/QualityTable/qualityGoalTableConfig";
import OklahomaCity from "@/pages/dashboard/oklahoma-city";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function DetailMetricsPage({
  entityKey,
  entityLabel,
  SelectionFormComponent,
}) {
  const router = useRouter();
  // Query param name can also be dynamic if needed – for example, "manager" can be replaced with entityKey
  const { [entityKey]: currentEntity } = router.query;
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isEntityDropdownOpen, setIsEntityDropdownOpen] = useState(false);

  // The “allEntities” are generalized
  const allTeamData = customerServiceData.allTeamData;
  const allEntities = [...new Set(allTeamData.map((item) => item[entityKey]))];
  const dataSets = customerServiceData.dataSets;

  // Update options for selection based on entityKey and entityLabel
  const entityOptions = allEntities.map((entity) => ({
    label: entity,
    value: entity,
  }));

  // Generalize data filtering – replace .manager with row[entityKey]
  const filteredDataSets = dataSets.map((set) => ({
    ...set,
    data: set.data.filter((row) => row[entityKey] === currentEntity),
  }));
  const detailView = (
    <>
      <div className="lg:hidden">
        <nav aria-label="Breadcrumb">
          <ol className="flex space-x-4 rounded-md bg-lovesWhite dark:bg-darkCompBg px-4 py-1 shadow-sm">
            <li>
              <Link href={`/${entityLabel.toLowerCase()}/daily-metrics`}>
                <HomeIcon className="w-5 h-5" />
              </Link>
            </li>
            {/* additional breadcrumb logic */}
          </ol>
        </nav>
        <div className="flex items-center justify-center pt-4">
          <h1 className="text-xl font-futura-bold">
            {currentEntity || `Select a ${entityLabel}`}
          </h1>
        </div>
      </div>
      {/* The rest of your component (charts, tables, comparison logic, etc.) remains unchanged */}
    </>
  );

  // If no entity is selected, show your (now generalized) selection form component:
  if (!currentEntity) {
    return (
      <OklahomaCity
        allTeamData={allTeamData}
        dataSets={dataSets}
        entityLabel={entityLabel}
        entityKey={entityKey}
      />
    );
  }

  // ... All your chart configuration, stat cards, and table sorting logic
  // In places where you previously used "managers" or "supervisor", use "currentEntity"
  // or the provided entityKey. If grouping by is still needed, you can even provide an extra prop
  // like groupByField and make that adjustable.

  return (
    <div className="bg-lovesWhite dark:bg-darkBg">
      <Header />
      <div className="px-4 sm:px-2 lg:px-8 mt-4">
        {/* Render detailView and additional logic */}
        {detailView}
        {/* ... The rest of your detail view, charts, comparisons, tables */}
      </div>
    </div>
  );
}
