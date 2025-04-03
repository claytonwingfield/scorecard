// TeamTable.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { defaultSort, upArrow, downArrow } from "@/components/Icons/icons";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import BarChart from "@/components/Charts/BarChart";
import LineChartTime from "@/components/Charts/LineChartTime";

export default function TeamTable({
  title,
  activeFilters,
  data,
  hiddenColumns,
  displayOptions,
  onHeightChange,
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const xAxisField = "agent";
  const [groupByField, setGroupByField] = useState(null);
  const [chartType, setChartType] = useState("Bar Chart");
  const [agentFilter, setAgentFilter] = useState("");
  const containerRef = useRef(null);

  const selectedManagers = activeFilters
    .filter((filter) => filter.type === "Manager")
    .map((filter) => filter.label);

  const selectedSupervisors = activeFilters
    .filter((filter) => filter.type === "Supervisor")
    .map((filter) => filter.label);

  const selectedAgents = activeFilters
    .filter((filter) => filter.type === "Agent")
    .map((filter) => filter.label);

  const filteredData = data.filter((item) => {
    const managerMatch =
      selectedManagers.length === 0 || selectedManagers.includes(item.manager);
    const supervisorMatch =
      selectedSupervisors.length === 0 ||
      selectedSupervisors.includes(item.supervisor);
    const agentMatch =
      (selectedAgents.length === 0 || selectedAgents.includes(item.agent)) &&
      (agentFilter === "" ||
        item.agent.toLowerCase().includes(agentFilter.toLowerCase()));
    return managerMatch && supervisorMatch && agentMatch;
  });

  const convertToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const key = sortConfig.key;
        if (key === "AHT") {
          const aTime = convertToSeconds(a[key]);
          const bTime = convertToSeconds(b[key]);
          return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
        }

        return sortConfig.direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return defaultSort;
    }
    return sortConfig.direction === "asc" ? upArrow : downArrow;
  };

  const columnsToDisplay = [
    { key: "agent", label: "Agent" },
    { key: "mtdScore", label: "Score" },
    { key: "Adherence", label: "Adherence" },
    { key: "AHT", label: "AHT" },
    { key: "Quality", label: "Quality" },
  ].filter((col) => !hiddenColumns.includes(col.key));

  const getTextAlignment = (index) => {
    return index === 0 ? "text-left" : "text-center";
  };

  const groupByOptions = [
    { value: "", label: "Score" },
    { value: "Adherence", label: "Adherence" },
    { value: "AHT", label: "AHT" },
    { value: "Quality", label: "Quality" },
  ];
  const chartTypeOptions = [
    { value: "Bar Chart", label: "Bar Chart" },
    { value: "Line Chart", label: "Line Chart" },
  ];

  const yAxisField = groupByField || "mtdScore";

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden dark:ring-0 ring-1 ring-lovesBlack rounded-lg bg-lovesBlack dark:bg-darkCompBg"
    >
      <div className="flex flex-col h-full">
        {displayOptions.showCharts ? (
          <div
            className={`flex ${
              isMobile
                ? "flex-col items-center" // MOBILE: Title on top
                : "flex-row items-center justify-between" // DESKTOP: Title on left, listboxes on right
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
              <div className={`${isMobile ? "w-40" : "w-48"}`}>
                <Listbox
                  value={groupByField || ""}
                  onChange={(value) => setGroupByField(value || null)}
                >
                  <div className="relative">
                    <Listbox.Button
                      className={`bg-lovesWhite dark:bg-darkBg relative w-full
                        ${
                          isMobile ? "py-2 text-md" : "py-2 text-md"
                        } pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none font-futura`}
                    >
                      <span className="block truncate text-md font-futura">
                        {
                          groupByOptions.find(
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
                      {groupByOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `${
                              active
                                ? "text-lovesBlack bg-lovesWhite dark:bg-darkCompBg text-md font-futura-bold"
                                : "text-lovesBlack dark:text-darkPrimaryText text-md font-futura"
                            } cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={option.value}
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
                              {selected ? (
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
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              <div className={`${isMobile ? "w-40" : "w-48"}`}>
                <Listbox value={chartType} onChange={setChartType}>
                  <div className="relative">
                    <Listbox.Button
                      className={`bg-lovesWhite dark:bg-darkBg relative w-full
                        ${
                          isMobile ? "py-2 text-md" : "py-2 text-md"
                        } pl-3 pr-10 text-left rounded-md shadow-md cursor-default focus:outline-none font-futura`}
                    >
                      {" "}
                      <span className="block truncate">{chartType}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon
                          className="w-5 h-5 text-lovesBlack dark:text-darkPrimaryText"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-lovesWhite dark:bg-darkBg shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-lovesBlack ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {chartTypeOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `${
                              active
                                ? "text-lovesBlack bg-lovesWhite dark:bg-darkCompBg text-md font-futura-bold"
                                : "text-lovesBlack dark:text-darkPrimaryText text-md font-futura"
                            } cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={option.value}
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
                              {selected ? (
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
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
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
              yDataKey={yAxisField}
              groupByOptions={groupByOptions}
              groupByKey={groupByField}
              isSupervisorTable={false}
              disableGrouping={true}
            />
          ) : (
            <LineChartTime
              data={sortedData}
              xDataKey={xAxisField}
              yDataKey={yAxisField}
              groupByKey={groupByField}
              isSupervisorTable={false}
              groupByOptions={groupByOptions}
              disableGrouping={true}
            />
          )
        ) : (
          <div className="flex-grow overflow-y-auto no-scrollbar">
            <table className="min-w-full divide-y divide-lovesBlack">
              <thead className="bg-lovesBlack dark:bg-darkCompBg">
                <tr>
                  {columnsToDisplay.map((col, index) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`whitespace-nowrap py-3.5 pl-4 pr-3 text-md font-futura text-lovesWhite dark:text-darkPrimaryText sm:pl-6 cursor-pointer ${getTextAlignment(
                        index
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
                          index === 0 ? "justify-start" : "justify-center"
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
                        className={`whitespace-nowrap py-4 pl-4 pr-3 text-md font-futura no-underline hover:underline text-lovesBlack dark:text-darkPrimaryText sm:pl-6 ${getTextAlignment(
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
