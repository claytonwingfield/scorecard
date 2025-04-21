"use client";
import React, { useMemo, forwardRef, useState, useEffect } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

const formatNumericToTime = (value) => {
  const minutes = Math.floor(value);
  const seconds = Math.floor((value - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const CompareLineChart = forwardRef(
  ({ data, xDataKey, yDataKey, groupByKey, disableGrouping = false }, ref) => {
    const isAHT = yDataKey === "AHT" || yDataKey === "ahtTeam";
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const chartData = useMemo(() => {
      const processedData = data.map((item) => ({
        ...item,
        mainValue: isAHT
          ? item.mainValue
          : typeof item.mainValue === "string"
          ? parseFloat(item.mainValue.replace("%", ""))
          : item.mainValue,
        comparedValue: isAHT
          ? item.comparedValue
          : typeof item.comparedValue === "string"
          ? parseFloat(item.comparedValue.replace("%", ""))
          : item.comparedValue,
      }));
      let finalData;
      if (groupByKey && !disableGrouping) {
        const groupedData = {};
        processedData.forEach((item) => {
          const groupKey = item[groupByKey];
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = { ...item, count: 1 };
          } else {
            groupedData[groupKey].mainValue += item.mainValue;
            groupedData[groupKey].comparedValue += item.comparedValue;
            groupedData[groupKey].count += 1;
          }
        });
        finalData = Object.values(groupedData).map((item) => ({
          [xDataKey]: item[groupByKey],
          mainValue: item.mainValue / item.count,
          comparedValue: item.comparedValue / item.count,
        }));
      } else {
        finalData = processedData.map((item) => ({
          [xDataKey]: item[xDataKey],
          mainValue: item.mainValue,
          comparedValue: item.comparedValue,
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
    }, [data, xDataKey, groupByKey, disableGrouping, isAHT]);

    const yValues = chartData.map((item) => item.mainValue);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const tickMin = Math.floor(yMin);
    const tickMax = Math.ceil(yMax);

    const yAxisDomain = isAHT
      ? [yMin - 0.1, yMax + 0.1]
      : [Math.floor(yMin) - 0.5, Math.ceil(yMax) + 0.5];

    const computeTicks = (data, yDataKey) => {
      if (isAHT) {
        const [domainMin, domainMax] = yAxisDomain;
        const ticks = [];
        const step = 0.1;
        for (let val = domainMin; val <= domainMax; val += step) {
          ticks.push(Number(val.toFixed(2)));
        }
        return ticks;
      } else {
        const ticks = [];
        for (let i = tickMin; i <= tickMax; i++) {
          ticks.push(i);
        }
        return ticks;
      }
    };

    const CustomXAxisTick = ({ x, y, payload, angle }) => {
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

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <section ref={ref} className="flex flex-grow h-full px-2">
        <div className="w-full h-full bg-lovesWhite dark:bg-darkBg  rounded-lg border-2 border-darkBorder shadow-md shadow-darkBorder dark:shadow-darkBorder ">
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            <ComposedChart
              data={chartData}
              margin={{
                top: isMobile ? 20 : 40,
                left: isMobile ? 0 : 0,
                right: isMobile ? 20 : 20,
                bottom: isMobile ? 0 : 20,
              }}
            >
              <defs>
                <filter
                  id="shadow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
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
              <XAxis
                dataKey={xDataKey}
                type="category"
                stroke={isDarkMode ? "#fff" : "#000"}
                tick={
                  isMobile ? (
                    false
                  ) : (
                    <CustomXAxisTick angle={shouldRotateLabels ? -45 : 0} />
                  )
                }
                interval="preserveStartEnd"
                minTickGap={isMobile ? 10 : 30}
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
                allowDecimals={true}
                domain={yAxisDomain}
                stroke={isDarkMode ? "#fff" : "#000"}
                ticks={computeTicks(chartData, yDataKey)}
                tickFormatter={isAHT ? formatNumericToTime : undefined}
              />

              <Line
                type="monotone"
                dataKey="mainValue"
                stroke="#FF0000"
                filter="url(#shadow)"
                strokeWidth={3}
                name="Main Manager"
              />
              <Line
                type="monotone"
                dataKey="comparedValue"
                filter="url(#shadow)"
                stroke="#FFEB00"
                strokeWidth={3}
                name="Comparison Manager"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
);

CompareLineChart.displayName = "CompareLineChart";
export default CompareLineChart;
