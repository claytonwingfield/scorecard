import React from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function ColumnVisibility({
  activeTab,
  overviewColumns,
  agentColumns,
  columnVisibility,
  handleColumnVisibilityChange,
}) {
  const activeColumns =
    (activeTab === "agent" ? agentColumns : overviewColumns) || [];

  const toggleOption = (tableName, optionValue) => {
    const isChecked = columnVisibility[tableName]?.includes(optionValue);
    handleColumnVisibilityChange(tableName, optionValue, !isChecked);
  };

  const handleShowAll = (tableName) => {
    const isShowAll = (columnVisibility[tableName] || []).length === 0;
    handleColumnVisibilityChange(tableName, "All", !isShowAll);
  };

  return (
    <div className="bg-lovesWhite dark:bg-darkBg rounded-lg lg:p-4 p-2 border shadow-sm shadow-lovesBlack dark:shadow-darkBorder">
      <h3 className="text-xl font-futura-bold font-medium text-lovesBlack lg:mb-3 mb-5 text-center dark:text-darkPrimaryText">
        Column Controls
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {activeColumns.map((table) => {
          const { tableName, label, columns } = table;
          const hiddenColumns = columnVisibility[tableName] || [];
          const isShowAll = hiddenColumns.length === 0;
          const selectedOptions = hiddenColumns;

          const getDisplayText = () => {
            if (isShowAll) return "Hide Columns";
            if (selectedOptions.length === columns.length) {
              return "All Columns Hidden";
            }
            if (selectedOptions.length === 1) {
              const colObj = columns.find(
                (col) => col.key === selectedOptions[0]
              );
              return colObj ? `Hidden: ${colObj.label}` : "Hide Columns";
            }
            return `Columns Hidden`;
          };

          return (
            <div key={`ColumnVisibility-${tableName}`}>
              <h4 className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText mb-1 text-center">
                {label}
              </h4>
              <Listbox
                as="div"
                className="space-y-1 "
                value={selectedOptions}
                onChange={() => {}}
                multiple
              >
                <div className="relative">
                  <Listbox.Button
                    aria-label={`Toggle column visibility for ${label}`}
                    className="relative z-49 w-full py-2 pl-3 pr-10 text-left text-md font-futura  bg-lovesWhite dark:bg-darkCompBg dark:text-lovesBlack rounded-md cursor-pointer focus:outline-none  border border-lovesGray"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="block truncate">{getDisplayText()}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDownIcon
                        className="h-5 w-5 text-lovesBlack"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Listbox.Options className="absolute mt-1 w-full bg-lovesWhite dark:bg-darkCompBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none  z-50">
                    <Listbox.Option
                      key={`${tableName}-All`}
                      value="All"
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-10 pr-4 dark:border-b dark:border-darkBorder ${
                          active
                            ? "text-lovesBlack bg-lovesGray text-md font-futura"
                            : "text-lovesWhite text-md font-futura"
                        }`
                      }
                      onClick={() => handleShowAll(tableName)}
                    >
                      {({ active }) => (
                        <>
                          <span className="block truncate text-lovesBlack text-md font-futura">
                            Hide All
                          </span>
                          {!isShowAll &&
                            hiddenColumns.length === columns.length && (
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

                    <div className="border-t border-lovesGray my-1"></div>

                    {columns.map((col) => (
                      <Listbox.Option
                        key={`${tableName}-${col.key}`}
                        value={col.key}
                        className={({ active }) =>
                          `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active
                              ? "text-lovesBlack bg-lovesGray text-md font-futura"
                              : "text-lovesBlack text-md font-futura"
                          }`
                        }
                        onClick={() => toggleOption(tableName, col.key)}
                      >
                        {({ active }) => (
                          <>
                            <span className="flex items-center">
                              <span className="block truncate">
                                {col.label}
                              </span>
                            </span>
                            {selectedOptions.includes(col.key) && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <CheckIcon
                                  className="h-5 w-5 text-lovesPrimaryRed"
                                  aria-hidden="true"
                                  type="checkbox"
                                  checked={selectedOptions.includes(col.key)}
                                  readOnly
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
          );
        })}
      </div>
    </div>
  );
}
