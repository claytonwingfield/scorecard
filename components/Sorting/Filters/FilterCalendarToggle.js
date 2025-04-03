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
    border border-lovesBlack
    shadow-sm shadow-lovesBlack
    rounded-lg
    px-2
    transition-colors
    duration-300  dark:border-darkBorder
  `;

  const calendarButtonClasses = showCalendar
    ? `${baseButton} bg-darkBorder text-lovesWhite dark:bg-darkCompBg dark:text-darkPrimaryText`
    : `${baseButton} bg-lovesWhite hover:bg-darkBorder hover:text-white dark:bg-darkCompBg dark:text-darkPrimaryText hover:bg-darkPrimaryText`;

  const filterButtonClasses = showFilters
    ? `${baseButton} bg-darkBorder text-lovesWhite dark:bg-darkCompBg dark:text-darkPrimaryText`
    : `${baseButton} bg-lovesWhite hover:bg-darkBorder hover:text-white dark:bg-darkCompBg dark:text-darkPrimaryText hover:bg-darkPrimaryText`;
  const compareButtonClasses = showComparison
    ? `${baseButton} bg-darkBorder text-lovesWhite dark:bg-darkCompBg dark:text-darkPrimaryText`
    : `${baseButton} bg-lovesWhite hover:bg-darkBorder hover:text-white dark:bg-darkCompBg dark:text-darkPrimaryText hover:bg-darkPrimaryText`;

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
            className={compareButtonClasses}
          >
            <span className="whitespace-nowrap text-sm font-futura-bold">
              {showComparison ? "Close Comparison" : "Compare Managers"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
