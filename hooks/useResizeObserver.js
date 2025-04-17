import { useEffect, useRef } from "react";

export default function useResizeObserver(onResize) {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        onResize(entry.contentRect);
      }
    });

    observer.observe(nodeRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onResize]);

  return nodeRef;
}
