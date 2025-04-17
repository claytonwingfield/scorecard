"use client";

import React, { useMemo, forwardRef } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

const CompareBarChart = forwardRef(
  ({ data, xDataKey, managers, comparisonManager }, ref) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const chartData = useMemo(() => {
      return data.sort((a, b) => {
        const keyA = (a[xDataKey]?.toString() ?? "").toLowerCase();
        const keyB = (b[xDataKey]?.toString() ?? "").toLowerCase();
        return keyA.localeCompare(keyB);
      });
    }, [data, xDataKey]);
    const xDomain = useMemo(() => {
      if (!chartData || chartData.length === 0) return [0, 1];
      const values = chartData.reduce((acc, cur) => {
        if (cur.mainValue != null) acc.push(cur.mainValue);
        if (cur.comparedValue != null) acc.push(cur.comparedValue);
        return acc;
      }, []);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      const paddingFactor =
        chartData[0]?.metric === "Average Score" ? 0.5 : 0.1;

      const padding = range === 0 ? 1 : range * paddingFactor;
      return [min - padding, max + padding];
    }, [chartData]);

    const computedTicks = useMemo(() => {
      const [min, max] = xDomain;

      if (chartData[0]?.metric === "Average Score") {
        if (min === max) {
          const val = Math.floor(min);
          return [val - 1, val, val + 1];
        }
        const start = Math.floor(min);
        const end = Math.ceil(max);
        const ticks = [];
        for (let i = start; i <= end; i++) {
          ticks.push(i);
        }
        return ticks;
      } else {
        const start = Math.floor(min * 2) / 2;
        const end = Math.ceil(max * 2) / 2;
        const ticks = [];
        for (let i = start; i <= end; i += 0.5) {
          ticks.push(i);
        }
        return ticks;
      }
    }, [xDomain, chartData]);

    const formatSecondsToTime = (seconds) => {
      if (seconds === null || seconds === undefined) return "";
      const m = Math.floor(seconds / 60);
      const s = Math.round(seconds % 60)
        .toString()
        .padStart(2, "0");
      return `${m}:${s}`;
    };

    const isTimeMetric = chartData[0]?.metric === "Average Handle Time";
    const tickFormatter = isTimeMetric ? formatSecondsToTime : (val) => val;

    return (
      <section ref={ref} className="flex">
        <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg">
          <ResponsiveContainer width="100%" height={130}>
            <defs>
              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9dca7e" />

                <stop offset="100%" stopColor="#FF0000" />
              </linearGradient>

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
            <ComposedChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={
                  chartData[0]?.metric === "Average Score" ? [85, 100] : xDomain
                }
                ticks={computedTicks}
                tickFormatter={tickFormatter}
                tick={false}
                axisLine={false}
                width={0}
              />
              <YAxis dataKey="metric" type="category" tick={false} width={0} />

              <Bar
                dataKey="mainValue"
                fill="#FF0000"
                filter="url(#shadow)"
                barSize={30}
                name={managers}
              >
                <LabelList
                  dataKey="mainValue"
                  position="right"
                  formatter={(value) =>
                    isTimeMetric ? formatSecondsToTime(value) : value
                  }
                />
              </Bar>
              <Bar
                dataKey="comparedValue"
                fill="#FFEB00"
                filter="url(#shadow)"
                barSize={30}
                name={comparisonManager?.label || "Compared"}
              >
                <LabelList
                  dataKey="comparedValue"
                  position="right"
                  formatter={(value) =>
                    isTimeMetric ? formatSecondsToTime(value) : value
                  }
                />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
);
CompareBarChart.displayName = "CompareBarChart";
export default CompareBarChart;
