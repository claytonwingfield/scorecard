"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import TableSorting from "@/components/Sorting/TableSorting";
import SearchBox from "@/components/Sorting/Search/SearchBox";
import LayoutOptions from "@/components/Sorting/Layout/LayoutOptions";
import LayoutOptionsAgent from "@/components/Sorting/Layout/LayoutOptionsAgent";
import TabNavigation from "@/components/Navigation/tabNavigation";
import ColumnVisibility from "@/components/Sorting/ColumnVisibility/ColumnVisibility";
import useLayoutHandlers from "@/components/Sorting/Layout/Hooks/useLayoutHandlers";
import useDisplayOptions from "@/components/Sorting/Filters/Hooks/useDisplayOptions";
import useHiddenTables from "@/components/Sorting/Filters/Hooks/useHiddenTables";
import useSearchSelect from "@/components/Sorting/Search/Hooks/useSearchSelect";
import useOverviewLayout from "@/components/Sorting/Layout/Hooks/useOverviewLayout";
import useAgentLayout from "@/components/Sorting/Layout/Hooks/useAgentLayout";
import useColumnVisibility from "@/components/Sorting/ColumnVisibility/Hooks/useColumnVisibility";
import useTableVisibilityChange from "@/components/Sorting/Filters/Hooks/useTableVisibilityChange";
import useDisplayOptionChange from "@/components/Sorting/Filters/Hooks/useDisplayOptionChange";
import useFilterChange from "@/components/Sorting/Filters/Hooks/useFilterChange";
import useRemoveFilter from "@/components/Sorting/Filters/Hooks/useRemoveFilter";
import useDateRangeSelect from "@/components/Sorting/DateFilters/Hooks/useDateRangeSelect";
import useLayoutChange from "@/components/Tables/Layouts/Hooks/useLayoutChange";
import useGetTableData from "@/components/Tables/Hooks/useGetTableData";
import useRenderTable from "@/components/Tables/Hooks/useRenderTable";
import useRenderTablesList from "@/components/Tables/Hooks/useRenderTablesList";
import useDisableResizableTables from "@/components/Tables/Hooks/useDisableResizableTables";
import useLocalStorageLayouts from "@/components/Tables/Layouts/Hooks/useLocalStorageLayouts";
import useInitializeFilterOptions from "@/components/Sorting/Filters/Hooks/useInitializeFilterOptions";
import useSyncHiddenTables from "@/components/Sorting/Filters/Hooks/useSyncHiddenTables";
import useIsMobile from "@/hooks/useIsMobile";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DetailHomeFilters from "./Sorting/Detail/DetailHomeFilters";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import DetailModel from "./Sorting/Detail/DetailModel";
import OverviewTableWrapper from "@/components/Tables/Layouts/Overview/OverviewTableWrapper ";
import TeamTableWrapper from "@/components/Tables/Layouts/Agent/TeamTableWrapper";
import { useData } from "@/context/DataContext";
import { performSearch } from "@/components/Sorting/Search/Hooks/searchUtils";
import Header from "./Navigation/header";
export default function MetricsDashboard({
  dataSets,
  tableVisibilityOptions,
  agentTableVisibilityOptions,
  columnVisibilityOptions,
  agentColumnVisibilityOptions,
  tableColumns,
  allColumns,
  agentColumns,
  overviewColumns,
  combinedRegistry,
  overviewTables,
  agentTables,
  chart_layout,
  overviewLayout,
  agentLayout,
  allTeamData,
}) {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [originalLayout, setOriginalLayout] = useState(null);
  const chartLayout = useMemo(() => chart_layout, [chart_layout]);
  const [fullLayout, setFullLayout] = useState(overviewLayout);
  const [fullAgentLayout, setFullAgentLayout] = useState(agentLayout);
  const { handleSearchSelect } = useSearchSelect(setActiveFilters);
  const [originalAgentLayout, setOriginalAgentLayout] = useState(null);
  const { handleDateRangeSelect } = useDateRangeSelect(setActiveFilters);
  const router = useRouter();
  const { managers } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const tableRefs = useRef({});
  const [selectedVisibilityOption, setSelectedVisibilityOption] = useState([
    "All",
  ]);
  const {
    currentDate,
    setCurrentDate,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    navigateMonth,
    handleDateSelect,
  } = useDateRange();
  const { displayOptions, setDisplayOptions, displayOptionLabels } =
    useDisplayOptions();
  const { hiddenTables, setHiddenTables, getHiddenTables } = useHiddenTables(
    selectedVisibilityOption
  );

  const visibleLayout = useOverviewLayout({
    originalLayout,
    hiddenTables,
    displayOptions,
    chartLayout,
  });

  const visibleAgentLayout = useAgentLayout({
    originalAgentLayout,
    hiddenTables,
    displayOptions,
    chartLayout,
  });

  const {
    columnVisibility,
    setColumnVisibility,
    handleColumnVisibilityChange,
    getHiddenColumns,
  } = useColumnVisibility({
    columnVisibilityOptions,
    tableColumns,
    overviewColumns,
    agentColumns,
    setActiveFilters,
  });

  const { handleTableVisibilityChange } = useTableVisibilityChange({
    activeTab,
    agentTableVisibilityOptions,
    tableVisibilityOptions,
    selectedVisibilityOption,
    setSelectedVisibilityOption,
    hiddenTables,
    setHiddenTables,
    activeFilters,
    setActiveFilters,
  });

  const { handleDisplayOptionChange } = useDisplayOptionChange({
    displayOptions,
    setDisplayOptions,
    displayOptionLabels,
    activeFilters,
    setActiveFilters,
  });

  const { handleFilterChange } = useFilterChange({
    activeFilters,
    setActiveFilters,
    allTeamData,
  });

  const { removeFilter } = useRemoveFilter({
    activeFilters,
    setActiveFilters,
    tableColumns,
    setColumnVisibility,
  });

  useLocalStorageLayouts(
    fullLayout,
    setFullLayout,
    fullAgentLayout,
    setFullAgentLayout
  );

  const isMobile = useIsMobile();

  useSyncHiddenTables(getHiddenTables, setHiddenTables);

  useInitializeFilterOptions({
    dataSets,
    tableVisibilityOptions,
    setActiveFilters,
    setFilterOptions,
  });

  const { getTableData } = useGetTableData({ dataSets });

  const { renderTable } = useRenderTable({
    hiddenTables,
    combinedRegistry,
    getTableData,
    getHiddenColumns,
    displayOptions,
    activeFilters,
  });

  const { renderTablesList } = useRenderTablesList({ renderTable });

  const { disableResizableTables } = useDisableResizableTables({
    setDisplayOptions,
    setActiveFilters,
    displayOptionLabels,
  });

  const {
    handleLayoutSelect,
    handleAgentLayoutSelect,
    handleRevertToDefault,
    handleRevertAgentToDefault,
  } = useLayoutHandlers({
    setFullLayout,
    setOriginalLayout,
    setFullAgentLayout,
    setOriginalAgentLayout,
    disableResizableTables,
    overviewLayout,
    agentLayout,
    fullLayout,
    fullAgentLayout,
    originalLayout,
    originalAgentLayout,
  });

  const { handleLayoutChange, handleSaveLayout } = useLayoutChange({
    displayOptions,
    activeTab,
    fullLayout,
    setFullLayout,
    setFullAgentLayout,
    disableResizableTables,
  });

  const [showModal, setShowModal] = useState(false);
  const [previousTab, setPreviousTab] = useState(activeTab);

  function hasCustomTimeFrame(filters) {
    // "Date Range" is the type, "MTD" is the default label
    return filters.some((f) => f.type === "Date Range" && f.label !== "MTD");
  }

  function hasManagerSupervisorAgent(filters) {
    // The 'type' field is exactly "Manager", "Supervisor" or "Agent"
    return filters.some((f) =>
      ["Manager", "Supervisor", "Agent"].includes(f.type)
    );
  }

  useEffect(() => {
    // Only run on tab changes
    if (activeTab !== previousTab) {
      if (
        activeTab === "detail" &&
        hasCustomTimeFrame(activeFilters) &&
        hasManagerSupervisorAgent(activeFilters)
      ) {
        setShowModal(true);
      }
    }
    setPreviousTab(activeTab); // update for next render
  }, [activeTab, activeFilters, previousTab]);

  const handleKeepFilters = () => {
    setIsLoading(true);
    handleSearch();
    setShowModal(false);
  };
  const handleClearFilters = () => {
    setActiveFilters((prevFilters) => {
      // 1. Remove Manager, Supervisor, Agent
      // 2. Remove any Date Range that is NOT MTD
      // 3. Keep everything else
      const cleanedFilters = prevFilters.filter((f) => {
        const isRoleFilter = ["Manager", "Supervisor", "Agent"].includes(
          f.type
        );
        const isDateRange = f.type === "Date Range";
        const isMTD = isDateRange && f.label === "MTD";

        // We want to KEEP the filter if:
        // - It's NOT a role filter
        // - If it's a date-range filter, it must be MTD
        // - Or it's some other type of filter we want to preserve
        return !isRoleFilter && (!isDateRange || isMTD);
      });

      // 4. If we have no Date Range filter at all, add MTD
      const hasMTD = cleanedFilters.some(
        (f) => f.type === "Date Range" && f.label === "MTD"
      );
      if (!hasMTD) {
        cleanedFilters.push({ type: "Date Range", label: "MTD" });
      }

      return cleanedFilters;
    });

    // Close the modal
    setShowModal(false);
  };

  // 4. Switch tabs
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };
  function dateToParam(date) {
    return date ? date.toISOString().split("T")[0] : undefined;
  }

  const handleSearch = () => {
    performSearch({
      activeFilters,
      fromDate,
      toDate,
      dataSets,
      allTeamData,
      router,
      setIsLoading,
    });
  };

  const handleMeasuredHeightChange = useCallback((tableName, newHeight) => {
    setMeasuredHeights((prev) => ({ ...prev, [tableName]: newHeight }));
  }, []);

  if (isLoading) {
    return (
      <>
        {/* <Header /> */}
        <LoadingAnimation />
      </>
    );
  }

  return (
    <div>
      <main>
        <div>
          <TableSorting
            handleFilterChange={handleFilterChange}
            activeFilters={activeFilters}
            handleDateRangeSelect={handleDateRangeSelect}
            filterOptions={filterOptions}
            removeFilter={removeFilter}
            displayOptions={displayOptions}
            tableVisibilityOptions={tableVisibilityOptions}
            agentTableVisibilityOptions={agentTableVisibilityOptions}
            selectedVisibilityOption={selectedVisibilityOption}
            setSelectedVisibilityOption={setSelectedVisibilityOption}
            handleDisplayOptionChange={handleDisplayOptionChange}
            handleTableVisibilityChange={handleTableVisibilityChange}
            allColumns={allColumns}
            columnVisibility={columnVisibility}
            handleColumnVisibilityChange={handleColumnVisibilityChange}
            activeTab={activeTab}
            allTeamData={allTeamData}
          />
        </div>
        <div>
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <Transition
          show={displayOptions.showSearchBar}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="mt-4">
            <SearchBox
              dataSets={dataSets}
              activeFilters={activeFilters}
              handleSearchSelect={handleSearchSelect}
            />
          </div>
        </Transition>
        <Transition
          show={displayOptions.showColumnVisibility}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="mt-8 lg:px-96 px-4">
            <ColumnVisibility
              allColumns={allColumns}
              activeTab={activeTab}
              columnVisibility={columnVisibility}
              overviewColumns={overviewColumns}
              agentColumns={agentColumns}
              agentColumnVisibilityOptions={agentColumnVisibilityOptions}
              handleColumnVisibilityChange={handleColumnVisibilityChange}
            />
          </div>
        </Transition>
        <Transition
          show={displayOptions.resizableTables}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="bg-lovesBlack  shadow-md shadow-lovesBlack  rounded-lg ml-8 mr-8 mt-4">
            {activeTab === "overview" && (
              <LayoutOptions
                onLayoutSelect={handleLayoutSelect}
                onRevertToDefault={handleRevertToDefault}
                onSaveLayout={handleSaveLayout}
              />
            )}
            {activeTab === "agent" && (
              <LayoutOptionsAgent
                onLayoutSelect={handleAgentLayoutSelect}
                onRevertToDefault={handleRevertAgentToDefault}
                onSaveLayout={handleSaveLayout}
              />
            )}
          </div>
        </Transition>
        <div className="mb-8">
          {activeTab === "overview" && (
            <>
              <ResponsiveGridLayout
                className="layout rounded lg:p-4"
                layouts={{ lg: visibleLayout }}
                breakpoints={{ lg: 1024, sm: 640 }}
                cols={{ lg: 2, sm: 1 }}
                rowHeight={50}
                margin={[16, 16]}
                autoSize={true}
                isDraggable={!isMobile && displayOptions.resizableTables}
                isResizable={!isMobile && displayOptions.resizableTables}
                compactType="vertical"
                preventCollision={isMobile}
                onLayoutChange={handleLayoutChange}
              >
                {renderTablesList(overviewTables)}
              </ResponsiveGridLayout>
            </>
          )}
          {activeTab === "agent" && (
            <>
              <ResponsiveGridLayout
                className="layout rounded lg:p-4"
                layouts={{ lg: visibleAgentLayout }}
                breakpoints={{ lg: 1024, sm: 640 }}
                cols={{ lg: 2, sm: 1 }}
                rowHeight={50}
                margin={[16, 16]}
                autoSize={true}
                isDraggable={!isMobile && displayOptions.resizableTables}
                isResizable={!isMobile && displayOptions.resizableTables}
                compactType="vertical"
                preventCollision={isMobile}
                onLayoutChange={handleLayoutChange}
              >
                {/* handleMeasuredHeightChange */}
                {renderTablesList(agentTables)}
              </ResponsiveGridLayout>
            </>
          )}

          <div className="bg-lovesWhite dark:bg-darkBg px-4 lg:px-8">
            {/* Modal */}
            {showModal && (
              <DetailModel
                onKeepFilters={handleKeepFilters}
                onClearFilters={handleClearFilters}
                handleSearch={handleSearch}
              />
            )}

            {/* Main Content */}
            {activeTab === "detail" && (
              <>
                <DetailHomeFilters
                  handleFilterChange={handleFilterChange}
                  activeFilters={activeFilters}
                  handleDateRangeSelect={handleDateRangeSelect}
                  filterOptions={filterOptions}
                  removeFilter={removeFilter}
                  displayOptions={displayOptions}
                  tableVisibilityOptions={tableVisibilityOptions}
                  agentTableVisibilityOptions={agentTableVisibilityOptions}
                  selectedVisibilityOption={selectedVisibilityOption}
                  setSelectedVisibilityOption={setSelectedVisibilityOption}
                  handleDisplayOptionChange={handleDisplayOptionChange}
                  handleTableVisibilityChange={handleTableVisibilityChange}
                  allColumns={allColumns}
                  columnVisibility={columnVisibility}
                  handleColumnVisibilityChange={handleColumnVisibilityChange}
                  activeTab={activeTab}
                  dataSets={dataSets}
                  allTeamData={allTeamData}
                  handleSearch={handleSearch}
                  fromDate={fromDate}
                  toDate={toDate}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  navigateMonth={navigateMonth}
                  handleDateSelect={handleDateSelect}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
