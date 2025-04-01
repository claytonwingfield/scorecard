import { useCallback } from "react";

export default function useDisableResizableTables({
  setDisplayOptions,
  setActiveFilters,
  displayOptionLabels,
}) {
  const disableResizableTables = useCallback(() => {
    setDisplayOptions((prev) => ({
      ...prev,
      resizableTables: false,
    }));

    setActiveFilters((prevFilters) =>
      prevFilters.filter(
        (filter) =>
          !(
            filter.type === "Display Option" &&
            filter.label === displayOptionLabels.resizableTables
          )
      )
    );
  }, [setDisplayOptions, setActiveFilters, displayOptionLabels]);

  return { disableResizableTables };
}
