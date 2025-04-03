import React from "react";
import { Transition } from "@headlessui/react";
import Calendar from "./Calendar";

export default function DateFilterDropdown({
  isOpen,
  dateDropdownRef,
  currentDate,
  setCurrentDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  navigateMonth,
  handleDateSelect,
  clearRange,
  saveRange,
  selectedDateRange,
  setSelectedDateRange,
  activeTab,
}) {
  return (
    <>
      {activeTab != "detail" ? (
        <Transition
          show={isOpen}
          enter="transition ease-in-out duration-[200ms]"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in-out duration-[200ms]"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div
            ref={dateDropdownRef}
            className="px-4 lg:px-12 py-5 shadow-sm shadow-lovesBlack"
          >
            <div className="grid grid-cols-1 mt-3 h-full">
              <div className="flex flex-col h-full">
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
              </div>
            </div>
            <div className="mt-6 flex flex-col ">
              {fromDate && toDate && (
                <div className=" text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText text-center mb-6">
                  From: {fromDate.toLocaleDateString()} To:{"  "}
                  {toDate.toLocaleDateString()}
                </div>
              )}
              <div className="flex justify-center space-x-4">
                {(fromDate || toDate) && (
                  <button
                    type="button"
                    onClick={clearRange}
                    className="lg:w-1/6 w-3/4 rounded-md bg-lovesPrimaryRed dark:bg-darkBg dark:text-darkPrimaryText text-sm font-futura-bold text-lovesWhite shadow dark:shadow-none dark:border dark:border-darkBorder"
                  >
                    Clear Date Range
                  </button>
                )}
                {fromDate && toDate && (
                  <button
                    type="button"
                    onClick={saveRange}
                    className="lg:w-1/6 w-3/4 rounded-md bg-lovesBlack 
                    dark:bg-darkPrimaryText dark:text-darkBg  text-sm font-futura-bold text-lovesWhite shadow dark:border-2 dark:border-darkBorder"
                  >
                    Save Date Range
                  </button>
                )}
              </div>
            </div>
          </div>
        </Transition>
      ) : null}
    </>
  );
}
