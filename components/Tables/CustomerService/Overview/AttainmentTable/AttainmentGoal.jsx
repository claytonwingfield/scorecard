import React from "react";
import OverviewTable from "@/components/Tables/CustomerService/Overview/OverviewTable";
import { attainmentTableConfig } from "@/components/Tables/CustomerService/Overview/AttainmentTable/attainmentTableConfig";

export default function AttainmentGoalWrapper(props) {
  return <OverviewTable {...attainmentTableConfig} {...props} />;
}
