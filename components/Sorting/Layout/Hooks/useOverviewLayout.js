// components/Sorting/Layout/Hooks/useOverviewLayout.js

import { useMemo } from "react";

export default function useOverviewLayout({
  originalLayout,
  hiddenTables,
  displayOptions,
  chartLayout,
}) {
  const visibleLayout = useMemo(() => {
    if (!originalLayout) return [];

    // 1) Filter out hidden tables
    let userLayout = originalLayout.filter(
      (item) => !hiddenTables.includes(item.i)
    );

    let finalLayout = userLayout;

    // 2) If "showCharts" is true, we return the chart layout
    if (displayOptions.showCharts) {
      return chartLayout;
    } else {
      // 3) Revert sizes to original
      finalLayout = userLayout.map((item) => {
        const originalItem = originalLayout.find((o) => o.i === item.i);
        return {
          ...item,
          w: originalItem?.w ?? 1,
          h: originalItem?.h ?? 1,
        };
      });
    }

    // 4) If Supervisor is hidden => expand
    const isSupervisorHidden = !finalLayout.some(
      (item) => item.i === "ScoreCardTable"
    );

    if (isSupervisorHidden) {
      finalLayout = finalLayout.map((item) => ({
        ...item,
        w: 2,
        x: 0,
      }));
    } else {
      finalLayout = finalLayout.map((item) => {
        const originalItem = originalLayout.find((o) => o.i === item.i);
        return {
          ...item,
          w: originalItem?.w ?? 1,
        };
      });
    }

    return finalLayout;
  }, [originalLayout, hiddenTables, displayOptions.showCharts, chartLayout]);

  return visibleLayout;
}
