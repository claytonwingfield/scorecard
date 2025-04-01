import { useState } from "react";

export default function useColumnVisibility({
  columnVisibilityOptions,
  tableColumns,
  overviewColumns,
  agentColumns,
  setActiveFilters,
}) {
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const initialVisibility = {};

    Object.keys(columnVisibilityOptions).forEach((table) => {
      initialVisibility[table] = ["All"];
    });
    return initialVisibility;
  });

  const handleColumnVisibilityChange = (tableName, columnKey, isChecked) => {
    setColumnVisibility((prev) => {
      const currentHiddenColumns = prev[tableName] || [];
      let updatedHiddenColumns = [...currentHiddenColumns];

      if (columnKey === "All") {
        if (isChecked) {
          const allTables = [...overviewColumns, ...agentColumns];
          const allCols =
            allTables
              .find((t) => t.tableName === tableName)
              ?.columns.map((col) => col.key) || [];
          updatedHiddenColumns = allCols;
        } else {
          updatedHiddenColumns = [];
        }
      } else {
        if (isChecked) {
          updatedHiddenColumns.push(columnKey);
        } else {
          updatedHiddenColumns = updatedHiddenColumns.filter(
            (col) => col !== columnKey
          );
        }
      }

      updatedHiddenColumns = [...new Set(updatedHiddenColumns)];

      return {
        ...prev,
        [tableName]: updatedHiddenColumns,
      };
    });

    if (columnKey === "All") {
      if (isChecked) {
        setActiveFilters((prev) => [
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
        setActiveFilters((prev) =>
          prev.filter(
            (f) => !(f.type === "Column Visibility" && f.table === tableName)
          )
        );
      }
    } else {
      const columnLabel =
        tableColumns[tableName].find((col) => col.key === columnKey)?.label ||
        columnKey;

      if (isChecked) {
        setActiveFilters((prev) => [
          ...prev,
          {
            type: "Column Visibility",
            table: tableName,
            label: `Hidden: ${columnLabel}`,
          },
        ]);
      } else {
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

  const getHiddenColumns = (tableName) => {
    return columnVisibility[tableName] || [];
  };

  return {
    columnVisibility,
    setColumnVisibility,
    handleColumnVisibilityChange,
    getHiddenColumns,
  };
}
