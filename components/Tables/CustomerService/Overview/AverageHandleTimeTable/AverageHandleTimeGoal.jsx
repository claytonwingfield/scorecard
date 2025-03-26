import React from "react";
import OverviewTable from "@/components/Tables/CustomerService/Overview/OverviewTable";

import { ahtTableConfig } from "@/components/Tables/CustomerService/Overview/AverageHandleTimeTable/ahtTableConfig";

export default function AverageHandleTimeGoalWrapper(props) {
  return <OverviewTable {...ahtTableConfig} {...props} />;
}
