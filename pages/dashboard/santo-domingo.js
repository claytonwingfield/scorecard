import DashboardPage from "@/components/Dashboard/Department/DepartmentDashboard";
import {
  CustomerServiceSection,
  HelpDeskSection,
} from "@/components/Dashboard/Department/DepartmentSection";

const departmentOptionsSD = [
  { label: "Customer Service", value: "Customer Service" },
  { label: "Help Desk", value: "Help Desk" },
];
const departmentSectionsSD = [
  { key: "Customer Service", Component: CustomerServiceSection },
  { key: "Help Desk", Component: HelpDeskSection },
];
export default function SantoDomingo() {
  return (
    <DashboardPage
      departmentOptions={departmentOptionsSD}
      departmentSections={departmentSectionsSD}
    />
  );
}
