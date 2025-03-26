// components/Tables/Layouts/Hooks/useLayoutChange.js
import { useCallback } from "react";

/**
 * Custom hook to handle layout changes (Overview vs. Agent).
 */
export default function useLayoutChange({
  displayOptions,
  activeTab,
  setFullLayout,
  setFullAgentLayout,
  disableResizableTables, // pass in from parent
}) {
  const handleLayoutChange = useCallback(
    (newLayout) => {
      // Only apply layout changes if we're not showing charts
      if (!displayOptions.showCharts) {
        if (activeTab === "overview") {
          setFullLayout((prev) =>
            prev.map((item) => {
              const updated = newLayout.find((nl) => nl.i === item.i);
              return updated ? { ...item, ...updated } : item;
            })
          );
        } else {
          // Agent tab
          setFullAgentLayout((prev) =>
            prev.map((item) => {
              const updated = newLayout.find((nl) => nl.i === item.i);
              return updated ? { ...item, ...updated } : item;
            })
          );
        }
      }
    },
    [displayOptions.showCharts, activeTab, setFullLayout, setFullAgentLayout]
  );

  /**
   * Saves the layout by disabling resizable tables.
   */
  const handleSaveLayout = useCallback(() => {
    disableResizableTables();
  }, [disableResizableTables]);

  return { handleLayoutChange, handleSaveLayout };
}
