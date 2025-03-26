// components/Sorting/Filters/Hooks/useRemoveFilter.js

import { useCallback } from "react";

export default function useRemoveFilter({
  activeFilters,
  setActiveFilters,
  tableColumns,
  setColumnVisibility,
}) {
  const removeFilter = useCallback(
    (filterToRemove) => {
      // Remove the filter from activeFilters
      setActiveFilters((prevFilters) =>
        prevFilters.filter((filter) => {
          const isSameType = filter.type === filterToRemove.type;
          const isSameLabel = filter.label === filterToRemove.label;
          const isSameTable =
            filter.table === filterToRemove.table ||
            !filter.table ||
            !filterToRemove.table;
          return !(isSameType && isSameLabel && isSameTable);
        })
      );

      // Additional logic for certain filter types
      if (filterToRemove.type === "Column Visibility") {
        const { table, label } = filterToRemove;
        if (label === "Show All" || label === "All Columns Hidden") {
          setColumnVisibility((prev) => ({
            ...prev,
            [table]: [],
          }));
        } else {
          const columnLabel = label.startsWith("Hidden: ")
            ? label.substring(8)
            : label;
          const columnKey = tableColumns[table].find(
            (col) => col.label === columnLabel
          )?.key;

          if (columnKey) {
            setColumnVisibility((prev) => {
              const updatedHiddenColumns = prev[table]?.filter(
                (col) => col !== columnKey
              );
              return {
                ...prev,
                [table]: updatedHiddenColumns,
              };
            });
          }
        }
      }
    },
    [setActiveFilters, tableColumns, setColumnVisibility]
  );

  return { removeFilter };
}
