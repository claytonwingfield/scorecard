import React from "react";
export default function ActiveFilters({
  activeFilters,
  setOpenDropdown,
  setFilterToEdit,
  removeFilter,
  allColumns,
}) {
  const displayOptionLabels = {
    showSearchBar: "Search Bar",
    resizableTables: "Resizable Tables",
    showCharts: "Showing Charts",
  };
  const tableNameToLabel = allColumns.reduce((acc, table) => {
    acc[table.tableName] = table.label;
    return acc;
  }, {});

  const categorizedFilters = activeFilters.reduce((acc, filter) => {
    if (!acc[filter.type]) {
      acc[filter.type] = [];
    }
    acc[filter.type].push(filter);
    return acc;
  }, {});

  const handleButtonClick = (type) => {
    if (type === "Date Range") {
      setOpenDropdown("date");
      setFilterToEdit(null);
    } else if (
      type === "Manager" ||
      type === "Supervisor" ||
      type === "Agent" ||
      type === "Table Visibility" ||
      type === "Column Visibility" ||
      type === "Display Option"
    ) {
      setOpenDropdown("filters");
      setFilterToEdit(type);
    }
  };

  return (
    <section aria-labelledby="active-filters-heading">
      <h2 id="active-filters-heading" className="sr-only">
        Active Filters
      </h2>
      <div className="bg-lightGray dark:bg-darkCompBg lg:pb-4 border-b-lightGray dark:border-b-darkBorder border-r-lightGray dark:border-b-darkBorder dark:border-r-darkBorder  shadow-sm shadow-lovesBlack dark:shadow-darkBorder dark:shadow-sm rounded-b-lg">
        <div className="mx-auto max-w-full px-4 lg:px-8 lg:py-4 ">
          <div className="flex items-center lg:flex-wrap lg:space-x-2 lg:pt-0 pt-2">
            <span className="text-md font-futura-bold text-lovesBlack dark:text-darkPrimaryText pr-2 mb-2">
              Active Filters
            </span>
          </div>
          {activeFilters.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-4 gap-1">
              {Object.keys(categorizedFilters).map((type) => {
                if (type === "Table Visibility") {
                } else if (type === "Column Visibility") {
                  const filtersByTable = categorizedFilters[type].reduce(
                    (acc, filter) => {
                      if (!acc[filter.table]) {
                        acc[filter.table] = [];
                      }
                      acc[filter.table].push(filter);
                      return acc;
                    },
                    {}
                  );
                  return Object.keys(filtersByTable).map((table) => {
                    const tableFilters = filtersByTable[table];
                    const hasShowAll = tableFilters.some(
                      (filter) => filter.label === "Show All"
                    );

                    const tableLabel = tableNameToLabel[table] || table;

                    if (hasShowAll) {
                      return (
                        <span
                          key={`Column Visibility-${table}`}
                          className="text-md font-futura text-lovesBlack bg-lovesWhite dark:bg-darkCompBg 
                          dark:text-darkPrimaryText dark:shadow-sm rounded-lg lg:m-0 mb-3 border border-lightGray dark:border-darkBorder dark:shadow-darkBorder shadow-md shadow-lightGray flex items-center"
                        >
                          <div className="flex items-center w-full">
                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="px-2 text-md font-futura-bold dark:text-darkPrimaryText text-lovesBlack flex-1 text-left text-nowrap truncate"
                            >
                              {`Columns ${tableLabel}: Show All`}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="text-md font-futura-bold rounded-r-lg text-lovesWhite 
                              dark:text-darkPrimaryText bg-darkBorder border border-darkBorder shadow-darkBorder 
                              dark:border-darkBorder dark:shadow-darkBorder text-center lg:px-4 px-3 py-2 lg:py-3"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeFilter({
                                  type,
                                  table,
                                  label: "Show All",
                                })
                              }
                              className="text-md font-futura-bold text-lovesWhite bg-lovesPrimaryRed border border-lovesPrimaryRed rounded-r-md 
                              dark:text-darkPrimaryText shadow-lightGray text-center lg:px-4 px-5 py-2 lg:py-3"
                            >
                              ×
                            </button>
                          </div>
                        </span>
                      );
                    } else {
                      return tableFilters.map((filter) => (
                        <span
                          key={`Column Visibility-${table}-${filter.label}`}
                          className="text-md font-futura-bold text-lovesBlack bg-lovesWhite dark:bg-darkCompBg 
                          dark:text-darkPrimaryText
                          dark:shadow-sm rounded-lg lg:m-0 mb-3 border border-darkBorder shadow-md shadow-darkBorder dark:border-darkBorder dark:shadow-darkBorder  flex items-center"
                        >
                          <div className="flex items-center w-full">
                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="px-2 text-md font-futura-bold text-lovesBlack
                              dark:text-darkPrimaryText
                              flex-1 text-left text-nowrap truncate"
                            >
                              {`${filter.label} | ${tableLabel} `}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="text-md font-futura-bold text-lovesWhite bg-darkBorder 
                              dark:text-darkPrimaryText
                              shadow-darkBorder border border-darkBorder 
                              dark:border-darkBorder dark:shadow-darkBorder text-center lg:px-4 px-3 py-2 lg:py-3"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFilter(filter)}
                              className="text-md font-futura-bold text-lovesWhite 
                              dark:text-darkPrimaryText
                              bg-lovesPrimaryRed border border-lovesPrimaryRed rounded-r-lg shadow-lightGray text-center lg:px-4 px-5 py-2 lg:py-3"
                            >
                              ×
                            </button>
                          </div>
                        </span>
                      ));
                    }
                  });
                }
                return categorizedFilters[type].map((filter) => {
                  let displayLabel = filter.label;
                  if (
                    type === "Display Option" &&
                    displayOptionLabels[filter.label]
                  ) {
                    displayLabel = displayOptionLabels[filter.label];
                  }
                  return (
                    <span
                      key={`${filter.type}-${filter.label}`}
                      className="text-md font-futura text-lovesBlack bg-lovesWhite dark:bg-darkCompBg dark:shadow-sm
                      dark:text-darkPrimaryText rounded-lg lg:m-0 mb-3 border border-darkBorder shadow-md shadow-darkBorder dark:border-darkBorder dark:shadow-darkBorder  flex items-center"
                    >
                      <div className="flex items-center w-full">
                        <button
                          type="button"
                          onClick={() => handleButtonClick(type)}
                          className="px-2 text-md font-futura text-lovesBlack flex-1 text-left text-nowrap truncate dark:text-darkPrimaryText"
                        >
                          {type === "Display Option"
                            ? displayLabel
                            : `${filter.type}: ${displayLabel}`}
                        </button>

                        {type !== "Date Range" &&
                        type !== "Table Visibility" &&
                        type !== "Column Visibility" &&
                        type !== "Display Option" ? (
                          <button
                            type="button"
                            onClick={() => handleButtonClick(type)}
                            className="text-md font-futura-bold  text-lovesWhite bg-darkBorder shadow-darkBorder text-center lg:px-4 px-3 py-2 lg:py-3 border border-darkBorder 
                            dark:border-darkBorder dark:shadow-darkBorder dark:text-darkPrimaryText"
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleButtonClick(type)}
                            className="text-md font-futura-bold rounded-r-lg text-lovesWhite bg-darkBorder shadow-darkBorder text-center lg:px-4 px-3 py-2 lg:py-3 border border-darkBorder dark:text-darkPrimaryText dark:border-darkBorder dark:shadow-darkBorder "
                          >
                            Edit
                          </button>
                        )}

                        {type !== "Date Range" &&
                        type !== "Table Visibility" &&
                        type !== "Column Visibility" &&
                        type !== "Display Option" ? (
                          <button
                            type="button"
                            onClick={() => removeFilter(filter)}
                            className="text-md font-futura-bold text-lovesWhite bg-lovesPrimaryRed  border-lovesPrimaryRed 
                            dark:border-darkBorder rounded-r-lg shadow-lightGray 
                            dark:shadow-darkBorder text-center lg:px-4 px-5 py-2 lg:py-3 border dark:text-darkPrimaryText "
                          >
                            ×
                          </button>
                        ) : null}
                      </div>
                    </span>
                  );
                });
              })}
            </div>
          ) : (
            <span>No active filters</span>
          )}
        </div>
      </div>
    </section>
  );
}
