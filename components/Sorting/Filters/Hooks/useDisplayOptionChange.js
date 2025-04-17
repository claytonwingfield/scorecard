import { useCallback } from "react";

export default function useDisplayOptionChange({
  setDisplayOptions,
  displayOptionLabels,
  setActiveFilters,
}) {
  const handleDisplayOptionChange = useCallback(
    (option, isChecked) => {
      setDisplayOptions((prev) => ({ ...prev, [option]: isChecked }));

      if (isChecked) {
        setActiveFilters((prev) => [
          ...prev,
          {
            type: "Display Option",
            label: displayOptionLabels[option] || option,
          },
        ]);
      } else {
        setActiveFilters((prev) =>
          prev.filter(
            (f) =>
              !(
                f.type === "Display Option" &&
                f.label === (displayOptionLabels[option] || option)
              )
          )
        );
      }
    },
    [setDisplayOptions, displayOptionLabels, setActiveFilters]
  );

  return { handleDisplayOptionChange };
}
