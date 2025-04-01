// components/Tables/Hooks/useRenderTablesList.js
import { useCallback } from "react";

export default function useRenderTablesList({
  renderTable,
  onMeasuredHeightChange,
}) {
  const renderTablesList = useCallback(
    (tableList) => {
      return tableList.map(renderTable);
    },
    [renderTable]
  );

  return { renderTablesList };
}
