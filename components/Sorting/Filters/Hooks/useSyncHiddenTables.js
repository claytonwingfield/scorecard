import { useEffect } from "react";

export default function useSyncHiddenTables(getHiddenTables, setHiddenTables) {
  useEffect(() => {
    const hidden = getHiddenTables();

    setHiddenTables(hidden);
  }, [getHiddenTables, setHiddenTables]);
}
