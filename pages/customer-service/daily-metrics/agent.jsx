import { useRouter } from "next/router";
import Header from "@/components/Navigation/header";
export default function AgentDailyMetricsPage() {
  const router = useRouter();
  const { from, to, agents, managers, supervisors } = router.query;

  return (
    <div className="bg-lovesWhite dark:bg-darkBg">
      <Header />
      <p>
        {" "}
        <strong>
          Date Range: {from || "None"} - {to || "None"}
        </strong>
      </p>
      <p>
        <strong>Agent(s):</strong> {agents || "None"}
      </p>
      <p>
        <strong>Supervisor(s):</strong> {supervisors || "None"}
      </p>
      <p>
        <strong>Manager(s):</strong> {managers || "None"}
      </p>
    </div>
  );
}
