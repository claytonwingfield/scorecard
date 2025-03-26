// components/Tables/Hooks/useSyncHiddenTables.js
import { useEffect } from "react";

/**
 * Keeps `hiddenTables` in sync by calling `getHiddenTables()` on every relevant change.
 */
export default function useSyncHiddenTables(getHiddenTables, setHiddenTables) {
  useEffect(() => {
    // 1) Call your getHiddenTables function
    const hidden = getHiddenTables();
    // 2) Update state
    setHiddenTables(hidden);
  }, [getHiddenTables, setHiddenTables]);
}
