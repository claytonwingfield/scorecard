"use client";
import React, { useMemo, forwardRef } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useTheme } from "next-themes";

const averageScoreGoal = "95%";
const adherenceGoal = "88%";
const qualityGoal = "88%";
const averageHandleTimeGoal = "5:30 - 6:30";

// Returns goal value (as a string) based on the metric key.
function getGoalForMetric(yDataKey) {
  if (yDataKey === "mtdScore") return averageScoreGoal;
  if (yDataKey === "adherence") return adherenceGoal;
  if (yDataKey === "qualityTeam") return qualityGoal;
  if (yDataKey === "AHT" || yDataKey === "ahtTeam")
    return averageHandleTimeGoal;
  return "";
}

const LineChart = forwardRef(
  (
    {
      data,
      xDataKey,
      yDataKey,
      groupByKey,
      isScoreCard = false,
      disableGrouping = false,
    },
    ref
  ) => {
    const legendNames = {
      mtdScore: "Score",
      qualityTeam: "Quality",
      AHT: "AHT",
      ahtTeam: "AHT",
      adherence: "Adherence",
    };
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    // Converts a "mm:ss" string into minutes (e.g., "5:30" -> 5.5)
    const convertTimeToMinutes = (timeStr) => {
      const [minutes, seconds] = timeStr.split(":");
      return parseInt(minutes, 10) + parseInt(seconds, 10) / 60;
    };

    // For AHT, we use a fixed domain from 5:00 to 7:00.
    const fixedAHTDomain = [
      convertTimeToMinutes("5:00"),
      convertTimeToMinutes("7:00"),
    ];

    const chartData = useMemo(() => {
      const processedData = data.map((item) => ({
        ...item,
        [yDataKey]:
          yDataKey === "AHT" || yDataKey === "ahtTeam"
            ? convertTimeToMinutes(item[yDataKey] || "0:00")
            : item[yDataKey]
            ? parseFloat(item[yDataKey].replace("%", ""))
            : 0,
      }));
      let finalData;
      if (groupByKey && !disableGrouping) {
        const groupedData = {};
        processedData.forEach((item) => {
          const groupKey = item[groupByKey];
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = { ...item, count: 1 };
          } else {
            groupedData[groupKey][yDataKey] += item[yDataKey];
            groupedData[groupKey].count += 1;
          }
        });
        finalData = Object.values(groupedData).map((item) => ({
          [xDataKey]: item[groupByKey],
          [yDataKey]: item[yDataKey] / item.count,
        }));
      } else {
        finalData = processedData.map((item) => ({
          [xDataKey]: item[xDataKey],
          [yDataKey]: item[yDataKey],
        }));
      }
      return finalData.sort((a, b) => {
        if (xDataKey === "date") {
          const dayA = parseInt(a[xDataKey].split("/")[1], 10);
          const dayB = parseInt(b[xDataKey].split("/")[1], 10);
          return dayA - dayB;
        } else {
          const keyA = a[xDataKey]?.toString().toLowerCase();
          const keyB = b[xDataKey]?.toString().toLowerCase();
          return keyA.localeCompare(keyB);
        }
      });
    }, [data, xDataKey, yDataKey, groupByKey, disableGrouping]);

    const average = useMemo(() => {
      const total = chartData.reduce((sum, item) => sum + item[yDataKey], 0);
      return chartData.length ? (total / chartData.length).toFixed(2) : "0.00";
    }, [chartData, yDataKey]);

    function computeTicks(data, yDataKey) {
      if (yDataKey === "AHT" || yDataKey === "ahtTeam") {
        const [min, max] = fixedAHTDomain;
        const ticks = [];
        for (let val = min; val <= max; val += 0.5) {
          ticks.push(val);
        }
        return ticks;
      } else {
        const values = data.map((d) => d[yDataKey]);
        const rawMin = Math.min(...values);
        const rawMax = Math.max(...values);
        const range = rawMax - rawMin;
        let step;
        if (range < 10) step = 1;
        else if (range < 50) step = 5;
        else step = 10;
        const minVal = Math.floor(rawMin / step) * step;
        const maxVal = Math.ceil(rawMax / step) * step;
        const ticks = [];
        for (let i = minVal; i <= maxVal; i += step) {
          ticks.push(i);
        }
        return ticks;
      }
    }

    // For non-AHT charts, force the y-axis domain to include the goal value.
    const yValues = chartData.map((item) => item[yDataKey]);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    let goalValue;
    if (yDataKey === "AHT" || yDataKey === "ahtTeam") {
      // For AHT, goals are 5:30 and 6:30.
      goalValue = null;
    } else if (yDataKey === "mtdScore") {
      goalValue = parseFloat(averageScoreGoal.replace("%", ""));
    } else if (yDataKey === "adherence") {
      goalValue = parseFloat(adherenceGoal.replace("%", ""));
    } else if (yDataKey === "qualityTeam") {
      goalValue = parseFloat(qualityGoal.replace("%", ""));
    }

    const yAxisDomain =
      yDataKey === "AHT" || yDataKey === "ahtTeam"
        ? fixedAHTDomain
        : [
            Math.floor(Math.min(yMin, goalValue)),
            Math.ceil(Math.max(yMax, goalValue)),
          ];

    // For AHT, compute fixed gradient offsets.
    let computedHighOffset, computedLowOffset;
    if (yDataKey === "AHT" || yDataKey === "ahtTeam") {
      const fixedMin = fixedAHTDomain[0];
      const fixedMax = fixedAHTDomain[1];
      computedHighOffset =
        ((fixedMax - convertTimeToMinutes("6:30")) / (fixedMax - fixedMin)) *
        100;
      computedLowOffset =
        ((fixedMax - convertTimeToMinutes("5:30")) / (fixedMax - fixedMin)) *
        100;
    }
    // For non-AHT charts, compute goalOffset (used in gradient).
    const goalOffset =
      yDataKey === "AHT" || yDataKey === "ahtTeam"
        ? null
        : ((yMax - goalValue) / (yMax - yMin)) * 100;

    // For AHT, format ticks as mm:ss.
    const formatTimeTick = (value) => {
      const minutes = Math.floor(value);
      const seconds = Math.round((value - minutes) * 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const CustomYAxisTick = (props) => {
      const { x, y, payload, isDarkMode } = props;
      const text =
        yDataKey === "AHT" || yDataKey === "ahtTeam"
          ? formatTimeTick(payload.value)
          : payload.value;
      return (
        <text
          x={x}
          y={y}
          dx={-10}
          dy={4}
          textAnchor="end"
          fill={isDarkMode ? "#fff" : "#000"}
          className="font-futura-bold"
        >
          {text}
        </text>
      );
    };

    const CustomXAxisTick = ({ x, y, payload, angle, isDarkMode }) => {
      const transform = angle ? `rotate(${angle}, ${x}, ${y})` : undefined;
      const textAnchor = angle ? "end" : "middle";
      return (
        <text
          x={x}
          y={y}
          dy={16}
          transform={transform}
          textAnchor={textAnchor}
          fill={isDarkMode ? "#fff" : "#000"}
          className="font-futura-bold"
        >
          {payload.value.length > 15
            ? `${payload.value.substring(0, 13)}...`
            : payload.value}
        </text>
      );
    };

    const shouldRotateLabels = chartData.length > 7;
    const shouldPadLabels = chartData.length > 7;

    // Build the legend payload conditionally.
    const legendPayload =
      yDataKey === "AHT" || yDataKey === "ahtTeam"
        ? [
            {
              value: legendNames[yDataKey] || yDataKey,
              type: "circle",
              color: isDarkMode ? "#ccc" : "#000",
            },
            {
              value: `Average: ${average}`,
              type: "line",
              color: "#FF0000",
            },
            {
              value: "Goal: 5:30",
              type: "line",
              color: "#9dca7e",
            },
            {
              value: "Goal: 6:30",
              type: "line",
              color: "#9dca7e",
            },
          ]
        : [
            {
              value: legendNames[yDataKey] || yDataKey,
              type: "circle",
              color: isDarkMode ? "#ccc" : "#000",
            },
            {
              value: `Average: ${average}`,
              type: "line",
              color: "#FF0000",
            },
            {
              value: `Goal: ${getGoalForMetric(yDataKey)}`,
              type: "line",
              color: "#9dca7e",
            },
          ];

    return (
      <section ref={ref} className="flex flex-grow h-full px-2">
        <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg">
          <ResponsiveContainer width="100%" height="95%">
            <ComposedChart
              data={chartData}
              margin={{ top: 40, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                {yDataKey === "AHT" || yDataKey === "ahtTeam" ? (
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    {/* Above 6:30 and below 5:30 are red; in between is green */}
                    <stop offset="0%" stopColor="#FF0000" />
                    <stop
                      offset={`${computedHighOffset}%`}
                      stopColor="#FF0000"
                    />
                    <stop
                      offset={`${computedHighOffset}%`}
                      stopColor="#9dca7e"
                    />
                    <stop
                      offset={`${computedLowOffset}%`}
                      stopColor="#9dca7e"
                    />
                    <stop
                      offset={`${computedLowOffset}%`}
                      stopColor="#FF0000"
                    />
                    <stop offset="100%" stopColor="#FF0000" />
                  </linearGradient>
                ) : (
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9dca7e" />
                    <stop offset={`${goalOffset}%`} stopColor="#9dca7e" />
                    <stop offset={`${goalOffset}%`} stopColor="#FF0000" />
                    <stop offset="100%" stopColor="#FF0000" />
                  </linearGradient>
                )}

                <filter
                  id="areaShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="2"
                    dy="2"
                    stdDeviation="3"
                    floodColor="#000"
                  />
                </filter>
              </defs>

              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#ccc" : "#000"}
              />
              <XAxis
                dataKey={xDataKey}
                type="category"
                stroke={isDarkMode ? "#fff" : "#000"}
                tick={
                  <CustomXAxisTick
                    angle={shouldRotateLabels ? -45 : 0}
                    isDarkMode={isDarkMode}
                  />
                }
                interval={0}
                padding={
                  shouldPadLabels
                    ? { left: 0, right: 0 }
                    : { left: 50, right: 50 }
                }
              />
              <YAxis
                type="number"
                allowDecimals={false}
                ticks={computeTicks(chartData, yDataKey)}
                domain={
                  yDataKey === "AHT" || yDataKey === "ahtTeam"
                    ? fixedAHTDomain
                    : [
                        (dataMin) => Math.floor(dataMin),
                        (dataMax) => Math.ceil(dataMax),
                      ]
                }
                tick={<CustomYAxisTick isDarkMode={isDarkMode} />}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    average={average}
                    goal={getGoalForMetric(yDataKey)}
                    isDarkMode={isDarkMode}
                    xDataKey={xDataKey}
                  />
                }
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  borderColor: isDarkMode ? "#fff" : "#000",
                  borderRadius: "0.5rem",
                  color: isDarkMode ? "#fff" : "#000",
                }}
                itemStyle={{ color: isDarkMode ? "#fff" : "#000" }}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000" }}
              />
              <Legend
                content={() => (
                  <div className="flex justify-center items-center space-x-4">
                    {legendPayload.map((entry, index) => (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center"
                      >
                        {entry.type === "line" ? (
                          <div
                            style={{
                              width: 20,
                              height: 2,
                              backgroundColor: entry.color,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: entry.color,
                            }}
                          />
                        )}
                        <span
                          className="ml-2 text-md font-futura-bold"
                          style={{
                            color:
                              entry.type === "circle"
                                ? isDarkMode
                                  ? "#ccc"
                                  : "#000"
                                : entry.color,
                          }}
                        >
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop:
                    xDataKey === "date"
                      ? "20px"
                      : shouldRotateLabels
                      ? "80px"
                      : "10px",
                }}
              />

              <Area
                dataKey={yDataKey}
                stroke={
                  yDataKey === "AHT" || yDataKey === "ahtTeam"
                    ? "none"
                    : "url(#lineColor)"
                }
                activeDot={{ r: 8 }}
                fill="url(#areaColor)"
                filter="url(#areaShadow)"
                strokeWidth={
                  yDataKey === "AHT" || yDataKey === "ahtTeam" ? 0 : 3
                }
                name={legendNames[yDataKey] || yDataKey}
                fillOpacity={1}
              />

              {/* Reference Lines for non-AHT charts */}
              {yDataKey === "mtdScore" && (
                <ReferenceLine
                  y={parseFloat(averageScoreGoal.replace("%", ""))}
                  stroke="#9dca7e"
                  strokeWidth={4}
                />
              )}
              {yDataKey === "adherence" && (
                <ReferenceLine
                  y={parseFloat(adherenceGoal.replace("%", ""))}
                  stroke="#9dca7e"
                  strokeWidth={4}
                />
              )}
              {yDataKey === "qualityTeam" && (
                <ReferenceLine
                  y={parseFloat(qualityGoal.replace("%", ""))}
                  stroke="#9dca7e"
                  strokeWidth={4}
                />
              )}
              {/* For AHT, display two reference lines */}
              {(yDataKey === "AHT" || yDataKey === "ahtTeam") && (
                <>
                  <ReferenceLine
                    y={convertTimeToMinutes("5:30")}
                    stroke="#9dca7e"
                    strokeWidth={4}
                  />
                  <ReferenceLine
                    y={convertTimeToMinutes("6:30")}
                    stroke="#9dca7e"
                    strokeWidth={4}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
);

LineChart.displayName = "LineChart";

export default LineChart;
