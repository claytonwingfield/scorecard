import { useCallback } from "react";

export default function useTableVisibilityChange({
  activeTab,
  agentTableVisibilityOptions,
  tableVisibilityOptions,
  selectedVisibilityOption,
  setSelectedVisibilityOption,
  hiddenTables,
  setHiddenTables,
  activeFilters,
  setActiveFilters,
}) {
  const handleTableVisibilityChange = useCallback(
    (optionValue, isChecked) => {
      // Decide which array to look in
      const activeVisibilityArray =
        activeTab === "agent"
          ? agentTableVisibilityOptions
          : tableVisibilityOptions;

      if (optionValue === "All") {
        if (isChecked) {
          setSelectedVisibilityOption(["All"]);
          setHiddenTables([]);
          setActiveFilters((prev) =>
            prev.filter((f) => f.type !== "Table Visibility")
          );
          setActiveFilters((prev) => [
            ...prev,
            { type: "Table Visibility", label: "Show All" },
          ]);
        } else {
          setSelectedVisibilityOption([]);
          setHiddenTables([]);
          setActiveFilters((prev) =>
            prev.filter(
              (f) => !(f.type === "Table Visibility" && f.label === "Show All")
            )
          );
        }
      } else {
        if (isChecked) {
          setSelectedVisibilityOption((prev) => [...prev, optionValue]);
          setHiddenTables((prev) => [...prev, optionValue]);

          const tableLabel = activeVisibilityArray.find(
            (opt) => opt.value === optionValue
          )?.label;

          setActiveFilters((prev) => [
            ...prev,
            { type: "Table Visibility", label: tableLabel || optionValue },
          ]);

          if (selectedVisibilityOption.includes("All")) {
            setSelectedVisibilityOption((prev) =>
              prev.filter((val) => val !== "All")
            );
            setActiveFilters((prev) =>
              prev.filter(
                (f) =>
                  !(f.type === "Table Visibility" && f.label === "Show All")
              )
            );
          }
        } else {
          setSelectedVisibilityOption((prev) =>
            prev.filter((val) => val !== optionValue)
          );
          setHiddenTables((prev) => prev.filter((val) => val !== optionValue));

          const tableLabel = activeVisibilityArray.find(
            (opt) => opt.value === optionValue
          )?.label;

          setActiveFilters((prev) =>
            prev.filter(
              (f) =>
                !(
                  f.type === "Table Visibility" &&
                  f.label === (tableLabel || optionValue)
                )
            )
          );

          if (hiddenTables.length === 1 && hiddenTables[0] === optionValue) {
            setSelectedVisibilityOption(["All"]);
            setActiveFilters((prev) => [
              ...prev.filter((f) => f.type !== "Table Visibility"),
              { type: "Table Visibility", label: "Show All" },
            ]);
          }
        }
      }
    },
    [
      activeTab,
      agentTableVisibilityOptions,
      tableVisibilityOptions,
      selectedVisibilityOption,
      hiddenTables,
      setSelectedVisibilityOption,
      setHiddenTables,
      setActiveFilters,
    ]
  );

  return { handleTableVisibilityChange };
}
