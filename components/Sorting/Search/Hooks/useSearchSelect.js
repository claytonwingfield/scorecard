import { useCallback } from "react";

export default function useSearchSelect(setActiveFilters) {
  const handleSearchSelect = useCallback(
    (suggestion) => {
      const { item } = suggestion;
      const newFilters = [];

      if (item.manager) {
        newFilters.push({ type: "Manager", label: item.manager });
      }
      if (item.supervisor) {
        newFilters.push({ type: "Supervisor", label: item.supervisor });
      }
      if (item.agent) {
        newFilters.push({ type: "Agent", label: item.agent });
      }

      setActiveFilters((prevFilters) => {
        const existingFilters = [...prevFilters];
        newFilters.forEach((newFilter) => {
          const isDuplicate = existingFilters.some(
            (filter) =>
              filter.type === newFilter.type && filter.label === newFilter.label
          );
          if (!isDuplicate) {
            existingFilters.push(newFilter);
          }
        });
        return existingFilters;
      });
    },
    [setActiveFilters]
  );

  return { handleSearchSelect };
}
