import React from "react";
import OverviewTable from "@/components/Tables/CustomerService/Overview/OverviewTable";
import { adherenceTableConfig } from "@/components/Tables/CustomerService/Overview/AdherenceTable/adherenceTableConfig";

export default function AdherenceGoalWrapper(props) {
  return <OverviewTable {...adherenceTableConfig} {...props} />;
}
