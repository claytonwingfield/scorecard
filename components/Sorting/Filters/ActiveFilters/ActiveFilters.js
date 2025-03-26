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
      <div className="bg-lovesWhite dark:bg-darkBg lg:pb-4 border-b-lovesGray border-r-lovesGray border-l-lovesGray  shadow-sm shadow-lovesBlack dark:shadow-darkLightGray dark:shadow-sm rounded-b-lg">
        <div className="mx-auto max-w-full px-4 lg:px-8 lg:py-4 ">
          <div className="flex items-center lg:flex-wrap lg:space-x-2 lg:pt-0 pt-2">
            <span className="text-md font-futura-bold text-lovesBlack dark:text-lovesWhite pr-2 mb-2">
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
                          className="text-md font-futura text-lovesBlack bg-lovesWhite dark:bg-darkLightGray dark:shadow-sm rounded-lg lg:m-0 mb-3 border border-lovesGray shadow-md shadow-lovesGray flex items-center"
                        >
                          <div className="flex items-center w-full">
                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="px-2 text-md font-futura-bold text-lovesBlack flex-1 text-left text-nowrap truncate"
                            >
                              {`Columns ${tableLabel}: Show All`}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="text-md font-futura-bold rounded-r-lg text-lovesWhite bg-lovesBlack border border-lovesBlack shadow-lovesGray text-center lg:px-4 px-3 py-2 lg:py-3"
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
                              className="text-md font-futura-bold text-lovesWhite bg-lovesPrimaryRed border border-lovesPrimaryRed rounded-r-md shadow-lovesGray text-center lg:px-4 px-5 py-2 lg:py-3"
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
                          className="text-md font-futura-bold text-lovesBlack bg-lovesWhite dark:bg-darkLightGray dark:shadow-sm rounded-lg lg:m-0 mb-3 border border-lovesGray shadow-md shadow-lovesGray flex items-center"
                        >
                          <div className="flex items-center w-full">
                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="px-2 text-md font-futura-bold text-lovesBlack flex-1 text-left text-nowrap truncate"
                            >
                              {`${filter.label} | ${tableLabel} `}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleButtonClick(type)}
                              className="text-md font-futura-bold text-lovesWhite bg-lovesBlack shadow-lovesGray border border-lovesBlack text-center lg:px-4 px-3 py-2 lg:py-3"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => removeFilter(filter)}
                              className="text-md font-futura-bold text-lovesWhite bg-lovesPrimaryRed border border-lovesPrimaryRed rounded-r-lg shadow-lovesGray text-center lg:px-4 px-5 py-2 lg:py-3"
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
                      className="text-md font-futura text-lovesBlack bg-lovesWhite dark:bg-darkLightGray dark:shadow-sm rounded-lg lg:m-0 mb-3 border border-lovesGray shadow-md shadow-lovesGray flex items-center"
                    >
                      <div className="flex items-center w-full">
                        <button
                          type="button"
                          onClick={() => handleButtonClick(type)}
                          className="px-2 text-md font-futura text-lovesBlack flex-1 text-left text-nowrap truncate"
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
                            className="text-md font-futura-bold  text-lovesWhite bg-lovesBlack shadow-lovesGray text-center lg:px-4 px-3 py-2 lg:py-3 border border-lovesBlack"
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleButtonClick(type)}
                            className="text-md font-futura-bold rounded-r-lg text-lovesWhite bg-lovesBlack shadow-lovesGray text-center lg:px-4 px-3 py-2 lg:py-3 border border-lovesBlack"
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
                            className="text-md font-futura-bold text-lovesWhite bg-lovesPrimaryRed  border-lovesPrimaryRed rounded-r-lg shadow-lovesGray text-center lg:px-4 px-5 py-2 lg:py-3 border "
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
