// components/Sorting/Layout/Hooks/useAgentLayout.js

import { useMemo } from "react";

export default function useAgentLayout({
  originalAgentLayout,
  hiddenTables,
  displayOptions,
  chartLayout,
}) {
  const visibleAgentLayout = useMemo(() => {
    if (!originalAgentLayout) return [];

    // 1) Filter out hidden tables
    let userLayout = originalAgentLayout.filter(
      (item) => !hiddenTables.includes(item.i)
    );

    // 2) If "showCharts" => chartLayout
    if (displayOptions.showCharts) {
      return chartLayout;
    } else {
      // 3) Revert sizes to original
      userLayout = userLayout.map((item) => {
        const originalItem = originalAgentLayout.find((o) => o.i === item.i);
        return {
          ...item,
          w: originalItem?.w ?? 1,
          h: originalItem?.h ?? 1,
        };
      });
    }

    return userLayout;
  }, [
    originalAgentLayout,
    hiddenTables,
    displayOptions.showCharts,
    chartLayout,
  ]);

  return visibleAgentLayout;
}
