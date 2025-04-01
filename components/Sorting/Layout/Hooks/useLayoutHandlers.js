// useLayoutHandlers.js
import { useCallback, useEffect } from "react";

export default function useLayoutHandlers({
  setFullLayout,
  setOriginalLayout,
  setFullAgentLayout,
  setOriginalAgentLayout,
  disableResizableTables,
  overviewLayout,
  agentLayout,
  fullLayout,
  fullAgentLayout,
  originalLayout,
  originalAgentLayout,
}) {
  useEffect(() => {
    if (originalLayout === null && fullLayout.length > 0) {
      setOriginalLayout(JSON.parse(JSON.stringify(fullLayout)));
    }
  }, [originalLayout, fullLayout, setOriginalLayout]);

  useEffect(() => {
    if (!originalAgentLayout && fullAgentLayout.length > 0) {
      setOriginalAgentLayout(JSON.parse(JSON.stringify(fullAgentLayout)));
    }
  }, [originalAgentLayout, fullAgentLayout, setOriginalAgentLayout]);

  const handleLayoutSelect = useCallback(
    (selectedLayout) => {
      setFullLayout(selectedLayout);
      setOriginalLayout(JSON.parse(JSON.stringify(selectedLayout)));
    },
    [setFullLayout, setOriginalLayout]
  );

  const handleAgentLayoutSelect = useCallback(
    (selectedLayout) => {
      setFullAgentLayout(selectedLayout);
      setOriginalAgentLayout(JSON.parse(JSON.stringify(selectedLayout)));
    },
    [setFullAgentLayout, setOriginalAgentLayout]
  );

  const handleRevertToDefault = useCallback(() => {
    setFullLayout(overviewLayout);
    setOriginalLayout(JSON.parse(JSON.stringify(overviewLayout)));
    disableResizableTables();
  }, [
    setFullLayout,
    setOriginalLayout,
    overviewLayout,
    disableResizableTables,
  ]);

  const handleRevertAgentToDefault = useCallback(() => {
    setFullAgentLayout(agentLayout);
    setOriginalAgentLayout(JSON.parse(JSON.stringify(agentLayout)));
    disableResizableTables();
  }, [
    setFullAgentLayout,
    setOriginalAgentLayout,
    agentLayout,
    disableResizableTables,
  ]);

  return {
    handleLayoutSelect,
    handleAgentLayoutSelect,
    handleRevertToDefault,
    handleRevertAgentToDefault,
  };
}
