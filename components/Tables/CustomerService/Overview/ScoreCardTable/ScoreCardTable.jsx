import React from "react";
import OverviewTable from "@/components/Tables/CustomerService/Overview/OverviewTable";

import { scoreCardConfig } from "@/components/Tables/CustomerService/Overview/ScoreCardTable/scoreCardConfig";

export default function ScoreCardTableWrapper(props) {
  return <OverviewTable {...scoreCardConfig} {...props} />;
}
