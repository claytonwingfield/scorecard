"use client";
import React, { useState, Fragment } from "react";
import Header from "@/components/Navigation/header";
import FilterCalendarToggle from "@/components/Sorting/Filters/FilterCalendarToggle";
import { useDateRange } from "@/components/Sorting/DateFilters/Hooks/useDateRange";
import { Transition } from "@headlessui/react";

export default function DashboardPage({
  departmentSections,
  departmentOptions,
}) {
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

  console.log(departmentSections);
  return (
    <div className="bg-lovesWhite dark:bg-darkBg min-h-screen">
      <Header />

      {/* Date Range & Filter Toggle */}
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
          toDate={toDate}
          currentDate={currentDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
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

      {/* Department Sections */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4 space-y-8">
        {departmentSections.map(
          ({ key, Component, managers, supervisors }, idx) => (
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
              <Transition.Child
                as="div"
                enter="transform"
                enterFrom="translate-y-4"
                enterTo="translate-y-0"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <Component
                  key={key}
                  managers={managers}
                  supervisors={supervisors}
                />
              </Transition.Child>
            </Transition>
          )
        )}
      </div>
    </div>
  );
}
