import React, { useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function DisplayOptions({
  tableVisibilityOptions,
  agentTableVisibilityOptions,
  selectedVisibilityOption,
  setSelectedVisibilityOption,
  handleDisplayOptionChange,
  displayOptions,
  handleTableVisibilityChange,
  activeTab,
}) {
  const getActiveVisibilityOptions = () => {
    return activeTab === "agent"
      ? agentTableVisibilityOptions
      : tableVisibilityOptions;
  };

  const handleShowAll = () => {
    if (!selectedVisibilityOption.includes("All")) {
      setSelectedVisibilityOption(["All"]);
      getActiveVisibilityOptions()
        .filter((option) => option.value !== "All")
        .forEach((option) => {
          handleTableVisibilityChange(option.value, false);
        });
      handleTableVisibilityChange("All", true);
    } else {
      setSelectedVisibilityOption([]);
      handleTableVisibilityChange("All", false);
    }
  };

  const toggleOption = (optionValue) => {
    if (selectedVisibilityOption.includes(optionValue)) {
      setSelectedVisibilityOption(
        selectedVisibilityOption.filter((val) => val !== optionValue)
      );
      handleTableVisibilityChange(optionValue, false);
    } else {
      if (selectedVisibilityOption.includes("All")) {
        setSelectedVisibilityOption([optionValue]);
        handleTableVisibilityChange("All", false);
        handleTableVisibilityChange(optionValue, true);
      } else {
        setSelectedVisibilityOption([...selectedVisibilityOption, optionValue]);
        handleTableVisibilityChange(optionValue, true);
      }
    }
  };

  const isShowAll = selectedVisibilityOption.includes("All");
  const getDisplayTextForActiveTab = () => {
    const activeOptions = getActiveVisibilityOptions();

    if (isShowAll) return "Show All";
    if (selectedVisibilityOption.length === 0) return "Select Table Visibility";

    if (selectedVisibilityOption.length === 1) {
      const singleValue = selectedVisibilityOption[0];
      const foundOption = activeOptions.find(
        (opt) => opt.value === singleValue
      );
      return foundOption ? foundOption.label : "Select Table Visibility";
    }

    return "Multiple Tables Hidden";
  };

  useEffect(() => {
    if (selectedVisibilityOption.length === 0) {
      setSelectedVisibilityOption(["All"]);
      handleTableVisibilityChange("All", true);
    }
  }, [
    selectedVisibilityOption,
    setSelectedVisibilityOption,
    handleTableVisibilityChange,
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText mb-1">
          Table Visibility
        </h3>
        <Listbox
          as="div"
          className="space-y-1"
          value={selectedVisibilityOption}
          onChange={() => {}}
          multiple
        >
          <div className="relative z-49">
            <Listbox.Button
              className="relative dark:bg-darkBg w-full py-2 pl-3 pr-10 text-left text-md font-futura bg-darkBorder rounded-md cursor-default focus:outline-none  border border-darkBorder dark:border-darkBorder"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="block truncate  text-lovesWhite dark:text-darkPrimaryText font-futura">
                {getDisplayTextForActiveTab()}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon
                  className="h-5 w-5 text-lovesWhite dark:text-darkPrimaryText "
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Listbox.Options className="absolute mt-1 w-full bg-darkBorder dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1  text-md font-futura ring-1 ring-darkBorder ring-opacity-5 overflow-auto focus:outline-none dark:border-2 dark:border-darkBorder  z-50">
              <Listbox.Option
                key="All"
                value="All"
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active
                      ? "text-lovesWhite bg-darkBorder dark:bg-darkBg"
                      : "text-lovesWhite dark:text-darkPrimaryText"
                  }`
                }
                onClick={handleShowAll}
              >
                {({ active }) => (
                  <>
                    <span className="block truncate dark:text-darkPrimaryText">
                      Show All
                    </span>
                    {isShowAll && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <CheckIcon
                          className="h-5 w-5 text-lovesPrimaryRed"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>

              <div className="border-t dark:border-darkBorder border-lovesGray my-1"></div>

              {getActiveVisibilityOptions()
                .filter((option) => option.value !== "All")
                .map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active
                          ? "text-lovesWhite dark:text-darkPrimaryText bg-darkBorder dark:bg-darkBg"
                          : "text-lovesWhite dark:text-darkPrimaryText"
                      }`
                    }
                    onClick={() => toggleOption(option.value)}
                  >
                    {({ active }) => (
                      <>
                        <span className="block truncate">{option.label}</span>
                        {selectedVisibilityOption.includes(option.value) && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <CheckIcon
                              className="h-5 w-5 text-lovesPrimaryRed"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
      <div className="lg:max-w-64 max-w-80">
        <h3 className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText mb-2">
          Display Options
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 pl-3">
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-md font-futura text-lovesBlack dark:text-darkPrimaryText flex-1">
                Show Search Bar
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleDisplayOptionChange("showSearchBar", e.target.checked)
                  }
                  checked={displayOptions.showSearchBar}
                  className="sr-only "
                  id="toggle-show-search-bar"
                />
                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${
                    displayOptions.showSearchBar
                      ? "bg-lovesPrimaryRed"
                      : "bg-darkBorder dark:bg-darkPrimaryText border-2 border-lightGray dark:border dark:border-darkBorder dark:bg-darkBg"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 w-4 h-4 bg-lovesWhite  dark:text-darkPrimaryText rounded-full transition-transform duration-300 ${
                    displayOptions.showSearchBar
                      ? "translate-x-5 bg-lovesWhite dark:bg-darkPrimaryText"
                      : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <div className="space-y-4 ">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-md font-futura text-lovesBlack dark:text-darkPrimaryText flex-1">
                Show Charts
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleDisplayOptionChange("showCharts", e.target.checked)
                  }
                  checked={displayOptions.showCharts}
                  className="sr-only"
                  id="toggle-show-charts"
                />
                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${
                    displayOptions.showCharts
                      ? "bg-lovesPrimaryRed"
                      : "bg-darkBorder dark:bg-darkPrimaryText border-2 border-lightGray dark:border dark:border-darkBorder dark:bg-darkBg"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 w-4 h-4 bg-lovesWhite  rounded-full transition-transform duration-300 ${
                    displayOptions.showCharts
                      ? "translate-x-5 bg-lovesWhite dark:bg-darkPrimaryText"
                      : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-md font-futura text-lovesBlack dark:text-darkPrimaryText flex-1">
                Column Controls
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleDisplayOptionChange(
                      "showColumnVisibility",
                      e.target.checked
                    )
                  }
                  checked={displayOptions.showColumnVisibility}
                  className="sr-only"
                  id="toggle-show-column-visibility"
                />

                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${
                    displayOptions.showColumnVisibility
                      ? "bg-lovesPrimaryRed"
                      : "bg-darkBorder dark:bg-darkPrimaryText border-2 border-lightGray dark:border dark:border-darkBorder dark:bg-darkBg"
                  }`}
                ></div>

                <div
                  className={`dot absolute left-1 top-1 w-4 h-4 bg-lovesWhite rounded-full transition-transform duration-300 ${
                    displayOptions.showColumnVisibility
                      ? "translate-x-5 bg-lovesWhite dark:bg-darkPrimaryText"
                      : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>

          <div className="space-y-4 hidden lg:block">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-md font-futura text-lovesBlack dark:text-darkPrimaryText flex-1">
                Change Layout
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleDisplayOptionChange(
                      "resizableTables",
                      e.target.checked
                    )
                  }
                  checked={displayOptions.resizableTables}
                  className="sr-only"
                  id="toggle-resizable-tables"
                />
                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition-colors duration-300 ${
                    displayOptions.resizableTables
                      ? "bg-lovesPrimaryRed"
                      : "bg-darkBorder dark:bg-darkPrimaryText border-2 border-lightGray dark:border dark:border-darkBorder dark:bg-darkBg"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 w-4 h-4 bg-lovesWhite rounded-full transition-transform duration-300 ${
                    displayOptions.resizableTables
                      ? "translate-x-5 bg-lovesWhite dark:bg-darkPrimaryText"
                      : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
