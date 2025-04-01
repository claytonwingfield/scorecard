import { useState } from "react";

function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function useDateRange() {
  const [fromDate, setFromDate] = useState(() => getStartOfMonth());
  const [toDate, setToDate] = useState(() => new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = (offset) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const handleDateSelect = (date) => {
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(date);
      setToDate(null);
    } else {
      setToDate(date);
    }
  };

  return {
    currentDate,
    setCurrentDate,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    navigateMonth,
    handleDateSelect,
  };
}
