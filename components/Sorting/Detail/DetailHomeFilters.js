"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import {
  ChevronDownIcon,
  CheckIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import filterBackground from "@/public/animations/filterBackground.json";
import { useDropdown } from "@/hooks/useDropdown";
import { Disclosure } from "@headlessui/react";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import { useFilters } from "@/components/Sorting/Filters/Hooks/useFilters";
import DateFilterDropdown from "@/components/Sorting/DateFilters/DateFilterDropdown";
import FiltersDropdown from "@/components/Sorting/Filters/FiltersDropdown";
import ActiveFilters from "@/components/Sorting/Filters/ActiveFilters/ActiveFilters";
import { Transition, Listbox } from "@headlessui/react";
import Calendar from "@/components/Sorting/DateFilters/Calendar";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
export default function DetailHomeFilters({
  activeFilters,
  handleDateRangeSelect,
  fromDate,
  toDate,
  currentDate,
  setCurrentDate,
  setFromDate,
  setToDate,
  navigateMonth,
  handleDateSelect,
  handleFilterChange,
  dataSets,
  allTeamData,

  handleSearch,
}) {
  const containerRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const filtersDropdownRef = useRef(null);

  const { openDropdown, toggleDropdown } = useDropdown();

  const [filterToEdit, setFilterToEdit] = useState(null);
  const { categoryRefs } = useFilters(openDropdown === "filters", filterToEdit);

  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const saveRange = (close) => {
    if (handleDateRangeSelect) {
      handleDateRangeSelect({ from: fromDate, to: toDate });
    }
    close();
  };

  const clearRange = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedDateRange(null);
  };

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
  const canSubmit = activeFilters.length > 1;

  const formatActiveFilters = () => {
    const allowedTypes = ["Manager", "Supervisor", "Agent"];

    const selectedFilters = activeFilters.filter((filter) =>
      allowedTypes.includes(filter.type)
    );

    if (selectedFilters.length === 0) return "No Filters";

    return selectedFilters.map((filter, index) => (
      <span key={index}>
        {`${filter.type}: ${filter.label}`}
        <br />
      </span>
    ));
  };

  return (
    <section className="mt-2 py-4 relative">
      <div className="w-full max-w-full mx-auto flex justify-center items-center ">
        <div className="box flex flex-col md:flex-row justify-between items-start rounded-xl border bg-lovesWhite dark:bg-darkCompBg p-6 w-full max-w-7xl shadow-md shadow-lovesBlack dark:border-2 dark:border-darkBorder">
          <Disclosure defaultOpen>
            {({ open }) => (
              <div className="w-full md:w-1/2 lg:pr-12">
                <Disclosure.Button className="flex items-center justify-between w-full">
                  <h6 className="font-futura-bold text-lg text-lovesBlack dark:text-darkPrimaryText lg:mb-3 mb-1">
                    Filters
                  </h6>

                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } transition-transform duration-200 w-5 h-5 text-lovesBlack dark:text-darkPrimaryText`}
                  />
                </Disclosure.Button>

                <Transition
                  show={open}
                  enter="transition ease-in-out duration-[200ms]"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in-out duration-[200ms]"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Disclosure.Panel className="mt-2">
                    <hr className="h-px mb-4 bg-lovesBlack border-0 dark:bg-darkBorder" />
                    <div className="lg:space-y-6 space-y-2">
                      {dynamicFilterOptions.map((filterCategory) => (
                        <div
                          key={filterCategory.id}
                          ref={(el) =>
                            (categoryRefs.current[filterCategory.name] = el)
                          }
                        >
                          <h3 className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                            {filterCategory.name}
                          </h3>
                          <Listbox
                            value={activeFilters
                              .filter((f) => f.type === filterCategory.name)
                              .map((f) => f.label)}
                            onChange={(selectedValues) =>
                              handleFilterChange(
                                filterCategory.name,
                                selectedValues
                              )
                            }
                            multiple
                          >
                            <div className="mt-1 relative">
                              <Listbox.Button className="relative dark:bg-darkBg w-full py-2 pl-3 pr-10 text-left text-md font-futura bg-lovesWhite rounded-md cursor-default focus:outline-none border border-lovesGray dark:text-darkPrimaryText dark:border-2 dark:border-darkBorder">
                                <span className="block truncate text-lovesBlack dark:text-darkPrimaryText">
                                  {activeFilters
                                    .filter(
                                      (f) => f.type === filterCategory.name
                                    )
                                    .map((f) => f.label)
                                    .join(", ") ||
                                    `Select ${filterCategory.name}`}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <ChevronDownIcon
                                    className="h-5 w-5 text-lovesBlack dark:text-darkPrimaryText"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Listbox.Options className="absolute dark:bg-darkBg dark:border-2 dark:border-darkBorder mt-1 w-full bg-lovesWhite shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none z-50">
                                {filterCategory.options.map((option) => (
                                  <Listbox.Option
                                    key={option.value}
                                    value={option.label}
                                    className={({ active }) =>
                                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                        active
                                          ? "text-lovesBlack dark:text-darkPrimaryText bg-lovesGray dark:bg-darkBg"
                                          : "text-lovesBlack dark:text-darkPrimaryText"
                                      }`
                                    }
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {option.label}
                                        </span>
                                        {selected && (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <CheckIcon
                                              className="h-5 w-5 text-lovesPrimaryRed"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </div>
                          </Listbox>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </Transition>
                {!open && (
                  <Transition
                    show={!open}
                    enter="transition ease-in-out duration-[200ms]"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-[200ms]"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                  >
                    <div className="relative w-full lg:h-80 h-48 flex justify-center items-center">
                      <div className="absolute inset-0 flex justify-center items-center z-0">
                        <Lottie
                          animationData={filterBackground}
                          loop
                          className="w-48 h-48 lg:w-full lg:h-80 opacity-40"
                        />
                      </div>

                      <div className="flex flex-col items-center z-10 px-4">
                        <h2 className="font-futura-bold text-2xl text-lovesBlack dark:text-darkPrimaryText text-center">
                          Selected Filters
                        </h2>
                        <div className="mt-2">
                          <p className="font-futura-bold text-md text-lovesBlack dark:text-darkPrimaryText text-center">
                            {formatActiveFilters()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Transition>
                )}
              </div>
            )}
          </Disclosure>
          <hr className="h-px mb-4 bg-lovesBlack border-0 dark:bg-darkPrimaryText" />

          <Disclosure defaultOpen>
            {({ open, close }) => (
              <div className="w-full md:w-1/2 lg:mt-0 mt-8">
                <Disclosure.Button className="flex items-center justify-between w-full">
                  <p className="font-futura-bold text-lg text-lovesBlack dark:text-darkPrimaryText mb-3">
                    Date Range
                  </p>

                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } transition-transform duration-200 w-5 h-5 text-lovesBlack dark:text-darkPrimaryText`}
                  />
                </Disclosure.Button>

                <Transition
                  show={open}
                  enter="transition ease-in-out duration-[200ms]"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in-out duration-[200ms]"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Disclosure.Panel className="mt-2">
                    <hr className="h-px mb-4 bg-lovesBlack border-0 dark:bg-darkBorder" />
                    <Calendar
                      currentDate={currentDate}
                      setCurrentDate={setCurrentDate}
                      fromDate={fromDate}
                      setFromDate={setFromDate}
                      toDate={toDate}
                      setToDate={setToDate}
                      navigateMonth={navigateMonth}
                      handleDateSelect={handleDateSelect}
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                    />
                    <div className="mt-2 flex flex-col">
                      {fromDate && toDate && (
                        <div className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText text-center mb-2">
                          From: {fromDate.toLocaleDateString()} To:{" "}
                          {toDate.toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex justify-center space-x-1">
                        {(fromDate || toDate) && (
                          <button
                            type="button"
                            onClick={clearRange}
                            className="lg:w-3/6 w-3/4 rounded-md py-2 bg-lovesPrimaryRed dark:bg-darkBg dark:text-darkPrimaryText text-sm font-futura-bold text-lovesWhite shadow dark:shadow-none dark:border dark:border-darkBorder"
                          >
                            Clear Date Range
                          </button>
                        )}
                        {fromDate && toDate && (
                          <button
                            type="button"
                            onClick={() => saveRange(close)}
                            className="lg:w-3/6 w-3/4 rounded-md bg-lovesBlack 
                            dark:bg-darkPrimaryText dark:text-darkBg  text-sm font-futura-bold text-lovesWhite shadow dark:border-2 dark:border-darkBorder"
                          >
                            Save Date Range
                          </button>
                        )}
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>

                {!open && (
                  <Transition
                    show={!open}
                    enter="transition ease-in-out duration-[200ms]"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-[200ms]"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                  >
                    <div className="relative w-full lg:h-80 h-48 flex justify-center items-center">
                      <div className="absolute inset-0 flex justify-center items-center z-0">
                        <Lottie
                          animationData={filterBackground}
                          loop
                          className="w-48 h-48 lg:w-full lg:h-80 opacity-40"
                        />
                      </div>

                      <div className="flex flex-col items-center z-10 px-4">
                        <h2 className="font-futura-bold text-2xl text-lovesBlack dark:text-darkPrimaryText text-center">
                          Date Range
                        </h2>
                        <div className="mt-2">
                          <p className="font-futura-bold text-md text-lovesBlack dark:text-darkPrimaryText text-center">
                            From: {fromDate.toLocaleDateString()} To:{" "}
                            {toDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Transition>
                )}
              </div>
            )}
          </Disclosure>
        </div>
      </div>

      <div className="mt-8 flex justify-center dark:bg-darkBg ">
        <button
          onClick={handleSearch}
          disabled={!canSubmit}
          className={`lg:w-1/5 py-1 w-2/5 flex items-center justify-center gap-2 rounded-lg  
    ${
      canSubmit
        ? "bg-lovesPrimaryRed hover:bg-lovesBlack dark:hover:bg-lovesPrimaryRed text-lovesWhite"
        : "bg-darkLightGray dark:text-lovesBlack text-lovesBlack cursor-not-allowed dark:hover:text-lovesBlack"
    }
      font-futura-bold text-lg shadow-md shadow-lovesBlack`}
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.4987 13.9997L13.1654 12.6663M13.832 7.33301C13.832 10.6467 11.1457 13.333 7.83203 13.333C4.51832 13.333 1.83203 10.6467 1.83203 7.33301C1.83203 4.0193 4.51832 1.33301 7.83203 1.33301C11.1457 1.33301 13.832 4.0193 13.832 7.33301Z"
              className={`${
                canSubmit
                  ? "stroke-white "
                  : "stroke-lovesBlack dark:stroke-lovesBlack dark:hover:stroke-lovesBlack"
              }`}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Search
        </button>
      </div>
      {!canSubmit && (
        <div className="mt-4 text-center text-lovesPrimaryRed font-futura-bold">
          Please select at least one filter to enable search.
        </div>
      )}
    </section>
  );
}
