import React from "react";
import Header from "@/components/Navigation/header";
import MetricsDashboard from "@/components/MetricsDashboard";
import {
  customerServiceData,
  tableColumns,
  columnVisibilityOptions,
  allColumns,
  agentColumns,
  overviewColumns,
  allTeamData,
} from "@/data/customerServiceData";
import { chart_layout } from "@/components/Charts/Layout/ChartLayout";
import { combinedRegistry } from "@/components/registry";
import { agentTables } from "@/components/registry";
import { overviewTables } from "@/components/registry";
import { agentColumnVisibilityOptions } from "@/components/registry";
import { overviewLayout } from "@/components/Tables/Layouts/Overview/OverviewLayout";
import { agentLayout } from "@/components/Tables/Layouts/Agent/AgentLayout";

export default function CustomerServiceDailyMetrics() {
  return (
    <div className="bg-lovesWhite dark:bg-darkBg">
      <Header />

      <MetricsDashboard
        dataSets={customerServiceData.dataSets}
        tableVisibilityOptions={customerServiceData.tableVisibilityOptions}
        agentTableVisibilityOptions={
          customerServiceData.agentTableVisibilityOptions
        }
        columnVisibilityOptions={columnVisibilityOptions}
        agentColumnVisibilityOptions={agentColumnVisibilityOptions}
        tableColumns={tableColumns}
        allColumns={allColumns}
        agentColumns={agentColumns}
        overviewColumns={overviewColumns}
        chart_layout={chart_layout}
        overviewLayout={overviewLayout}
        agentLayout={agentLayout}
        combinedRegistry={combinedRegistry}
        agentTables={agentTables}
        overviewTables={overviewTables}
        allTeamData={allTeamData}
      />
    </div>
  );
}
