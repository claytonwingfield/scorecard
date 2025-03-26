// components/Tables/Hooks/useRenderTablesList.js
import { useCallback } from "react";

/**
 * Custom hook that returns a function for rendering a list of tables
 * using your `renderTable` function.
 */
export default function useRenderTablesList({
  renderTable,
  onMeasuredHeightChange,
}) {
  /**
   * Takes an array of table names, calls `renderTable` for each.
   */
  const renderTablesList = useCallback(
    (tableList) => {
      return tableList.map(renderTable);
    },
    [renderTable]
  );

  return { renderTablesList };
}
