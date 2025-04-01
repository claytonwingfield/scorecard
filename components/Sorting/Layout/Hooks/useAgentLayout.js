import { useMemo } from "react";

export default function useAgentLayout({
  originalAgentLayout,
  hiddenTables,
  displayOptions,
  chartLayout,
}) {
  const visibleAgentLayout = useMemo(() => {
    if (!originalAgentLayout) return [];

    let userLayout = originalAgentLayout.filter(
      (item) => !hiddenTables.includes(item.i)
    );

    if (displayOptions.showCharts) {
      return chartLayout;
    } else {
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
