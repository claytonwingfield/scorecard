import { useCallback } from "react";

export default function useRenderTablesList({ renderTable }) {
  const renderTablesList = useCallback(
    (tableList) => {
      return tableList.map(renderTable);
    },
    [renderTable]
  );

  return { renderTablesList };
}
