import { useState, useCallback } from "react";

export default function useHiddenTables(selectedVisibilityOption) {
  // The exact same callback logic
  const getHiddenTables = useCallback(() => {
    if (
      selectedVisibilityOption.includes("All") ||
      selectedVisibilityOption.length === 0
    ) {
      return [];
    }
    return selectedVisibilityOption.filter((option) => option !== "All");
  }, [selectedVisibilityOption]);

  // The same state
  const [hiddenTables, setHiddenTables] = useState([]);

  // Return them so the parent component can use them
  return {
    hiddenTables,
    setHiddenTables,
    getHiddenTables,
  };
}
