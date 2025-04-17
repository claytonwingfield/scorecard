import { useMemo } from "react";

export default function useOverviewLayout({
  originalLayout,
  hiddenTables,
  displayOptions,
  chartLayout,
}) {
  const visibleLayout = useMemo(() => {
    if (!originalLayout) return [];

    let userLayout = originalLayout.filter(
      (item) => !hiddenTables.includes(item.i)
    );

    let finalLayout = userLayout;

    if (displayOptions.showCharts) {
      return chartLayout;
    } else {
      finalLayout = userLayout.map((item) => {
        const originalItem = originalLayout.find((o) => o.i === item.i);
        return {
          ...item,
          w: originalItem?.w ?? 1,
          h: originalItem?.h ?? 1,
        };
      });
    }

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
