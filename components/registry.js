import AverageScore from "@/components/Tables/CustomerService/Overview/AverageScoreTable/AverageScore";
import AttainmentGoal from "@/components/Tables/CustomerService/Overview/AttainmentTable/AttainmentGoal";
import AverageHandleTimeGoal from "@/components/Tables/CustomerService/Overview/AverageHandleTimeTable/AverageHandleTimeGoal";
import QualityGoal from "@/components/Tables/CustomerService/Overview/QualityTable/QualityGoal";
import AdherenceGoal from "@/components/Tables/CustomerService/Overview/AdherenceTable/AdherenceGoal";
import ScoreCardTable from "@/components/Tables/CustomerService/Overview/ScoreCardTable/ScoreCardTable";
import TeamFive from "@/components/Tables/CustomerService/Teams/TeamFive/TeamFive";
import TeamFour from "@/components/Tables/CustomerService/Teams/TeamFour/TeamFour";
import TeamThree from "@/components/Tables/CustomerService/Teams/TeamThree/TeamThree";
import TeamSix from "@/components/Tables/CustomerService/Teams/TeamSix/TeamSix";
import TeamTwo from "@/components/Tables/CustomerService/Teams/TeamTwo/TeamTwo";
import TeamOne from "@/components/Tables/CustomerService/Teams/TeamOne/TeamOne";

export const componentRegistry = {
  AverageScore: AverageScore,
  AttainmentGoal: AttainmentGoal,
  AverageHandleTimeGoal: AverageHandleTimeGoal,
  QualityGoal: QualityGoal,
  AdherenceGoal: AdherenceGoal,
  ScoreCardTable: ScoreCardTable,
};
export const teamComponents = {
  TeamFour: TeamFour,
  TeamThree: TeamThree,
  TeamFive: TeamFive,
  TeamOne: TeamOne,
  TeamTwo: TeamTwo,
  TeamSix: TeamSix,
};

export const combinedRegistry = {
  ...componentRegistry,
  ...teamComponents,
};
export const overviewTables = [
  "ScoreCardTable",
  "AverageScore",
  "AttainmentGoal",
  "AverageHandleTimeGoal",
  "QualityGoal",
  "AdherenceGoal",
];
export const agentTables = [
  "TeamFour",
  "TeamThree",
  "TeamFive",
  "TeamOne",
  "TeamTwo",
  "TeamSix",
];
