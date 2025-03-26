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
  LabelList,
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

const CompareBarChart = forwardRef(
  (
    {
      data,
      xDataKey,
      // Instead of a single yDataKey, we know our data objects have both mainValue and comparedValue
      managers,
      comparisonManager,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    // Here you might still want to sort or do minimal processing.
    const chartData = useMemo(() => {
      // Assuming data is already numeric in mainValue and comparedValue
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
      // For Average Score, use a lower padding factor to zoom in more.
      const paddingFactor =
        chartData[0]?.metric === "Average Score" ? 0.5 : 0.1;

      const padding = range === 0 ? 1 : range * paddingFactor;
      return [min - padding, max + padding];
    }, [chartData]);

    const computedTicks = useMemo(() => {
      const [min, max] = xDomain;
      // Check if the metric is "Average Score"
      if (chartData[0]?.metric === "Average Score") {
        // If range is zero or very narrow, force a default range.
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
    const CustomTooltipComponent = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const isTimeMetric =
          payload[0].payload.metric === "Average Handle Time";
        return (
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              padding: "5px",
              color: "#000",
            }}
          >
            <p style={{ margin: 0 }}>{payload[0].payload.metric}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ margin: 0 }}>
                {entry.name}:{" "}
                {isTimeMetric ? formatSecondsToTime(entry.value) : entry.value}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
    const isTimeMetric = chartData[0]?.metric === "Average Handle Time";
    const tickFormatter = isTimeMetric ? formatSecondsToTime : (val) => val;

    return (
      <section ref={ref} className="flex  h-full">
        <div className="w-full h-full bg-lovesWhite dark:bg-darkBg rounded-lg">
          <ResponsiveContainer width="100%" height="86%">
            <ComposedChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={xDomain}
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
