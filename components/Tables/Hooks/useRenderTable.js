import { useCallback } from "react";

export default function useRenderTable({
  hiddenTables,
  combinedRegistry,
  getTableData,
  getHiddenColumns,
  displayOptions,
  activeFilters,
}) {
  const renderTable = useCallback(
    (tableName) => {
      if (hiddenTables.includes(tableName)) return null;

      const TableComponent = combinedRegistry[tableName];

      if (!TableComponent) return null;

      const data = getTableData(tableName);

      const hiddenCols = getHiddenColumns(tableName);

      return (
        <div
          key={tableName}
          className="bg-lightGray dark:bg-darkCompBg shadow-md shadow-lovesBlack dark:shadow-darkBorder rounded-md p-1.5 w-full max-w-full no-scrollbar"
        >
          <TableComponent
            displayOptions={displayOptions}
            activeFilters={activeFilters}
            data={data}
            hiddenColumns={hiddenCols}
          />
        </div>
      );
    },
    [
      hiddenTables,
      combinedRegistry,
      getTableData,
      getHiddenColumns,
      displayOptions,
      activeFilters,
    ]
  );

  return { renderTable };
}
