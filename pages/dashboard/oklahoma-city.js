// pages/dashboard/oklahoma-city.js
import DepartmentDashboard from "@/components/Dashboard/Department/DepartmentDashboard";
import {
  CustomerServiceSection,
  HelpDeskSection,
  ElectronicDispatchSection,
  WrittenCommunicationSection,
  ResolutionsSection,
} from "@/components/Dashboard/Department/DepartmentSection";
import { gql } from "@apollo/client";

// Define the GraphQL query here (or import if defined elsewhere)
// This query will be EXECUTED by DepartmentDashboard now
const GET_ALL_DEPARTMENTS_QUERY = gql`
  query GetPublicStaff {
    staffs {
      email
      agentname
      teamname # Supervisor
      department
      webexes {
        date
        average_inbound_handle_time_seconds
      }
      wfms {
        date
        adherence
      }
      qualities {
        date
        totalscore
      }
    }
  }
`;

export default function OklahomaCity() {
  // 1. Define the order and components for departments
  const departmentOrder = [
    "Customer Service",
    "Help Desk",
    "Electronic Dispatch",
    "Written Communication",
    "Resolutions",
  ];

  const sectionMap = {
    "Customer Service": CustomerServiceSection,
    "Help Desk": HelpDeskSection,
    "Electronic Dispatch": ElectronicDispatchSection,
    "Written Communication": WrittenCommunicationSection,
    Resolutions: ResolutionsSection,
  };

  // 2. Create the configuration array for DepartmentDashboard
  // This NO LONGER contains calculated data, just the structure.
  const departmentSectionsConfig = departmentOrder
    .map((name) => {
      if (!sectionMap[name]) return null; // Skip if no component defined
      return {
        key: name, // The unique identifier (department name)
        Component: sectionMap[name], // The component to render
      };
    })
    .filter(Boolean); // Remove any null entries

  // 3. Define options for the filter dropdown (based on the order)
  const departmentOptions = departmentOrder.map((name) => ({
    label: name,
    value: name,
  }));

  // Pass the configuration, options, and the query itself to DepartmentDashboard
  return (
    <DepartmentDashboard
      departmentOptions={departmentOptions}
      departmentSectionsConfig={departmentSectionsConfig} // Pass the configuration
      query={GET_ALL_DEPARTMENTS_QUERY} // Pass the GraphQL query
    />
  );
}
