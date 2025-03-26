import { useEffect } from "react";

export default function useLocalStorageLayouts(
  fullLayout,
  setFullLayout,
  fullAgentLayout,
  setFullAgentLayout
) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dashboardLayout");
      if (stored) setFullLayout(JSON.parse(stored));

      const storedAgent = localStorage.getItem("dashboardLayoutAgent");
      if (storedAgent) setFullAgentLayout(JSON.parse(storedAgent));
    }
  }, [setFullLayout, setFullAgentLayout]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardLayout", JSON.stringify(fullLayout));
    }
  }, [fullLayout]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "dashboardLayoutAgent",
        JSON.stringify(fullAgentLayout)
      );
    }
  }, [fullAgentLayout]);
}
