import { useState } from "react";

// Custom hook that encapsulates the state & labels
export default function useDisplayOptions() {
  // 1) The same default state
  const [displayOptions, setDisplayOptions] = useState({
    showCharts: false,
    resizableTables: false,
    showSearchBar: false,
    showColumnVisibility: false,
  });

  // 2) The same label map
  const displayOptionLabels = {
    showCharts: "Showing Charts",
    resizableTables: "Resizable Tables",
    showSearchBar: "Search Bar",
    showColumnVisibility: "Hide Column Controls",
  };

  // 3) Return them
  return {
    displayOptions,
    setDisplayOptions,
    displayOptionLabels,
  };
}
