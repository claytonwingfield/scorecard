import { useState } from "react";

export default function useDisplayOptions() {
  const [displayOptions, setDisplayOptions] = useState({
    showCharts: false,
    resizableTables: false,
    showSearchBar: false,
    showColumnVisibility: false,
  });

  const displayOptionLabels = {
    showCharts: "Showing Charts",
    resizableTables: "Resizable Tables",
    showSearchBar: "Search Bar",
    showColumnVisibility: "Hide Column Controls",
  };

  return {
    displayOptions,
    setDisplayOptions,
    displayOptionLabels,
  };
}
