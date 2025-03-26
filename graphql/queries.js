import { gql } from "@apollo/client";
// Supervisors
const GET_ALL_SUPERVISORS = gql`
  query Supervisor {
    supervisors {
      documentId
      name
      role
      location
      managers {
        documentId
        name
        role
      }
      createdAt
      updatedAt
      publishedAt
      agents {
        documentId
        name
        role
      }
    }
  }
`;
// Agents
const GET_ALL_AGENTS = gql`
  query Agent {
    agents {
      documentId
      name
      role
      createdAt
      updatedAt
      publishedAt
    }
  }
`;
// Managers
const GET_ALL_MANAGERS = gql`
  query Manager {
    managers {
      documentId
      name
      role
      createdAt
      updatedAt
      publishedAt
      supervisors {
        documentId
        name
        role
      }
    }
  }
`;
// Departments
const GET_ALL_DEPARTMENTS = gql`
  query Department {
    departments {
      documentId
      name
      createdAt
      updatedAt
      publishedAt
      managers {
        documentId
        name
        role
      }
      supervisors {
        documentId
        name
        role
      }
    }
  }
`;

const GET_ALL_LOCATIONS = gql`
  query Location {
    locations {
      documentId
      city
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

export {
  GET_ALL_SUPERVISORS,
  GET_ALL_MANAGERS,
  GET_ALL_AGENTS,
  GET_ALL_DEPARTMENTS,
  GET_ALL_LOCATIONS,
};
