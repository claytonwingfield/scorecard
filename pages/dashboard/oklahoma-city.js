import DepartmentDashboard from "@/components/Dashboard/Department/DepartmentDashboard";
import {
  CustomerServiceSection,
  HelpDeskSection,
  ElectronicDispatchSection,
  WrittenCommunicationSection,
  ResolutionsSection,
} from "@/components/Dashboard/Department/DepartmentSection";
import { GET_ALL_DEPARTMENTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
export default function OklahomaCity() {
  const { data, loading, error } = useQuery(GET_ALL_DEPARTMENTS);

  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading departments: {error.message}</p>;

  // 2. turn your GraphQL data into the props DepartmentDashboard wants
  const departmentOptions = data.departments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));
  const departmentOrder = [
    "Customer Service",
    "Help Desk",
    "Electronic Dispatch",
    "Written Communication",
    "Resolutions",
  ];

  // 3. for each department, pick the right section component
  const sectionMap = {
    "Customer Service": CustomerServiceSection,
    "Help Desk": HelpDeskSection,
    "Electronic Dispatch": ElectronicDispatchSection,
    "Written Communication": WrittenCommunicationSection,
    Resolutions: ResolutionsSection,
  };

  const departmentSections = departmentOrder
    .map((name) => {
      const dept = data.departments.find((d) => d.name === name);
      if (!dept) return null;

      return {
        key: name,
        Component: sectionMap[name],
        // keep ONLY the managers whose flag is true
        // (flip the comparison if you want to exclude them instead)
        managers: (dept.managers ?? []).filter(
          (m) => m.managerOfDominican === true
        ),
        supervisors: dept.supervisors ?? [],
      };
    })
    .filter(Boolean);

  return (
    <DepartmentDashboard
      departmentOptions={departmentOptions}
      departmentSections={departmentSections}
    />
  );
}
