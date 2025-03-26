import { useState } from "react";

export default function useColumnVisibility({
  columnVisibilityOptions,
  tableColumns,
  overviewColumns,
  agentColumns,
  setActiveFilters,
}) {
  // 1. Initialize columnVisibility state
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const initialVisibility = {};
    // For each table in your columnVisibilityOptions object,
    // default to "All"
    Object.keys(columnVisibilityOptions).forEach((table) => {
      initialVisibility[table] = ["All"];
    });
    return initialVisibility;
  });

  // 2. Function to change column visibility for a given table
  const handleColumnVisibilityChange = (tableName, columnKey, isChecked) => {
    setColumnVisibility((prev) => {
      const currentHiddenColumns = prev[tableName] || [];
      let updatedHiddenColumns = [...currentHiddenColumns];

      if (columnKey === "All") {
        if (isChecked) {
          // Combine both overviewColumns + agentColumns
          // to find the matching table, then hide all its columns
          const allTables = [...overviewColumns, ...agentColumns];
          const allCols =
            allTables
              .find((t) => t.tableName === tableName)
              ?.columns.map((col) => col.key) || [];
          updatedHiddenColumns = allCols;
        } else {
          // If not checked, user is un-hiding everything
          updatedHiddenColumns = [];
        }
      } else {
        // Toggling a single column
        if (isChecked) {
          updatedHiddenColumns.push(columnKey);
        } else {
          updatedHiddenColumns = updatedHiddenColumns.filter(
            (col) => col !== columnKey
          );
        }
      }

      // Remove duplicates (just in case)
      updatedHiddenColumns = [...new Set(updatedHiddenColumns)];

      return {
        ...prev,
        [tableName]: updatedHiddenColumns,
      };
    });

    // 3. Update active filters
    if (columnKey === "All") {
      // If user wants to hide ALL columns
      if (isChecked) {
        setActiveFilters((prev) => [
          // remove any existing filters for this table
          ...prev.filter(
            (f) => !(f.type === "Column Visibility" && f.table === tableName)
          ),
          {
            type: "Column Visibility",
            table: tableName,
            label: "All Columns Hidden",
          },
        ]);
      } else {
        // user is un-hiding everything for this table
        setActiveFilters((prev) =>
          prev.filter(
            (f) => !(f.type === "Column Visibility" && f.table === tableName)
          )
        );
      }
    } else {
      // Toggling a specific column
      const columnLabel =
        tableColumns[tableName].find((col) => col.key === columnKey)?.label ||
        columnKey;

      if (isChecked) {
        // Hiding a column => add a filter
        setActiveFilters((prev) => [
          ...prev,
          {
            type: "Column Visibility",
            table: tableName,
            label: `Hidden: ${columnLabel}`,
          },
        ]);
      } else {
        // Un-hiding => remove the matching filter
        setActiveFilters((prev) =>
          prev.filter(
            (f) =>
              !(
                f.type === "Column Visibility" &&
                f.table === tableName &&
                f.label === `Hidden: ${columnLabel}`
              )
          )
        );
      }
    }
  };

  // 4. Helper function to get hidden columns for a table
  const getHiddenColumns = (tableName) => {
    return columnVisibility[tableName] || [];
  };

  // Return everything needed by your component
  return {
    columnVisibility,
    setColumnVisibility,
    handleColumnVisibilityChange,
    getHiddenColumns,
  };
}
