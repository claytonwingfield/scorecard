import { useEffect } from "react";

export function useClickOutside(refs, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (
        !refs.some((ref) => ref.current && ref.current.contains(event.target))
      ) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [refs, handler]);
}
