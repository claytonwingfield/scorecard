import { useRef, useEffect } from "react";

export function useFilters(isFilterOpen, filterToEdit) {
  const categoryRefs = useRef({});

  useEffect(() => {
    if (isFilterOpen && filterToEdit && categoryRefs.current[filterToEdit]) {
      categoryRefs.current[filterToEdit].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isFilterOpen, filterToEdit]);

  return { categoryRefs };
}
