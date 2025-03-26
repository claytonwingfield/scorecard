// components/Tables/Hooks/useGetTableData.js
import { useCallback } from "react";

/**
 * Custom hook for getting table data from a dataSets array.
 */
export default function useGetTableData({ dataSets }) {
  /**
   * Finds the matching dataSet by component name (tableName).
   * Returns the data or an empty array.
   */
  const getTableData = useCallback(
    (tableName) => {
      const dataSet = dataSets.find((ds) => ds.component === tableName);
      return dataSet ? dataSet.data : [];
    },
    [dataSets]
  );

  return { getTableData };
}
