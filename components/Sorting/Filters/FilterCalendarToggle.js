import React, { useState, useRef } from "react";
import { FunnelIcon, CalendarIcon } from "@heroicons/react/20/solid";
import Calendar from "@/components/Sorting/DateFilters/Calendar";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const departmentOptions = [
  { label: "Customer Service", value: "Customer Service" },
  { label: "Help Desk", value: "Help Desk" },
  { label: "Electronic Dispatch", value: "Electronic Dispatch" },
  { label: "Written Communication", value: "Written Communication" },
  { label: "Resolutions", value: "Resolutions" },
];

export default function FilterCalendarToggle({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  currentDate,
  setCurrentDate,
  selectedDateRange,
  setSelectedDateRange,
  selectedDepartments,
  setSelectedDepartments,
  showCalendar,
  setShowCalendar,
  isDetail,
  showComparison,
  setShowComparison,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const calendarRef = useRef(null);
  const filterRef = useRef(null);

  const toggleCalendar = () => {
    setShowCalendar((prev) => !prev);
    setShowFilters(false);
  };
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
    setShowCalendar(false);
  };

  const handleClickOutside = () => {
    setShowCalendar(false);
    setShowFilters(false);
  };
  useClickOutside([calendarRef, filterRef], handleClickOutside);

  const navigateMonth = (offset) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const clearRange = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedDateRange(null);
  };

  const saveRange = () => {
    setShowCalendar(false);
  };

  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department],
    }));
  };

  const selectedValues = departmentOptions
    .filter((opt) => selectedDepartments[opt.value])
    .map((opt) => opt.value);

  const handleListboxChange = (newSelectedArray) => {
    const updatedObj = { ...selectedDepartments };

    Object.keys(updatedObj).forEach((dep) => {
      updatedObj[dep] = false;
    });

    newSelectedArray.forEach((depValue) => {
      updatedObj[depValue] = true;
    });
    setSelectedDepartments(updatedObj);
  };

  const baseButton = `
    group
    inline-flex items-center
    h-9
    
    shadow-sm shadow-lovesBlack
    rounded-lg
    px-2
    transition-colors
    duration-300  dark:border-darkBorder
  `;

  const calendarButtonClasses = showCalendar
    ? `${baseButton} bg-lightGray text-lovesBlack dark:bg-darkCompBg dark:text-darkPrimaryText`
    : `${baseButton} bg-lightGray hover:bg-darkBorder hover:text-lovesBlack dark:bg-darkCompBg dark:text-darkPrimaryText hover:bg-darkPrimaryText`;

  const filterButtonClasses = showFilters
    ? `${baseButton} bg-lightGray text-lovesBlack dark:bg-darkCompBg dark:text-darkPrimaryText`
    : `${baseButton} bg-lightGray hover:bg-darkBorder hover:text-lovesBlack dark:bg-darkCompBg dark:text-darkPrimaryText hover:bg-darkPrimaryText`;
  const compareButtonClasses = showComparison
    ? `${baseButton} bg-lightGray text-lovesBlack dark:bg-darkCompBg dark:text-darkPrimaryText`
    : `${baseButton} bg-lightGray hover:bg-darkBorder hover:text-lovesBlack dark:bg-darkCompBg dark:text-darkPrimaryText hover:bg-darkPrimaryText`;

  const getTextContainerClasses = (isOpen) => {
    let base = `
      relative
      overflow-hidden
      transition-all
      duration-300
      w-0
      ml-0
      group-hover:w-16
    `;
    if (isOpen) {
      base += ` w-16`;
    }
    return base;
  };

  return (
    <div className="flex space-x-4 items-center">
      <div className="relative inline-block" ref={calendarRef}>
        <button
          type="button"
          onClick={toggleCalendar}
          className={calendarButtonClasses}
        >
          <CalendarIcon className="h-5 w-5" />
          <div className={getTextContainerClasses(showCalendar)}>
            <span className="whitespace-nowrap text-sm font-futura-bold">
              Calendar
            </span>
          </div>
        </button>

        {showCalendar && (
          <div
            className="
              absolute mt-2
              w-[360px] left-[-200px]
              md:w-[700px] md:left-[-595px]
              bg-lightGray dark:bg-darkCompBg 
              border border-lovesBlack dark:border-darkLightGray
              shadow-sm shadow-lovesBlack 
              rounded-lg p-4
              z-50
            "
          >
            <Calendar
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              currentDate={currentDate}
              navigateMonth={navigateMonth}
            />

            <div className="mt-6 flex flex-col">
              {fromDate && toDate && (
                <div className="mb-6 text-center text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                  From: {fromDate.toLocaleDateString()} &nbsp; to &nbsp;{" "}
                  {toDate.toLocaleDateString()}
                </div>
              )}
              <div className="flex justify-center space-x-4">
                {(fromDate || toDate) && (
                  <button
                    type="button"
                    onClick={clearRange}
                    className="lg:w-2/6 w-3/4 rounded-md bg-lovesPrimaryRed px-3 py-2 text-md font-futura-bold text-lovesWhite dark:text-darkPrimaryText shadow dark:shadow-none dark:border dark:border-darkBorder"
                  >
                    Clear Date Range
                  </button>
                )}
                {fromDate && toDate && (
                  <button
                    type="button"
                    onClick={saveRange}
                    className="lg:w-2/6 w-3/4 rounded-md bg-darkBorder 
                    dark:bg-darkBorder dark:text-darkPrimaryText  text-md font-futura-bold text-lovesWhite shadow dark:shadow-none dark:border dark:border-darkBorder"
                  >
                    Save Date Range
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!isDetail && (
        <div className="relative inline-block" ref={filterRef}>
          <button
            type="button"
            onClick={toggleFilters}
            className={filterButtonClasses}
          >
            <FunnelIcon className="h-5 w-5" />
            <div className={getTextContainerClasses(showFilters)}>
              <span className="whitespace-nowrap text-sm font-futura-bold">
                Filter
              </span>
            </div>
          </button>

          <>
            {showFilters && (
              <div
                className="
      absolute mt-2
      left-[-145px]
      w-[250px]
      bg-lightGray dark:bg-darkCompBg
      border border-darkCompBg dark:border-darkLightGray
      rounded-lg shadow-lg p-4
      z-50
    "
              >
                <h1 className="text-lovesBlack text-md font-futura-bold dark:text-darkPrimaryText">
                  Filter Departments
                </h1>
                <div className="border-b border-lightGray dark:border-darkBorder my-2"></div>

                {departmentOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center mb-2 cursor-pointer"
                    onClick={() => handleCheckboxChange(option.value)}
                  >
                    {selectedDepartments[option.value] ? (
                      <CheckIcon
                        className="h-4 w-4 mr-2 text-lovesPrimaryRed "
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="w-4 mr-2" />
                    )}

                    <span className="text-md text-lovesBlack dark:text-darkPrimaryText font-futura-bold hover:text-lovesPrimaryRed">
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        </div>
      )}
      {isDetail && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setShowComparison((prev) => !prev)}
            className={`${compareButtonClasses} group flex items-center justify-center`}
          >
            {showComparison ? (
              <>
                {/* The icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  id="compare"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M49 955.9h926.6c15.7 0 30.7-13.8 30-30-.7-16.3-13.2-30-30-30H49c-15.7 0-30.7 13.8-30 30 .7 16.2 13.2 30 30 30z"></path>
                  <path d="M402.7 535.4v342.1c0 15.8-.5 31.6 0 47.4v.7l30-30H108.3l30 30V582.5c0-15.5-.4-31 0-46.5 0-1.1.1-2.2.2-3.2-.4 2.7-.7 5.3-1.1 8 .3-1.8.8-3.4 1.5-5.1l-3 7.2c.4-.8.8-1.5 1.2-2.3 2-4.1-4.3 4.7-1.9 2.5 1.9-1.8-5.6 2.9-3.1 2.2.9-.2 2.1-1.2 2.9-1.6l-7.2 3c1.7-.7 3.3-1.1 5.1-1.5-2.7.4-5.3.7-8 1.1 10.1-1.1 20.6-.2 30.7-.2H378.7c12.2 0 25-1.1 37.2.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .3.8.3 1.8.3 2.7.6 15.7 13.4 30.7 30 30 15.8-.7 30.6-13.2 30-30-.8-22.3-15.8-44.1-38.7-48.2-4.4-.8-8.8-1.3-13.2-1.3H128.6c-13.1.1-25.1 4.7-34.8 13.6-11.4 10.5-15.4 25.3-15.4 40.2v385.9c0 16.2 13.7 30 30 30h324.4c16.2 0 30-13.7 30-30V583.5c0-15.8.3-31.6 0-47.4v-.7c0-15.7-13.8-30.7-30-30-16.3.7-30.1 13.2-30.1 30z"></path>
                  <path d="M643.8 326.5v525.4c0 24.2-.6 48.5 0 72.7v1l30-30H432.7l30 30V538.4c0-5.3-.4-10.5-1.7-15.7-5.7-22.8-27.2-36.8-49.9-36.8h-62l30 30V348.8c0-8.3-.7-16.8.2-25.1-.4 2.7-.7 5.3-1.1 8 .3-1.8.8-3.4 1.5-5.1l-3 7.2c.4-.8.8-1.5 1.2-2.3 2-4.1-4.3 4.7-1.9 2.5 1.9-1.8-5.6 2.9-3.1 2.2.9-.2 2.1-1.2 2.9-1.6l-7.2 3c1.7-.7 3.3-1.1 5.1-1.5-2.7.4-5.3.7-8 1.1 10.1-1.1 20.6-.2 30.7-.2h223.3c12.2 0 25-1.1 37.2.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .4 1.1.4 2 .4 2.9.6 15.7 13.4 30.7 30 30 15.8-.7 30.6-13.2 30-30-1-27.6-22.1-48.8-49.8-49.5-3-.1-6 0-9 0H455c-28.7 0-57.5-.8-86.2 0-27.6.8-48.8 22-49.6 49.5-.1 3.4 0 6.9 0 10.3v179c0 16.2 13.7 30 30 30h33c11.1 0 22.7-1 33.8.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .4 4.2.2 8.4.2 12.6v331.9c0 15.9-.3 31.8 0 47.7v.7c0 16.2 13.7 30 30 30H673.8c16.2 0 30-13.7 30-30V399.9c0-24.2.4-48.5 0-72.7v-1c0-15.7-13.8-30.7-30-30-16.2 1-30 13.5-30 30.3z"></path>
                  <path d="M884.8 117.6V892.9c0 10.5-.2 20.9 0 31.4v1.4l30-30h-241l30 30V346.7c0-7.3.5-14.8-.1-22.1-1.9-23.7-18.5-43.4-42.6-46.7-5.3-.7-10.2-.7-15.5-.7h-55.3l30 30V140.1c0-8.3-.7-16.8.2-25.1-.4 2.7-.7 5.3-1.1 8 .3-1.8.8-3.4 1.5-5.1l-3 7.2c.4-.8.8-1.5 1.2-2.3 2-4.1-4.3 4.7-1.9 2.5 1.9-1.8-5.6 2.9-3.1 2.2.9-.2 2.1-1.2 2.9-1.6l-7.2 3c1.7-.7 3.3-1.1 5.1-1.5-2.7.4-5.3.7-8 1.1 10.1-1.1 20.6-.2 30.7-.2h223.2c12.2 0 25-1.1 37.2.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .3.9.3 1.8.3 2.7.6 15.7 13.4 30.7 30 30 15.8-.7 30.6-13.2 30-30-1-27.6-22.1-48.8-49.8-49.5-3-.1-6 0-9 0H696.1c-28.7 0-57.5-.8-86.1 0-27.6.8-48.8 22-49.6 49.5-.1 3.4 0 6.9 0 10.3v179c0 16.2 13.7 30 30 30h33c11.1 0 22.7-1 33.8.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .6 6 .2 12.2.2 18.2v509.9c0 24.2-.4 48.4 0 72.6v1.1c0 16.2 13.7 30 30 30h241c16.2 0 30-13.7 30-30V150c0-10.5.1-20.9 0-31.4v-1.4c0-15.7-13.8-30.7-30-30-16.3 1.1-30.1 13.6-30.1 30.4z"></path>
                </svg>
                <div className="relative overflow-hidden transition-all duration-300 w-0 group-hover:w-32">
                  <span className="ml-1 whitespace-nowrap text-sm font-futura-bold">
                    Close Comparison
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* The icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                  id="compare"
                  fill="currentColor"
                  className="w-5 h-5 dark:text-darkPrimaryText"
                >
                  <path d="M49 955.9h926.6c15.7 0 30.7-13.8 30-30-.7-16.3-13.2-30-30-30H49c-15.7 0-30.7 13.8-30 30 .7 16.2 13.2 30 30 30z"></path>
                  <path d="M402.7 535.4v342.1c0 15.8-.5 31.6 0 47.4v.7l30-30H108.3l30 30V582.5c0-15.5-.4-31 0-46.5 0-1.1.1-2.2.2-3.2-.4 2.7-.7 5.3-1.1 8 .3-1.8.8-3.4 1.5-5.1l-3 7.2c.4-.8.8-1.5 1.2-2.3 2-4.1-4.3 4.7-1.9 2.5 1.9-1.8-5.6 2.9-3.1 2.2.9-.2 2.1-1.2 2.9-1.6l-7.2 3c1.7-.7 3.3-1.1 5.1-1.5-2.7.4-5.3.7-8 1.1 10.1-1.1 20.6-.2 30.7-.2H378.7c12.2 0 25-1.1 37.2.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .3.8.3 1.8.3 2.7.6 15.7 13.4 30.7 30 30 15.8-.7 30.6-13.2 30-30-.8-22.3-15.8-44.1-38.7-48.2-4.4-.8-8.8-1.3-13.2-1.3H128.6c-13.1.1-25.1 4.7-34.8 13.6-11.4 10.5-15.4 25.3-15.4 40.2v385.9c0 16.2 13.7 30 30 30h324.4c16.2 0 30-13.7 30-30V583.5c0-15.8.3-31.6 0-47.4v-.7c0-15.7-13.8-30.7-30-30-16.3.7-30.1 13.2-30.1 30z"></path>
                  <path d="M643.8 326.5v525.4c0 24.2-.6 48.5 0 72.7v1l30-30H432.7l30 30V538.4c0-5.3-.4-10.5-1.7-15.7-5.7-22.8-27.2-36.8-49.9-36.8h-62l30 30V348.8c0-8.3-.7-16.8.2-25.1-.4 2.7-.7 5.3-1.1 8 .3-1.8.8-3.4 1.5-5.1l-3 7.2c.4-.8.8-1.5 1.2-2.3 2-4.1-4.3 4.7-1.9 2.5 1.9-1.8-5.6 2.9-3.1 2.2.9-.2 2.1-1.2 2.9-1.6l-7.2 3c1.7-.7 3.3-1.1 5.1-1.5-2.7.4-5.3.7-8 1.1 10.1-1.1 20.6-.2 30.7-.2h223.3c12.2 0 25-1.1 37.2.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .4 1.1.4 2 .4 2.9.6 15.7 13.4 30.7 30 30 15.8-.7 30.6-13.2 30-30-1-27.6-22.1-48.8-49.8-49.5-3-.1-6 0-9 0H455c-28.7 0-57.5-.8-86.2 0-27.6.8-48.8 22-49.6 49.5-.1 3.4 0 6.9 0 10.3v179c0 16.2 13.7 30 30 30h33c11.1 0 22.7-1 33.8.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .4 4.2.2 8.4.2 12.6v331.9c0 15.9-.3 31.8 0 47.7v.7c0 16.2 13.7 30 30 30H673.8c16.2 0 30-13.7 30-30V399.9c0-24.2.4-48.5 0-72.7v-1c0-15.7-13.8-30.7-30-30-16.2 1-30 13.5-30 30.3z"></path>
                  <path d="M884.8 117.6V892.9c0 10.5-.2 20.9 0 31.4v1.4l30-30h-241l30 30V346.7c0-7.3.5-14.8-.1-22.1-1.9-23.7-18.5-43.4-42.6-46.7-5.3-.7-10.2-.7-15.5-.7h-55.3l30 30V140.1c0-8.3-.7-16.8.2-25.1-.4 2.7-.7 5.3-1.1 8 .3-1.8.8-3.4 1.5-5.1l-3 7.2c.4-.8.8-1.5 1.2-2.3 2-4.1-4.3 4.7-1.9 2.5 1.9-1.8-5.6 2.9-3.1 2.2.9-.2 2.1-1.2 2.9-1.6l-7.2 3c1.7-.7 3.3-1.1 5.1-1.5-2.7.4-5.3.7-8 1.1 10.1-1.1 20.6-.2 30.7-.2h223.2c12.2 0 25-1.1 37.2.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .3.9.3 1.8.3 2.7.6 15.7 13.4 30.7 30 30 15.8-.7 30.6-13.2 30-30-1-27.6-22.1-48.8-49.8-49.5-3-.1-6 0-9 0H696.1c-28.7 0-57.5-.8-86.1 0-27.6.8-48.8 22-49.6 49.5-.1 3.4 0 6.9 0 10.3v179c0 16.2 13.7 30 30 30h33c11.1 0 22.7-1 33.8.2-2.7-.4-5.3-.7-8-1.1 1.8.3 3.4.8 5.1 1.5l-7.2-3c.8.4 1.5.8 2.3 1.2 4.1 2-4.7-4.3-2.5-1.9 1.8 1.9-2.9-5.6-2.2-3.1.2.9 1.2 2.1 1.6 2.9l-3-7.2c.7 1.7 1.1 3.3 1.5 5.1-.4-2.7-.7-5.3-1.1-8 .6 6 .2 12.2.2 18.2v509.9c0 24.2-.4 48.4 0 72.6v1.1c0 16.2 13.7 30 30 30h241c16.2 0 30-13.7 30-30V150c0-10.5.1-20.9 0-31.4v-1.4c0-15.7-13.8-30.7-30-30-16.3 1.1-30.1 13.6-30.1 30.4z"></path>
                </svg>
                <div className="relative overflow-hidden transition-all duration-300 w-0 group-hover:w-40">
                  <span className="ml-1 whitespace-nowrap text-sm font-futura-bold">
                    Compare Managers
                  </span>
                </div>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
