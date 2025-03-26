// useResizeObserver.js
import { useEffect, useRef } from "react";

/**
 * A custom hook that sets up a ResizeObserver on the provided DOM node.
 * When the node's size changes, your `onResize` callback is called with
 * the new contentRect (which includes width/height).
 */
export default function useResizeObserver(onResize) {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // contentRect gives you .width and .height, among other fields
        onResize(entry.contentRect);
      }
    });

    observer.observe(nodeRef.current);

    // Clean up when this component unmounts or node changes
    return () => {
      observer.disconnect();
    };
  }, [onResize]);

  return nodeRef;
}
