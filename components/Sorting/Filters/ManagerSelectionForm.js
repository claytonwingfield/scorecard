"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { Disclosure, Transition, Listbox } from "@headlessui/react";
import {
  ChevronDownIcon,
  CheckIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import Header from "@/components/Navigation/header";
import Calendar from "@/components/Sorting/DateFilters/Calendar";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import { performSearch } from "@/components/Sorting/Search/Hooks/searchUtils";
import { allTeamData, customerServiceData } from "@/data/customerServiceData";
import dynamic from "next/dynamic";
import filterBackground from "@/public/animations/filterBackground.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
export default function ManagerSelectionForm({}) {
  const router = useRouter();
  const [selectedManager, setSelectedManager] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dataSets = customerServiceData.dataSets;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const managerList = useMemo(() => {
    const managersSet = new Set();
    dataSets.forEach((set) => {
      set.data.forEach((row) => {
        if (row.manager) managersSet.add(row.manager);
      });
    });
    return Array.from(managersSet).map((mgr) => ({ value: mgr, label: mgr }));
  }, [dataSets]);

  const formatDateParam = (date) =>
    date ? date.toISOString().split("T")[0] : "";

  const clearRange = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedDateRange(null);
  };

  const saveRange = (close) => {
    close();
  };

  const canSubmit = selectedManager !== null;

  const handleSearch = () => {
    if (!selectedManager) return;

    const activeFilters = [{ type: "Manager", label: selectedManager.value }];

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

  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingAnimation />
      </>
    );
  }
  const formatActiveFilters = () => {
    return selectedManager ? `Manager: ${selectedManager.label}` : "No Filters";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center">
        <section className="w-full max-w-7xl p-4">
          <h1 className=" text-center font-futura-bold text-xl">
            Manager Search
          </h1>
          <div className="mt-4 w-full max-w-full mx-auto flex justify-center items-center">
            <div className="box flex flex-col md:flex-row justify-between items-start rounded-xl border bg-lovesWhite dark:bg-darkBg p-6 w-full max-w-7xl shadow-md shadow-lovesBlack">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <div className="w-full md:w-1/2 lg:pr-12">
                    <Disclosure.Button className="flex items-center justify-between w-full">
                      <h6 className="font-futura-bold text-lg text-lovesBlack dark:text-lovesWhite lg:mb-3 mb-1">
                        Manager
                      </h6>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } transition-transform duration-200 w-5 h-5 text-lovesBlack dark:text-lovesWhite`}
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
                        <hr className="h-px mb-4 bg-lovesBlack border-0 dark:bg-darkLightGray" />
                        <div className="lg:space-y-6 space-y-2">
                          <div>
                            <h3 className="text-md font-futura-bold text-lovesBlack dark:text-lovesWhite">
                              Select Manager
                            </h3>
                            <Listbox
                              value={selectedManager}
                              onChange={setSelectedManager}
                            >
                              <div className="relative">
                                <Listbox.Button className="relative dark:bg-darkLightGray w-full py-2 pl-3 pr-10 text-left text-md font-futura bg-lovesWhite rounded-md cursor-default focus:outline-none border border-lovesGray">
                                  <span className="block truncate text-lovesBlack">
                                    {selectedManager
                                      ? selectedManager.label
                                      : "Select Manager"}
                                  </span>
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon
                                      className="w-5 h-5 text-lovesBlack"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Listbox.Button>
                                <Listbox.Options className="absolute dark:bg-darkLightGray mt-1 w-full bg-lovesWhite shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none z-50">
                                  {managerList.map((option) => (
                                    <Listbox.Option
                                      key={option.value}
                                      value={option}
                                      className={({ active }) =>
                                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                          active
                                            ? "text-lovesBlack bg-lovesGray"
                                            : "text-lovesBlack"
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
                                                className="w-5 h-5 text-lovesPrimaryRed"
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
                            <h2 className="font-futura-bold text-2xl text-lovesBlack dark:text-lovesWhite text-center">
                              Selected Filters
                            </h2>
                            <div className="mt-2">
                              <p className="font-futura-bold text-md text-lovesBlack dark:text-lovesWhite text-center">
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

              <Disclosure defaultOpen>
                {({ open, close }) => (
                  <div className="w-full md:w-1/2 lg:mt-0 mt-8">
                    <Disclosure.Button className="flex items-center justify-between w-full">
                      <p className="font-futura-bold text-lg text-lovesBlack dark:text-lovesWhite mb-3">
                        Date Range
                      </p>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } transition-transform duration-200 w-5 h-5 text-lovesBlack dark:text-lovesWhite`}
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
                        <hr className="h-px mb-4 bg-lovesBlack border-0 dark:bg-darkLightGray" />
                        <Calendar
                          currentDate={currentDate}
                          setCurrentDate={setCurrentDate}
                          fromDate={fromDate}
                          setFromDate={setFromDate}
                          toDate={toDate}
                          setToDate={setToDate}
                          navigateMonth={() => {}}
                          handleDateSelect={() => {}}
                          selectedDateRange={selectedDateRange}
                          setSelectedDateRange={setSelectedDateRange}
                        />
                        <div className="mt-2 flex justify-center space-x-1">
                          {(fromDate || toDate) && (
                            <button
                              type="button"
                              onClick={clearRange}
                              className="lg:w-3/6 w-3/4 rounded-md py-2 bg-lovesPrimaryRed text-sm font-futura-bold text-lovesWhite shadow"
                            >
                              Clear Date Range
                            </button>
                          )}
                          {fromDate && toDate && (
                            <button
                              type="button"
                              onClick={() => saveRange(close)}
                              className="lg:w-3/6 w-3/4 rounded-md bg-lovesBlack dark:bg-darkLightGray dark:text-lovesBlack text-sm font-futura-bold text-lovesWhite shadow"
                            >
                              Save Date Range
                            </button>
                          )}
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
                            <h2 className="font-futura-bold text-2xl text-lovesBlack dark:text-lovesWhite text-center">
                              Date Range
                            </h2>
                            <div className="mt-2">
                              <p className="font-futura-bold text-md text-lovesBlack dark:text-lovesWhite text-center">
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
          <div className="mt-8 flex justify-center dark:bg-darkBg">
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
                      ? "stroke-white"
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
        </section>
      </div>
    </div>
  );
}
