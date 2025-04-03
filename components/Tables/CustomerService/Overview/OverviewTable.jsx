import React, { useMemo, useState, useEffect } from "react";
import { defaultSort, upArrow, downArrow } from "@/components/Icons/icons";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import BarChart from "@/components/Charts/BarChart";
import LineChartTime from "@/components/Charts/LineChartTime";

export default function OverviewTable({
  title,
  data,
  activeFilters,
  hiddenColumns = [],
  displayOptions,
  chartConfig,
  columns,
  filterFn,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { isScoreCard } = chartConfig || {};

  const [chartType, setChartType] = useState("Bar Chart");
  const [groupByField, setGroupByField] = useState(null);
  const [xAxisField, setXAxisField] = useState(
    chartConfig?.defaultXAxis || "manager"
  );

  const filteredData = useMemo(() => {
    if (typeof filterFn === "function") {
      return filterFn(data, activeFilters);
    }

    return data;
  }, [data, activeFilters, filterFn]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return defaultSort;
    return sortConfig.direction === "asc" ? upArrow : downArrow;
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const key = sortConfig.key;
        if (chartConfig?.percentColumns?.includes(key)) {
          const aVal = parseFloat((a[key] || "").replace("%", "")) || 0;
          const bVal = parseFloat((b[key] || "").replace("%", "")) || 0;
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        if (chartConfig?.numericColumns?.includes(key)) {
          const aNum = parseInt(a[key], 10) || 0;
          const bNum = parseInt(b[key], 10) || 0;
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        return sortConfig.direction === "asc"
          ? (a[key] || "").localeCompare(b[key] || "")
          : (b[key] || "").localeCompare(a[key] || "");
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig, chartConfig]);

  const columnsToDisplay = columns.filter(
    (col) => !hiddenColumns.includes(col.key)
  );

  const getTextAlignment = (index) =>
    index === 0 ? "text-left" : "text-center";

  return (
    <div className="h-full  overflow-hidden ring-1 ring-lovesBlack dark:ring-0 rounded-lg ">
      <div className="flex flex-col h-full">
        {displayOptions.showCharts ? (
          <div
            className={`flex ${
              isMobile
                ? "flex-col items-center"
                : "flex-row items-center justify-between"
            } bg-lovesBlack dark:bg-darkCompBg pl-4 pt-2 pb-4`}
          >
            <h2 className="text-xl font-futura-bold text-lovesWhite dark:text-darkPrimaryText">
              {title}
            </h2>
            <div
              className={`flex space-x-2 pr-2 ${
                isMobile ? "mt-2 justify-center" : ""
              }`}
            >
              {chartConfig?.groupByOptions && (
                <div className={`${isMobile ? "w-40" : "w-48"}`}>
                  <Listbox
                    value={groupByField || ""}
                    onChange={(value) => setGroupByField(value || null)}
                  >
                    <div className="relative">
                      <Listbox.Button className="bg-lovesWhite dark:bg-darkBg relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                        <span className="block truncate text-md font-futura">
                          {
                            chartConfig.groupByOptions.find(
                              (option) => option.value === (groupByField || "")
                            )?.label
                          }
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDownIcon
                            className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none ">
                        {chartConfig.groupByOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                              `${
                                active
                                  ? "text-lovesBlack bg-lovesWhite dark:bg-darkCompBg text-md font-futura-bold"
                                  : "text-lovesBlack dark:text-darkPrimaryText text-md font-futura"
                              } cursor-default select-none relative py-2 pl-10 pr-4`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-medium" : "font-normal"
                                  } block truncate`}
                                >
                                  {option.label}
                                </span>
                                {selected && (
                                  <span
                                    className={`${
                                      active
                                        ? "text-lovesPrimaryRed"
                                        : "text-lovesPrimaryRed"
                                    } absolute inset-y-0 left-0 flex items-center pl-3`}
                                  >
                                    <CheckIcon
                                      className="w-5 h-5"
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
              )}
              {chartConfig?.chartTypeOptions && (
                <div className={`${isMobile ? "w-40" : "w-48"}`}>
                  <Listbox value={chartType} onChange={setChartType}>
                    <div className="relative">
                      <Listbox.Button className="bg-lovesWhite dark:bg-darkBg relative w-full py-2 pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none text-md font-futura">
                        <span className="block truncate">{chartType}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDownIcon
                            className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-lovesWhite dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-md font-futura ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none">
                        {chartConfig.chartTypeOptions.map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                              `${
                                active
                                  ? "text-lovesBlack bg-lovesWhite dark:bg-darkPrimaryText text-md font-futura-bold"
                                  : "text-lovesBlack dark:text-darkPrimaryText text-md font-futura"
                              } cursor-default select-none relative py-2 pl-10 pr-4`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-medium" : "font-normal"
                                  } block truncate`}
                                >
                                  {option.label}
                                </span>
                                {selected && (
                                  <span
                                    className={`${
                                      active
                                        ? "text-lovesPrimaryRed"
                                        : "text-lovesPrimaryRed"
                                    } absolute inset-y-0 left-0 flex items-center pl-3`}
                                  >
                                    <CheckIcon
                                      className="w-5 h-5"
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
              )}
            </div>
          </div>
        ) : (
          <h2 className="text-md font-futura-bold text-lovesWhite dark:text-darkPrimaryText bg-lovesBlack dark:bg-darkCompBg p-3">
            {title}
          </h2>
        )}

        {columnsToDisplay.length === 0 ? (
          <div className="p-4 text-center text-lovesWhite dark:text-darkPrimaryText text-md font-futura">
            No columns to display.
          </div>
        ) : displayOptions.showCharts ? (
          chartType === "Bar Chart" ? (
            <BarChart
              data={sortedData}
              xDataKey={xAxisField}
              groupByKey={groupByField}
              isScoreCard={isScoreCard}
              yDataKey={chartConfig?.yDataKey || "mtdScore"}
              {...chartConfig?.barChartProps}
            />
          ) : (
            <LineChartTime
              data={sortedData}
              xDataKey={xAxisField}
              isScoreCard={isScoreCard}
              yDataKey={chartConfig?.yDataKey || "mtdScore"}
              groupByKey={groupByField}
              {...chartConfig?.lineChartProps}
            />
          )
        ) : (
          <div className="flex-grow overflow-y-auto no-scrollbar">
            <table className="min-w-full divide-y divide-lovesBlack">
              <thead className="bg-lovesBlack dark:bg-darkCompBg">
                <tr>
                  {columnsToDisplay.map((col, idx) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-md font-futura text-lovesWhite dark:text-darkPrimaryText sm:pl-6 cursor-pointer ${getTextAlignment(
                        idx
                      )}`}
                      aria-sort={
                        sortConfig.key === col.key
                          ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSort(col.key);
                        }
                      }}
                      title="Click to sort"
                    >
                      <span
                        className={`flex ${
                          idx === 0 ? "justify-start" : "justify-center"
                        } items-center`}
                      >
                        {col.label}
                        <span className="ml-2 sm:inline hidden">
                          {getSortIndicator(col.key)}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-lovesBlack dark:divide-darkBorder bg-lovesWhite dark:bg-darkBg">
                {sortedData.map((item, rowIndex) => (
                  <tr key={item.id || rowIndex}>
                    {columnsToDisplay.map((col, colIndex) => (
                      <td
                        key={col.key}
                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-md font-futura no-underline hover:underline text-lovesBlack dark:text-lovesWhite sm:pl-6 ${getTextAlignment(
                          colIndex
                        )}`}
                      >
                        {item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
