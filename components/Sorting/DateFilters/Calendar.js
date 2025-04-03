import React, { useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { subMonths } from "date-fns";

const dateOptions = [
  { label: "MTD", value: "MTD" },
  { label: "3 Months", value: "3M" },
  { label: "6 Months", value: "6M" },
  { label: "YTD", value: "YTD" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar({
  handleDateRangeSelect,
  monthOffset = 0,
  buttonsPosition = "left",
  showButtons = true,
  currentDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedDateRange,
  setSelectedDateRange,
  navigateMonth,
}) {
  const displayedDate = new Date(currentDate);
  displayedDate.setMonth(displayedDate.getMonth() + monthOffset);

  const days = generateDays(displayedDate);

  const handleDateRangeChange = (value) => {
    const today = new Date();
    let startDate, endDate;

    switch (value) {
      case "MTD":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = today;
        break;

      case "3M":
        startDate = subMonths(today, 3);
        endDate = today;
        break;

      case "6M":
        startDate = subMonths(today, 6);
        endDate = today;
        break;

      case "YTD":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = today;
        break;

      case "custom":
        setFromDate(null);
        setToDate(null);
        setSelectedDateRange(null);
        return;

      default:
        startDate = null;
        endDate = null;
        break;
    }
    setFromDate(startDate);
    setToDate(endDate);
    setSelectedDateRange(value);

    if (handleDateRangeSelect) {
      handleDateRangeSelect({ from: startDate, to: endDate });
    }
  };

  const handleDateSelect = (date) => {
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(date);
      setToDate(null);
    } else {
      setToDate(date);
      setSelectedDateRange("custom");
      if (handleDateRangeSelect) {
        handleDateRangeSelect({ from: fromDate, to: date });
      }
    }
  };

  const handleNavigateMonth = (offset) => {
    navigateMonth(offset);
  };

  useEffect(() => {
    if (!fromDate && !toDate) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setDate(1);

      setFromDate(startOfMonth);
      setSelectedDateRange("MTD");
      setToDate(today);
    }
  }, [fromDate, toDate, setFromDate, setToDate, setSelectedDateRange]);
  useEffect(() => {
    if (fromDate && toDate) {
      const now = new Date();

      now.setHours(0, 0, 0, 0);

      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const dateFrom = new Date(fromDate);
      const dateTo = new Date(toDate);
      dateFrom.setHours(0, 0, 0, 0);
      dateTo.setHours(0, 0, 0, 0);

      if (
        dateFrom.getTime() === startOfThisMonth.getTime() &&
        dateTo.getTime() === now.getTime()
      ) {
        setSelectedDateRange("MTD");
      } else {
        setSelectedDateRange("custom");
      }
    } else {
      setSelectedDateRange("custom");
    }
  }, [fromDate, toDate, setSelectedDateRange]);
  return (
    <div className="bg-lightGray dark:bg-darkCompBg  flex flex-col flex-grow">
      <div
        className={`grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow ${
          buttonsPosition === "left" ? "" : "md:flex-row-reverse"
        }`}
      >
        {showButtons && (
          <div className="md:col-span-3">
            <div className="space-y-2">
              <ul className="space-y-1">
                {dateOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => handleDateRangeChange(option.value)}
                      className={classNames(
                        "w-full border-2 border-darkBorder dark:shadow-sm shadow-md shadow-lovesGray text-left text-md font-futura-bold px-4 py-2 lg:py-8  hover:bg-darkBorder dark:hover:bg-darkBorder dark:hover:text-darkPrimaryText hover:text-lovesWhite rounded-lg   dark:bg-darkBg",
                        selectedDateRange === option.value &&
                          "bg-darkBorder text-lovesWhite dark:bg-darkBorder dark:text-darkPrimaryText" // <--- Make sure it's text-lovesWhite
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div
          className={`${
            showButtons ? "md:col-span-9" : "md:col-span-12"
          } border-2 border-darkBorder rounded-lg shadow-md shadow-darkBorder dark:shadow-sm flex flex-col `}
        >
          <div className="flex items-center justify-between text-lovesBlack  font-futura-bold dark:text-darkPrimaryText p-3">
            <button
              type="button"
              className="-m-1.5 flex items-center justify-center p-1.5 text-lovesBlack dark:text-darkPrimaryText "
              onClick={() => handleNavigateMonth(-1)}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Previous month</span>
            </button>
            <div className="flex-auto text-md font-futura-bold text-center dark:text-darkPrimaryText">
              {displayedDate.toLocaleString("default", { month: "long" })}{" "}
              {displayedDate.getFullYear()}
            </div>
            <button
              type="button"
              className="-m-1.5 flex items-center justify-center p-1.5 text-lovesBlack dark:text-darkPrimaryText "
              onClick={() => handleNavigateMonth(1)}
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Next month</span>
            </button>
          </div>
          <div className="mt-2 grid grid-cols-7 text-xs text-lovesBlack font-futura dark:text-darkPrimaryText ">
            {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
              <div key={day} className="text-center ">
                {day}
              </div>
            ))}
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px bg-lightGray  dark:bg-darkBg  text-md font-futura shadow ring-1 text-lovesBlack ring-darkPrimaryText flex-grow rounded-bl-lg rounded-br-lg">
            {days.map((day, dayIdx) => {
              const isSelected = isSelectedDate(day.date, fromDate, toDate);
              const isToday =
                day.date.toDateString() === new Date().toDateString();
              const isStartOfRange =
                fromDate && day.date.toDateString() === fromDate.toDateString();
              const isEndOfRange =
                toDate && day.date.toDateString() === toDate.toDateString();
              return (
                <button
                  key={day.date}
                  type="button"
                  className={classNames(
                    "py-1.5 focus:z-10",

                    isToday && "text-lovesPrimaryRed font-futura-bold",

                    isSelected &&
                      !isStartOfRange &&
                      !isEndOfRange &&
                      "bg-darkBorder  text-lovesWhite dark:bg-darkBorder dark:text-darkPrimaryText",

                    isStartOfRange &&
                      "bg-darkBorder  text-lovesWhite dark:bg-darkBorder dark:text-darkPrimaryText lg:rounded-l-full rounded-l-none",

                    isEndOfRange &&
                      "bg-darkBorder dark:bg-darkBorder dark:text-darkPrimaryText  text-lovesWhite lg:rounded-r-full rounded-r-none",

                    dayIdx === 0 && "rounded-tl-lg",
                    dayIdx === 6 && "rounded-tr-lg",
                    dayIdx === days.length - 7 && "rounded-bl-lg",
                    dayIdx === days.length - 1 && "rounded-br-lg"
                  )}
                  onClick={() => handleDateSelect(day.date)}
                >
                  <time
                    dateTime={day.date}
                    className="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                  >
                    {day.date.getDate()}
                  </time>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateDays(date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = startOfMonth.getDay() || 7;
  const days = [];

  for (let i = startDay - 1; i > 0; i--) {
    const prevDate = new Date(startOfMonth);
    prevDate.setDate(prevDate.getDate() - i);
    days.push({
      date: prevDate,
      isCurrentMonth: false,
    });
  }

  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(date.getFullYear(), date.getMonth(), i),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
    days.push({
      date: nextDate,
      isCurrentMonth: false,
    });
  }
  return days;
}

const isSelectedDate = (date, fromDate, toDate) => {
  if (fromDate && !toDate) {
    return date.toDateString() === fromDate.toDateString();
  }
  if (fromDate && toDate) {
    const start = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate()
    );
    const end = new Date(
      toDate.getFullYear(),
      toDate.getMonth(),
      toDate.getDate(),
      23,
      59,
      59,
      999
    );
    return date >= start && date <= end;
  }
  return false;
};
