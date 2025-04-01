import { useCallback } from "react";

export default function useDateRangeSelect(setActiveFilters) {
  const handleDateRangeSelect = useCallback(
    ({ from, to }) => {
      setActiveFilters((prevFilters) => {
        const updatedFilters = prevFilters.filter(
          (filter) => filter.type !== "Date Range"
        );

        let rangeLabel = "";

        if (from instanceof Date && to instanceof Date) {
          const fromDateString = from.toLocaleDateString();
          const toDateString = to.toLocaleDateString();
          rangeLabel = `${fromDateString} - ${toDateString}`;
        } else {
          rangeLabel = from;
        }

        return [...updatedFilters, { type: "Date Range", label: rangeLabel }];
      });
    },
    [setActiveFilters]
  );

  return { handleDateRangeSelect };
}
