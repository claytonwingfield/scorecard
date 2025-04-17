import React from "react";
import TeamTable from "@/components/Tables/CustomerService/Teams/TeamTable";

const TeamTableWrapper = ({ tableId, onHeightChange, ...props }) => {
  return (
    <div className="">
      <TeamTable {...props} />
    </div>
  );
};

export default TeamTableWrapper;
