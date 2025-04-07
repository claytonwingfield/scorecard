"use client";

import React, { useMemo, forwardRef, useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { useTheme } from "next-themes";

const averageScoreGoal = "95%";
const adherenceGoal = "88%";
const qualityGoal = "88%";
const averageHandleTimeGoal = "5:30 - 6:30";

function getGoalForMetric(yDataKey) {
  if (yDataKey === "mtdScore") return averageScoreGoal;
  if (yDataKey === "Adherence") return adherenceGoal;
  if (yDataKey === "Quality") return qualityGoal;
  if (yDataKey === "AHT") return averageHandleTimeGoal;
  return "";
}

const BarChart = forwardRef(
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
      ahtTeam: "AHT",
    };

    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const chartData = useMemo(() => {
      const processedData = data.map((item) => ({
        ...item,
        [yDataKey]: parseFloat(
          item[yDataKey].replace("%", "").replace(":", ".")
        ),
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
        const keyA = (a[xDataKey]?.toString() ?? "").toLowerCase();
        const keyB = (b[xDataKey]?.toString() ?? "").toLowerCase();
        return keyA.localeCompare(keyB);
      });
    }, [data, xDataKey, yDataKey, groupByKey, disableGrouping]);

    function computeTicks(data, yKey) {
      if (!data.length) return [];
      const values = data.map((d) => d[yKey]);
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

    const getBarFill = (entry) => {
      let goalValue;
      if (yDataKey === "mtdScore") {
        goalValue = parseFloat(averageScoreGoal.replace("%", ""));
        return entry[yDataKey] >= goalValue ? "#9dca7e" : "#FF0000";
      } else if (yDataKey === "Adherence") {
        goalValue = parseFloat(adherenceGoal.replace("%", ""));
        return entry[yDataKey] >= goalValue ? "#9dca7e" : "#FF0000";
      } else if (yDataKey === "Quality") {
        goalValue = parseFloat(qualityGoal.replace("%", ""));
        return entry[yDataKey] >= goalValue ? "#9dca7e" : "#FF0000";
      } else if (yDataKey === "AHT" || yDataKey === "ahtTeam") {
        const [low, high] = averageHandleTimeGoal.split(" - ");
        const lowVal = parseFloat(low.replace(":", "."));
        const highVal = parseFloat(high.replace(":", "."));
        return entry[yDataKey] >= lowVal && entry[yDataKey] <= highVal
          ? "#9dca7e"
          : "#FF0000";
      }
      return "#FF0000";
    };

    const average = useMemo(() => {
      if (!chartData.length) return "0.00";
      const total = chartData.reduce((sum, item) => sum + item[yDataKey], 0);
      return (total / chartData.length).toFixed(2);
    }, [chartData, yDataKey]);

    const yValues = chartData.map((item) => item[yDataKey]);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    let goalValue;
    if (yDataKey === "mtdScore") {
      goalValue = parseFloat(averageScoreGoal.replace("%", ""));
    } else if (yDataKey === "Adherence") {
      goalValue = parseFloat(adherenceGoal.replace("%", ""));
    } else if (yDataKey === "Quality") {
      goalValue = parseFloat(qualityGoal.replace("%", ""));
    } else if (yDataKey === "AHT" || yDataKey === "ahtTeam") {
      const [low, high] = averageHandleTimeGoal.split(" - ");
      const lowVal = parseFloat(low.replace(":", "."));
      const highVal = parseFloat(high.replace(":", "."));
      goalValue = (lowVal + highVal) / 2;
    }

    const goalOffset = ((yMax - goalValue) / (yMax - yMin)) * 100;
    const shouldRotateLabels = chartData.length > 7;
    const shouldPadLabels = chartData.length > 7;

    // Custom X-Axis Tick
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

    const CustomYAxisTick = ({ x, y, payload, isDarkMode }) => {
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
          {payload.value}
        </text>
      );
    };

    const renderCustomLegend = (props) => {
      const { payload } = props;

      const legendPayload = isMobile
        ? payload.filter((entry) => !entry.value.startsWith("Goal:"))
        : payload;

      return (
        <div className="flex justify-center items-center space-x-4 font-futura-bold">
          {legendPayload.map((entry, index) => {
            if (entry.value.startsWith("Average:")) {
              return (
                <div key={`legend-${index}`} className="flex items-center">
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
                  <span className="ml-2 text-md text-lovesOrange">
                    {entry.value}
                  </span>
                </div>
              );
            } else if (entry.value.startsWith("Goal:")) {
              return (
                <div key={`legend-${index}`} className="flex items-center">
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
                  <span className="ml-2 text-md text-lovesGreen">
                    {entry.value}
                  </span>
                </div>
              );
            } else if (
              entry.value === "Score" ||
              entry.value === "mtdScore" ||
              entry.value === "Adherence" ||
              entry.value === "Quality" ||
              entry.value === "AHT"
            ) {
              return (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      background: "linear-gradient(to right, #9dca7e, #FF0000)",
                    }}
                  />
                  <span className="ml-2 text-md">{entry.value}</span>
                </div>
              );
            }

            return (
              <div key={`legend-${index}`} className="flex items-center">
                {entry.type === "square" ? (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: entry.color,
                    }}
                  />
                ) : entry.type === "line" ? (
                  <div
                    style={{
                      width: 20,
                      height: 2,
                      backgroundColor: entry.color,
                    }}
                  />
                ) : null}
                <span className="ml-2 text-md">{entry.value}</span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <section ref={ref} className="flex flex-grow h-full px-2">
        <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg">
          <ResponsiveContainer width="100%" height="95%">
            <ComposedChart
              data={chartData}
              margin={{
                top: isMobile ? 40 : 40,
                right: isMobile ? 10 : 20,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                {yDataKey === "AHT" || yDataKey === "ahtTeam" ? (
                  (() => {
                    const [low, high] = averageHandleTimeGoal.split(" - ");
                    const lowVal = parseFloat(low.replace(":", "."));
                    const highVal = parseFloat(high.replace(":", "."));
                    const lowOffset = ((yMax - lowVal) / (yMax - yMin)) * 100;
                    const highOffset = ((yMax - highVal) / (yMax - yMin)) * 100;
                    return (
                      <linearGradient
                        id="areaColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#FF0000" />
                        <stop offset={`${highOffset}%`} stopColor="#FF0000" />
                        <stop offset={`${highOffset}%`} stopColor="#9dca7e" />
                        <stop offset={`${lowOffset}%`} stopColor="#9dca7e" />
                        <stop offset={`${lowOffset}%`} stopColor="#FF0000" />
                        <stop offset="100%" stopColor="#FF0000" />
                      </linearGradient>
                    );
                  })()
                ) : (
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9dca7e" />
                    <stop offset={`${goalOffset}%`} stopColor="#9dca7e" />
                    <stop offset={`${goalOffset}%`} stopColor="#FF0000" />
                    <stop offset="100%" stopColor="#FF0000" />
                  </linearGradient>
                )}
                <filter
                  id="barShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="2"
                    dy="2"
                    stdDeviation="3"
                    floodColor={isDarkMode ? "#282828" : "#000"}
                    floodOpacity="0.5"
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
                  isMobile ? (
                    false
                  ) : (
                    <CustomXAxisTick
                      angle={shouldRotateLabels ? -45 : 0}
                      isDarkMode={isDarkMode}
                    />
                  )
                }
                interval={0}
                padding={
                  isMobile
                    ? { left: 0, right: 0 }
                    : shouldPadLabels
                    ? { left: 0, right: 0 }
                    : { left: 50, right: 50 }
                }
              />

              <YAxis
                type="number"
                allowDecimals={false}
                ticks={computeTicks(chartData, yDataKey)}
                domain={[
                  (dataMin) => Math.floor(dataMin) - 1,
                  (dataMax) => Math.ceil(dataMax),
                ]}
                tick={<CustomYAxisTick isDarkMode={isDarkMode} />}
              />

              <Tooltip
                content={
                  <CustomTooltip
                    average={average}
                    goal={getGoalForMetric(yDataKey)}
                    isDarkMode={isDarkMode}
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
                content={renderCustomLegend}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: isMobile
                    ? "0px"
                    : shouldRotateLabels
                    ? "80px"
                    : "10px",
                }}
                payload={[
                  {
                    value: legendNames[yDataKey] || yDataKey,
                    type: "square",
                    color: isDarkMode ? "#ccc" : "#000",
                  },
                  {
                    value: `Average: ${average}`,
                    type: "line",
                    color: "#FF8000",
                  },
                  {
                    value: `Goal: ${getGoalForMetric(yDataKey)}`,
                    type: "line",
                    color: "#9dca7e",
                  },
                ]}
              />

              <Bar
                dataKey={yDataKey}
                barSize={60}
                name={legendNames[yDataKey] || yDataKey}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarFill(entry)}
                    filter="url(#barShadow)"
                  />
                ))}
              </Bar>

              {yDataKey === "mtdScore" && (
                <ReferenceLine
                  y={parseFloat(averageScoreGoal.replace("%", ""))}
                  stroke="#9dca7e"
                  strokeWidth={4}
                />
              )}
              {yDataKey === "Adherence" && (
                <ReferenceLine
                  y={parseFloat(adherenceGoal.replace("%", ""))}
                  stroke="#9dca7e"
                  strokeWidth={4}
                />
              )}
              {yDataKey === "Quality" && (
                <ReferenceLine
                  y={parseFloat(qualityGoal.replace("%", ""))}
                  stroke="#9dca7e"
                  strokeWidth={4}
                />
              )}
              {yDataKey === "AHT" && (
                <>
                  <ReferenceLine
                    y={parseFloat("5.30")}
                    stroke="#9dca7e"
                    strokeWidth={4}
                  />
                  <ReferenceLine
                    y={parseFloat("6.30")}
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

BarChart.displayName = "BarChart";

export default BarChart;
