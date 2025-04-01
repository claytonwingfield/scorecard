import { useState, useCallback } from "react";

export default function useHiddenTables(selectedVisibilityOption) {
  const getHiddenTables = useCallback(() => {
    if (
      selectedVisibilityOption.includes("All") ||
      selectedVisibilityOption.length === 0
    ) {
      return [];
    }
    return selectedVisibilityOption.filter((option) => option !== "All");
  }, [selectedVisibilityOption]);

  const [hiddenTables, setHiddenTables] = useState([]);

  return {
    hiddenTables,
    setHiddenTables,
    getHiddenTables,
  };
}
