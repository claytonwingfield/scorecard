import { useCallback } from "react";

export default function useLayoutChange({
  displayOptions,
  activeTab,
  setFullLayout,
  setFullAgentLayout,
  disableResizableTables,
}) {
  const handleLayoutChange = useCallback(
    (newLayout) => {
      if (!displayOptions.showCharts) {
        if (activeTab === "overview") {
          setFullLayout((prev) =>
            prev.map((item) => {
              const updated = newLayout.find((nl) => nl.i === item.i);
              return updated ? { ...item, ...updated } : item;
            })
          );
        } else {
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

  const handleSaveLayout = useCallback(() => {
    disableResizableTables();
  }, [disableResizableTables]);

  return { handleLayoutChange, handleSaveLayout };
}
