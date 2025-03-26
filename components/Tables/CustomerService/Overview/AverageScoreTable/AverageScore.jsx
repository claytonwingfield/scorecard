import React from "react";
import OverviewTable from "@/components/Tables/CustomerService/Overview/OverviewTable";

import { averageScoreTableConfig } from "@/components/Tables/CustomerService/Overview/AverageScoreTable/averageScoreTableConfig";

export default function AverageScoreWrapper(props) {
  return <OverviewTable {...averageScoreTableConfig} {...props} />;
}
