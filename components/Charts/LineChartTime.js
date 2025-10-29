// Charts/LineChartTime.js
"use client";

import React, { useMemo, forwardRef, useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip"; // Ensure this component is compatible
import { useTheme } from "next-themes";

const averageScoreGoal = 95; // Number
const adherenceGoal = 88; // Number
const qualityGoal = 88; // Number
const defaultAHTGoalLow = 5 * 60 + 30; // 5:30 in seconds (for Customer Service, etc.)
const defaultAHTGoalHigh = 6 * 60 + 30; // 6:30 in seconds (for Customer Service, etc.)
// *** CORRECTED HELP DESK GOAL ***
const helpDeskAHTGoalLow = 4 * 60 + 30; // 4:30 in seconds
const helpDeskAHTGoalHigh = 5 * 60 + 30; // 5:30 in seconds

// Helper to get goal value/range based on metric name
function getGoalInfo(metricName, departmentTitle = "") {
  // Accept department title
  if (metricName === "Average Score")
    return { value: averageScoreGoal, type: "percent" };
  if (metricName === "Adherence")
    return { value: adherenceGoal, type: "percent" };
  if (metricName === "Quality") return { value: qualityGoal, type: "percent" };
  if (metricName === "Average Handle Time") {
    const isHelpDesk = departmentTitle === "Help Desk"; // Check department
    return {
      // *** Return values in MINUTES for the chart ***
      low: (isHelpDesk ? helpDeskAHTGoalLow : defaultAHTGoalLow) / 60,
      high: (isHelpDesk ? helpDeskAHTGoalHigh : defaultAHTGoalHigh) / 60,
      type: "time",
    };
  }
  return { value: null, low: null, high: null, type: "unknown" }; // Default if no match
}

// Helper to format minutes into MM:SS
const formatTimeTick = (valueInMinutes) => {
  if (
    valueInMinutes === null ||
    valueInMinutes === undefined ||
    isNaN(valueInMinutes)
  )
    return "";
  const totalSeconds = valueInMinutes * 60;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const CustomLegendContent = (props) => {
  const { payload, isDarkMode } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    // Apply Tailwind classes for the rounded box
    <div
      className="bg-white dark:bg-darkBg border-2 border-lovesBlack dark:border-darkCompBg rounded-lg shadow-md
                     px-2 py-0.5                        {/* Reduced padding */}
                     flex justify-center items-center
                     space-x-4                          {/* Reduced space */}
                     max-w-2xl sm:max-w-2xl md:max-w-2xl   {/* Max width (adjust xs/sm/md as needed) */}
                     mx-auto                            {/* Center the box */}
                    "
    >
      {payload.map((entry, index) => {
        const { color, value, type } = entry;
        let itemColor = color;
        if (value?.startsWith("Average:")) itemColor = "#FF8000";
        if (value?.startsWith("Goal:")) itemColor = "#9dca7e";

        return (
          <div
            key={`legend-item-${index}`}
            className="flex items-center space-x-1.5 " // Inner spacing
          >
            {/* Swatch */}
            {type === "line" ? (
              <span
                style={{
                  backgroundColor: itemColor,
                  width: "15px",
                  height: "3px",
                  display: "inline-block",
                }}
              ></span>
            ) : (
              <span
                style={{
                  backgroundColor: itemColor,
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>
            )}
            {/* Text */}
            <span
              className={`text-md sm:text-md font-futura-bold ${
                // Slightly smaller text might help
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const LineChartTime = forwardRef(
  // *** Receive metricName, departmentTitle, update yDataKey default ***
  (
    {
      data,
      xDataKey = "date",
      yDataKey = "value",
      metricName,
      departmentTitle,
      cardAverageStat,
      disableGrouping = true,
    },
    ref
  ) => {
    console.log(
      `[LineChartTime] Rendering for Metric: ${metricName}, Received departmentTitle: "${departmentTitle}"`
    );
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    // Get goal info based on the passed metricName and departmentTitle
    const goalInfo = getGoalInfo(metricName, departmentTitle);
    const isAHT = goalInfo.type === "time";

    const renderColoredDot = (props) => {
      /* ... remains the same ... */
    };

    // --- Chart Data Processing ---
    const chartData = useMemo(() => {
      // Filter out entries with null/undefined values for the yDataKey
      const filteredData = data.filter(
        (item) => item[yDataKey] !== null && item[yDataKey] !== undefined
      );

      // Sorting by date (assuming MM/DD format)
      return filteredData.sort((a, b) => {
        try {
          const [monthA, dayA] = a[xDataKey].split("/").map(Number);
          const [monthB, dayB] = b[xDataKey].split("/").map(Number);
          if (monthA !== monthB) return monthA - monthB;
          return dayA - dayB;
        } catch (e) {
          // Fallback for non-date keys or different formats
          const keyA = a[xDataKey]?.toString().toLowerCase() || "";
          const keyB = b[xDataKey]?.toString().toLowerCase() || "";
          return keyA.localeCompare(keyB);
        }
      });
    }, [data, xDataKey, yDataKey]);

    const averageForLine = useMemo(() => {
      if (
        cardAverageStat === "N/A" ||
        cardAverageStat === null ||
        cardAverageStat === undefined
      )
        return null;
      if (
        isAHT &&
        typeof cardAverageStat === "string" &&
        cardAverageStat.includes(":")
      ) {
        try {
          const [mins, secs] = cardAverageStat.split(":").map(Number);
          if (!isNaN(mins) && !isNaN(secs)) {
            return mins + secs / 60; // Convert MM:SS string to minutes
          }
        } catch {
          return null;
        }
      } else if (!isAHT && typeof cardAverageStat === "string") {
        try {
          const num = parseFloat(cardAverageStat.replace("%", ""));
          return isNaN(num) ? null : num; // Parse percentage string
        } catch {
          return null;
        }
      } else if (
        typeof cardAverageStat === "number" &&
        isFinite(cardAverageStat)
      ) {
        return cardAverageStat; // Use number directly
      }
      return null; // Fallback
    }, [cardAverageStat, isAHT]);

    // Use the original string stat for the legend display
    const formattedAverageForLegend =
      cardAverageStat !== "N/A" ? cardAverageStat : "N/A";
    // Calculate average from the processed chartData
    const average = useMemo(() => {
      if (!chartData || chartData.length === 0) return isAHT ? null : 0; // Return null for AHT if no data
      const total = chartData.reduce((sum, item) => sum + item[yDataKey], 0);
      return chartData.length ? total / chartData.length : 0;
    }, [chartData, yDataKey, isAHT]);

    // Format average for display
    const formattedAverage = isAHT
      ? average !== null
        ? formatTimeTick(average)
        : "N/A"
      : average !== null
      ? average.toFixed(2)
      : "N/A";

    // --- Y-Axis Domain and Ticks ---
    const { yAxisDomain, yAxisTicks } = useMemo(() => {
      if (!chartData || chartData.length === 0)
        return { yAxisDomain: [0, 1], yAxisTicks: [0, 1] };

      const yValues = chartData.map((item) => item[yDataKey]);
      let dataMin = Math.min(...yValues);
      let dataMax = Math.max(...yValues);

      let domain,
        ticks = [];

      if (isAHT) {
        const goalLow = goalInfo.low ?? dataMin; // Use dataMin if goalLow is null
        const goalHigh = goalInfo.high ?? dataMax; // Use dataMax if goalHigh is null
        const domainMin = Math.min(dataMin, goalLow) - 0.5; // Add padding (0.5 min)
        const domainMax = Math.max(dataMax, goalHigh) + 0.5; // Add padding (0.5 min)
        domain = [Math.max(0, domainMin), domainMax]; // Ensure min is not negative

        const startTick = Math.floor(domain[0] * 2) / 2;
        const endTick = Math.ceil(domain[1] * 2) / 2;
        for (let val = startTick; val <= endTick; val += 0.5) {
          ticks.push(val);
        }
      } else {
        // Percentages
        const goalValue = goalInfo.value;
        // Include goal in min/max calculation only if it exists
        const minCheck =
          goalValue !== null ? Math.min(dataMin, goalValue) : dataMin;
        const maxCheck =
          goalValue !== null ? Math.max(dataMax, goalValue) : dataMax;

        const domainMin = Math.floor(minCheck) - 2; // Add padding (2%)
        const domainMax = Math.ceil(maxCheck) + 2; // Add padding (2%)
        domain = [Math.max(0, domainMin), Math.min(105, domainMax)]; // Cap at 0-105%

        const range = domain[1] - domain[0];
        const step = range <= 20 ? 2 : range <= 50 ? 5 : 10;
        const startTick = Math.ceil(domain[0] / step) * step; // Start from first step inside domain
        const endTick = Math.floor(domain[1] / step) * step; // End at last step inside domain

        for (let i = startTick; i <= endTick; i += step) {
          if (i >= domain[0] && i <= domain[1]) ticks.push(i);
        }
        // Ensure domain boundaries are included if needed or if few ticks
        if (!ticks.includes(domain[0]) && ticks.length > 0)
          ticks.unshift(Math.floor(domain[0]));
        if (!ticks.includes(domain[1]) && ticks.length > 0)
          ticks.push(Math.ceil(domain[1]));
        if (ticks.length < 2)
          ticks = [Math.floor(domain[0]), Math.ceil(domain[1])]; // Ensure at least two ticks

        ticks = [...new Set(ticks)].sort((a, b) => a - b); // Remove duplicates and sort
      }
      // Ensure ticks array is not empty
      if (ticks.length === 0) {
        ticks = [Math.floor(domain[0]), Math.ceil(domain[1])];
      }

      return { yAxisDomain: domain, yAxisTicks: ticks };
    }, [chartData, yDataKey, isAHT, goalInfo]);

    // --- Custom Ticks ---
    const CustomYAxisTick = (props) => {
      const { x, y, payload, isDarkMode } = props;
      // Use the component's isAHT flag
      const text = isAHT ? formatTimeTick(payload.value) : payload.value;
      return (
        <text
          x={x}
          y={y}
          dx={-10}
          dy={4}
          textAnchor="end"
          fill={isDarkMode ? "#E0E0E0" : "#000000"}
          className="font-futura-bold text-xs sm:text-sm"
        >
          {text}
        </text>
      );
    };

    const CustomXAxisTick = (props) => {
      const { x, y, payload, angle, isDarkMode } = props;
      const transform = angle ? `rotate(${angle}, ${x}, ${y})` : undefined;
      const textAnchor = angle ? "end" : "middle";
      const value = payload.value || "";
      return (
        <text
          x={x}
          y={y}
          dy={16}
          transform={transform}
          textAnchor={textAnchor}
          fill={isDarkMode ? "#E0E0E0" : "#000000"}
          className="font-futura-bold text-xs sm:text-sm"
        >
          {/* Basic truncate */}
          {value.length > 10 ? `${value.substring(0, 8)}...` : value}
        </text>
      );
    };

    const shouldRotateLabels = chartData.length > 10; // Adjust threshold if needed
    // const shouldPadLabels = chartData.length > 7; // Padding handled by margin/interval

    // --- Legend Payload ---
    const legendPayload = useMemo(() => {
      const basePayload = [
        {
          value: metricName,
          type: "circle",
          color: isDarkMode ? "#ccc" : "#000",
        },
        // *** Use formattedAverageForLegend (original string) ***
        {
          value: `Average: ${formattedAverageForLegend}`,
          type: "line",
          color: "#FF8000",
        },
      ];
      // ... (Goal info remains the same) ...
      if (
        goalInfo.type === "time" &&
        goalInfo.low !== null &&
        goalInfo.high !== null
      ) {
        basePayload.push({
          value: `Goal: ${formatTimeTick(goalInfo.low)}`,
          type: "line",
          color: "#9dca7e",
        });
        basePayload.push({
          value: `Goal: ${formatTimeTick(goalInfo.high)}`,
          type: "line",
          color: "#9dca7e",
        });
      } else if (goalInfo.type === "percent" && goalInfo.value !== null) {
        basePayload.push({
          value: `Goal: ${goalInfo.value}%`,
          type: "line",
          color: "#9dca7e",
        });
      }
      return basePayload;
    }, [metricName, formattedAverageForLegend, goalInfo, isDarkMode]); // Use formattedAverageForLegend

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      /* ... mobile check ... */
    }, []);

    return (
      <section ref={ref} className="flex flex-grow h-full px-2">
        <div className="w-full h-full bg-lovesWhite border-2 border-lovesBlack dark:bg-darkBg shadow-sm dark:shadow-darkCompBg dark:border-darkCompBg rounded-lg">
          <ResponsiveContainer width="100%" height="120%">
            <ComposedChart
              data={chartData} // Use filtered/sorted real data
              margin={{
                top: isMobile ? 20 : 30, // Adjusted top margin
                right: isMobile ? 15 : 30, // Adjusted right margin
                left: isMobile ? 0 : 15, // Adjusted left margin
                bottom: isMobile ? 45 : shouldRotateLabels ? 60 : 40, // More bottom margin for legend/rotated labels
              }}
            >
              {/* Defs (shadow, gradients) */}
              <defs>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="2"
                    dy="2"
                    stdDeviation="3"
                    floodColor={isDarkMode ? "#282828" : "#999"}
                    floodOpacity="0.5"
                  />
                </filter>
                {/* Gradient definition */}
                {isAHT &&
                  goalInfo.low !== null &&
                  goalInfo.high !== null &&
                  yAxisDomain[1] > yAxisDomain[0] && ( // Check domain diff > 0
                    <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF0000" />
                      <stop
                        offset={`${
                          Math.max(
                            0,
                            Math.min(
                              100,
                              (yAxisDomain[1] - goalInfo.high) /
                                (yAxisDomain[1] - yAxisDomain[0])
                            )
                          ) * 100
                        }%`}
                        stopColor="#FF0000"
                      />
                      <stop
                        offset={`${
                          Math.max(
                            0,
                            Math.min(
                              100,
                              (yAxisDomain[1] - goalInfo.high) /
                                (yAxisDomain[1] - yAxisDomain[0])
                            )
                          ) * 100
                        }%`}
                        stopColor="#9dca7e"
                      />
                      <stop
                        offset={`${
                          Math.max(
                            0,
                            Math.min(
                              100,
                              (yAxisDomain[1] - goalInfo.low) /
                                (yAxisDomain[1] - yAxisDomain[0])
                            )
                          ) * 100
                        }%`}
                        stopColor="#9dca7e"
                      />
                      <stop
                        offset={`${
                          Math.max(
                            0,
                            Math.min(
                              100,
                              (yAxisDomain[1] - goalInfo.low) /
                                (yAxisDomain[1] - yAxisDomain[0])
                            )
                          ) * 100
                        }%`}
                        stopColor="#FF0000"
                      />
                      <stop offset="100%" stopColor="#FF0000" />
                    </linearGradient>
                  )}
                {!isAHT &&
                  goalInfo.value !== null &&
                  yAxisDomain[1] > yAxisDomain[0] && ( // Check domain diff > 0
                    <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9dca7e" />
                      <stop
                        offset={`${
                          Math.max(
                            0,
                            Math.min(
                              100,
                              (yAxisDomain[1] - goalInfo.value) /
                                (yAxisDomain[1] - yAxisDomain[0])
                            )
                          ) * 100
                        }%`}
                        stopColor="#9dca7e"
                      />
                      <stop
                        offset={`${
                          Math.max(
                            0,
                            Math.min(
                              100,
                              (yAxisDomain[1] - goalInfo.value) /
                                (yAxisDomain[1] - yAxisDomain[0])
                            )
                          ) * 100
                        }%`}
                        stopColor="#FF0000"
                      />
                      <stop offset="100%" stopColor="#FF0000" />
                    </linearGradient>
                  )}
                {/* Fallback Gradient */}
                {(goalInfo.value === null && goalInfo.low === null) ||
                  (yAxisDomain[1] <= yAxisDomain[0] && ( // Use fallback if no goal or invalid domain
                    <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={isDarkMode ? "#ccc" : "#555"}
                      />
                      <stop
                        offset="100%"
                        stopColor={isDarkMode ? "#ccc" : "#555"}
                      />
                    </linearGradient>
                  ))}
              </defs>

              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#555" : "#ccc"}
              />
              <XAxis
                dataKey={xDataKey} // "date"
                type="category"
                stroke={isDarkMode ? "#E0E0E0" : "#000"}
                tick={
                  <CustomXAxisTick
                    angle={shouldRotateLabels ? -45 : 0}
                    isDarkMode={isDarkMode}
                  />
                }
                interval="preserveStartEnd" // Show first and last tick
                // Adjust interval based on number of data points for clarity
                minTickGap={isMobile ? 15 : 5} // Allow ticks closer together if needed
                // padding={{ left: 10, right: 10 }} // Removed explicit padding
                height={shouldRotateLabels ? 40 : 20} // Adjust height for rotated labels
              />
              <YAxis
                type="number"
                allowDecimals={isAHT} // Allow decimals only for AHT (minutes)
                domain={yAxisDomain}
                ticks={yAxisTicks}
                tickFormatter={isAHT ? formatTimeTick : undefined}
                tick={<CustomYAxisTick isDarkMode={isDarkMode} />}
                width={isMobile ? 35 : 50} // Adjust width for labels
              />
              <Tooltip
                content={
                  <CustomTooltip
                    average={formattedAverageForLegend} // Pass formatted average
                    goal={
                      goalInfo.type === "time"
                        ? `${formatTimeTick(goalInfo.low)} - ${formatTimeTick(
                            goalInfo.high
                          )}`
                        : goalInfo.value !== null
                        ? `${goalInfo.value}%`
                        : "N/A"
                    }
                    isDarkMode={isDarkMode}
                    xDataKey={xDataKey}
                    isAHT={isAHT} // Pass isAHT for potential value formatting
                  />
                }
                // ... contentStyle, itemStyle, labelStyle ...
              />
              <Legend
                // Pass the custom component to the 'content' prop
                content={<CustomLegendContent isDarkMode={isDarkMode} />}
                // Pass the calculated payload to the custom component
                payload={legendPayload}
                // Adjust verticalAlign and wrapperStyle to position the box itself
                verticalAlign="bottom"
                wrapperStyle={{
                  paddingTop: "0px", // Add some space above the legend box
                  bottom: isMobile
                    ? "15px"
                    : shouldRotateLabels
                    ? "15px"
                    : "0px", // Fine-tune vertical position
                }}
              />

              <Line
                dataKey={yDataKey} // "value"
                stroke="url(#lineColor)"
                dot={false} //renderColoredDot} // Disable dots for cleaner look?
                activeDot={{
                  r: 6,
                  fill: isDarkMode ? "#eee" : "#333",
                  stroke: isDarkMode ? "#999" : "#ccc",
                  strokeWidth: 1,
                }}
                strokeWidth={3}
                filter="url(#shadow)"
                name={metricName}
                connectNulls={true}
              />

              {/* Reference Lines for Goals */}
              {goalInfo.type === "time" && goalInfo.low !== null && (
                <ReferenceLine
                  y={goalInfo.low}
                  stroke="#9dca7e"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  // label={{
                  //   position: "insideTopRight",
                  //   value: `Goal ${formatTimeTick(goalInfo.low)}`,
                  //   fill: "#9dca7e",
                  //   fontSize: 10,
                  // }}
                />
              )}
              {goalInfo.type === "time" && goalInfo.high !== null && (
                <ReferenceLine
                  y={goalInfo.high}
                  stroke="#9dca7e"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  // label={{
                  //   position: "insideBottomRight",
                  //   value: `Goal ${formatTimeTick(goalInfo.high)}`,
                  //   fill: "#9dca7e",
                  //   fontSize: 10,
                  // }}
                />
              )}
              {goalInfo.type === "percent" && goalInfo.value !== null && (
                <ReferenceLine
                  y={goalInfo.value}
                  stroke="#9dca7e"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  // label={{
                  //   position: "insideTopRight",
                  //   value: `Goal ${goalInfo.value}%`,
                  //   fill: "#9dca7e",
                  //   fontSize: 10,
                  // }}
                />
              )}
              {/* Reference Line for Average */}
              {average !== null && (
                <ReferenceLine
                  y={averageForLine} // Use numeric average for line position
                  stroke="#FF8000"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  // label={{
                  //     position: 'left',
                  //     // Use formatted string for label
                  //     value: `Avg ${formattedAverageForLegend}`,
                  //     fill: "#FF8000",
                  //     fontSize: 10
                  //  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
);

LineChartTime.displayName = "LineChartTime";

export default LineChartTime;
