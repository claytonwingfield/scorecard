import { useCallback } from "react";

export default function useDateRangeSelect(setActiveFilters) {
  /**
   * handleDateRangeSelect
   *
   * @param {object} param0 - The date range object, e.g., { from, to }.
   */
  const handleDateRangeSelect = useCallback(
    ({ from, to }) => {
      setActiveFilters((prevFilters) => {
        // Remove any existing "Date Range" filter
        const updatedFilters = prevFilters.filter(
          (filter) => filter.type !== "Date Range"
        );

        let rangeLabel = "";

        // If both 'from' and 'to' are Date objects, build a label "MM/DD/YYYY - MM/DD/YYYY"
        if (from instanceof Date && to instanceof Date) {
          const fromDateString = from.toLocaleDateString();
          const toDateString = to.toLocaleDateString();
          rangeLabel = `${fromDateString} - ${toDateString}`;
        } else {
          // Otherwise just use 'from' as the label
          rangeLabel = from;
        }

        return [...updatedFilters, { type: "Date Range", label: rangeLabel }];
      });
    },
    [setActiveFilters]
  );

  return { handleDateRangeSelect };
}
