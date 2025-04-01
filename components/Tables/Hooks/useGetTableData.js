import { useCallback } from "react";

export default function useGetTableData({ dataSets }) {
  const getTableData = useCallback(
    (tableName) => {
      const dataSet = dataSets.find((ds) => ds.component === tableName);
      return dataSet ? dataSet.data : [];
    },
    [dataSets]
  );

  return { getTableData };
}
