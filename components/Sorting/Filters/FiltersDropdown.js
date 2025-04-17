import React, { useEffect } from "react";
import { Transition, Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import DisplayOptions from "./DisplayOptions";

export default function FiltersDropdown({
  isOpen,
  filtersDropdownRef,
  filterOptions,
  activeFilters,
  handleFilterChange,
  categoryRefs,
  tableVisibilityOptions,
  agentTableVisibilityOptions,
  selectedVisibilityOption,
  setSelectedVisibilityOption,
  handleDisplayOptionChange,
  displayOptions,
  handleTableVisibilityChange,
  allColumns,
  handleColumnVisibilityChange,
  columnVisibility,
  activeTab,
}) {
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
    <>
      {activeTab != "detail" ? (
        <Transition
          show={isOpen}
          enter="transition ease-in-out duration-[200ms]"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in-out duration-[200ms]"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div
            ref={filtersDropdownRef}
            className="px-4 sm:px-6 lg:px-8 py-4 border-r-lovesBlack dark:border-darkBorder shadow-sm shadow-lovesBlack dark:shadow-darkBorder"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-4">
                  {filterOptions.map((filterCategory) => (
                    <div
                      key={filterCategory.id}
                      ref={(el) =>
                        (categoryRefs.current[filterCategory.name] = el)
                      }
                    >
                      <h3 className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                        {filterCategory.name}
                      </h3>
                      <Listbox
                        value={activeFilters
                          .filter((f) => f.type === filterCategory.name)
                          .map((f) => f.label)}
                        onChange={(selectedValues) =>
                          handleFilterChange(
                            filterCategory.name,
                            selectedValues
                          )
                        }
                        multiple
                      >
                        <div className="mt-1 relative">
                          <Listbox.Button className="relative dark:bg-darkBg w-full py-2 pl-3 pr-10 text-left text-md font-futura bg-lovesWhite rounded-md cursor-default focus:outline-none  border border-darkBorder dark:border-darkBorder">
                            <span className="block truncate text-lovesBlack dark:text-darkPrimaryText ">
                              {activeFilters
                                .filter((f) => f.type === filterCategory.name)
                                .map((f) => f.label)
                                .join(", ") || `Select ${filterCategory.name}`}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <ChevronDownIcon
                                className="h-5 w-5 text-lovesBlack dark:text-darkPrimaryText"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Listbox.Options className="absolute dark:bg-darkBg mt-1 w-full bg-lovesWhite shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none dark:border-2 dark:border-darkBorder  z-50">
                            {filterCategory.options.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                value={option.label}
                                className={({ active }) =>
                                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                    active
                                      ? "text-lovesBlack bg-lovesWhite dark:bg-darkBg dark:text-darkPrimaryText"
                                      : "text-lovesBlack bg-lovesWhite dark:text-darkPrimaryText"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {option.label}
                                    </span>
                                    {selected && (
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
                  ))}
                </div>
              </div>

              <DisplayOptions
                tableVisibilityOptions={tableVisibilityOptions}
                agentTableVisibilityOptions={agentTableVisibilityOptions}
                selectedVisibilityOption={selectedVisibilityOption}
                setSelectedVisibilityOption={setSelectedVisibilityOption}
                handleDisplayOptionChange={handleDisplayOptionChange}
                displayOptions={displayOptions}
                handleTableVisibilityChange={handleTableVisibilityChange}
                allColumns={allColumns}
                handleColumnVisibilityChange={handleColumnVisibilityChange}
                columnVisibility={columnVisibility}
                activeTab={activeTab}
              />
            </div>
          </div>
        </Transition>
      ) : null}
    </>
  );
}
