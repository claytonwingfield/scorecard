import React from "react";
import OverviewTable from "@/components/Tables/CustomerService/Overview/OverviewTable";

import { qualityGoalTableConfig } from "@/components/Tables/CustomerService/Overview/QualityTable/qualityGoalTableConfig";

export default function QualityGoalWrapper(props) {
  return <OverviewTable {...qualityGoalTableConfig} {...props} />;
}
