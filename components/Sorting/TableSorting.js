import { useState, useRef, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useDropdown } from "@/hooks/useDropdown";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import { useFilters } from "@/components/Sorting/Filters/Hooks/useFilters";
import DateFilterDropdown from "@/components/Sorting/DateFilters/DateFilterDropdown";
import FiltersDropdown from "@/components/Sorting/Filters/FiltersDropdown";
import ActiveFilters from "@/components/Sorting/Filters/ActiveFilters/ActiveFilters";

export default function TableSorting({
  activeFilters,
  handleDateRangeSelect,
  filterOptions,
  handleFilterChange,
  removeFilter,
  selectedVisibilityOption,
  setSelectedVisibilityOption,
  handleDisplayOptionChange,
  displayOptions,
  handleTableVisibilityChange,
  tableVisibilityOptions,
  agentTableVisibilityOptions,
  allColumns,
  handleColumnVisibilityChange,
  columnVisibility,
  activeTab,
  allTeamData,
}) {
  const containerRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const filtersDropdownRef = useRef(null);
  const { openDropdown, toggleDropdown } = useDropdown();
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
  const [filterToEdit, setFilterToEdit] = useState(null);
  const { categoryRefs } = useFilters(openDropdown === "filters", filterToEdit);

  const saveRange = () => {
    if (handleDateRangeSelect) {
      handleDateRangeSelect({ from: fromDate, to: toDate });
    }
    toggleDropdown(null);
  };
  const clearRange = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedDateRange(null);
  };

  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const isDateFilterOpen = openDropdown === "date";
  const isFilterOpen = openDropdown === "filters";

  const managerList = useMemo(() => {
    const uniqueManagers = [...new Set(allTeamData.map((d) => d.manager))];
    return uniqueManagers.map((m) => ({ value: m, label: m }));
  }, [allTeamData]);

  const filteredByManagers = useMemo(() => {
    const selectedManagers = activeFilters
      .filter((f) => f.type === "Manager")
      .map((f) => f.label);

    if (selectedManagers.length === 0) {
      return allTeamData;
    }
    return allTeamData.filter((row) => selectedManagers.includes(row.manager));
  }, [allTeamData, activeFilters]);

  const supervisorList = useMemo(() => {
    const uniqueSupervisors = [
      ...new Set(filteredByManagers.map((d) => d.supervisor)),
    ];
    return uniqueSupervisors.map((s) => ({ value: s, label: s }));
  }, [filteredByManagers]);

  const filteredByManagersAndSupervisors = useMemo(() => {
    const selectedSupervisors = activeFilters
      .filter((f) => f.type === "Supervisor")
      .map((f) => f.label);

    if (selectedSupervisors.length === 0) {
      return filteredByManagers;
    }

    return filteredByManagers.filter((row) =>
      selectedSupervisors.includes(row.supervisor)
    );
  }, [filteredByManagers, activeFilters]);

  const agentList = useMemo(() => {
    const uniqueAgents = [
      ...new Set(filteredByManagersAndSupervisors.map((d) => d.agent)),
    ];
    return uniqueAgents.map((a) => ({ value: a, label: a }));
  }, [filteredByManagersAndSupervisors]);

  const dynamicFilterOptions = [
    {
      id: "managerFilter",
      name: "Manager",

      options: managerList.map((mgr) => ({
        type: "Manager",
        value: mgr.value,
        label: mgr.label,
      })),
    },
    {
      id: "supervisorFilter",
      name: "Supervisor",
      options: supervisorList.map((sup) => ({
        type: "Supervisor",
        value: sup.value,
        label: sup.label,
      })),
    },
    {
      id: "agentFilter",
      name: "Agent",
      options: agentList.map((agt) => ({
        type: "Agent",
        value: agt.value,
        label: agt.label,
      })),
    },
  ];

  return (
    <div className="bg-lovesWhite dark:bg-darkBg  px-4  lg:px-8">
      {activeTab != "detail" ? (
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only ">
            Filters
          </h2>
          <div className="bg-lovesWhite dark:bg-darkCompBg pb-4 mt-4 border-t-darkBorder shadow shadow-lovesBlack rounded-t-lg dark:shadow-darkBorder dark:border-b dark:border-darkBorder">
            <div
              ref={containerRef}
              className="mx-auto flex max-w-full items-center space-x-4 px-4 sm:px-6 lg:px-8 pt-3"
            >
              <button
                onClick={() => toggleDropdown("date")}
                className="group inline-flex justify-center items-center text-md font-futura-bold  text-lovesBlack dark:text-darkPrimaryText hover:text-lovesBlack dark:hover:text-darkPrimaryText"
              >
                Date
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 h-5 w-5 shrink-0 text-lovesBlack  group-hover:text-lovesBlack dark:group-hover:text-darkPrimaryText dark:text-darkPrimaryText dark:hover:text-darkPrimaryText"
                />
              </button>
              <button
                onClick={() => toggleDropdown("filters")}
                className="group inline-flex justify-center items-center text-md font-futura-bold text-lovesBlack hover:text-lovesBlack dark:text-darkPrimaryText dark:hover:text-darkPrimaryText"
              >
                Filters
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 h-5 w-5 shrink-0 text-lovesBlack  group-hover:text-lovesBlack dark:group-hover:text-darkPrimaryText dark:text-darkPrimaryText"
                />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only ">
            Filters
          </h2>
          <div className="bg-lovesWhite dark:bg-darkCompBg pb-4 mt-4 border-t-darkBorder shadow shadow-lovesBlack rounded-t-lg dark:shadow-darkBorder dark:border-b dark:border-darkBorder">
            <div className="mx-auto flex max-w-full items-center space-x-4 px-4 sm:px-6 lg:px-8 pt-3">
              <p className="font-futura-bold dark:text-darkPrimaryText">
                Select Filters Below
              </p>
            </div>
          </div>
        </section>
      )}
      <div className="bg-lovesWhite dark:bg-darkCompBg dark:shadow-md dark:shadow-darkBorder">
        <DateFilterDropdown
          isOpen={isDateFilterOpen}
          dateDropdownRef={dateDropdownRef}
          onDateRangeSelect={handleDateRangeSelect}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          navigateMonth={navigateMonth}
          handleDateSelect={handleDateSelect}
          clearRange={clearRange}
          saveRange={saveRange}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          activeTab={activeTab}
        />
        <FiltersDropdown
          isOpen={isFilterOpen}
          filtersDropdownRef={filtersDropdownRef}
          activeFilters={activeFilters}
          handleFilterChange={handleFilterChange}
          filterOptions={dynamicFilterOptions}
          categoryRefs={categoryRefs}
          filterToEdit={filterToEdit}
          tableVisibilityOptions={tableVisibilityOptions}
          agentTableVisibilityOptions={agentTableVisibilityOptions}
          selectedVisibilityOption={selectedVisibilityOption}
          setSelectedVisibilityOption={setSelectedVisibilityOption}
          handleDisplayOptionChange={handleDisplayOptionChange}
          displayOptions={displayOptions}
          handleTableVisibilityChange={handleTableVisibilityChange}
          allColumns={allColumns}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
          columnVisibility={columnVisibility}
          activeTab={activeTab}
          allTeamData={allTeamData}
        />
      </div>
      <ActiveFilters
        activeFilters={activeFilters}
        setOpenDropdown={toggleDropdown}
        setFilterToEdit={setFilterToEdit}
        removeFilter={removeFilter}
        allColumns={allColumns}
      />
    </div>
  );
}
