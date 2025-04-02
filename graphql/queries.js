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
      background {
        url
        alternativeText
      }
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

const GET_LOGO = gql`
  query GetLogo {
    logo {
      company
      image {
        url
      }
    }
  }
`;

const GET_NAVIGATION = gql`
  query Navigation {
    nav {
      NavigationItem {
        name
        path
        isDropdown
        isDominicanRepublic
        headerName
        subPages {
          name
          path
          headerName
          extraSubPages {
            name
            path
            headerName
          }
        }
      }
    }
  }
`;
const GET_404 = gql`
  query GET_NOT_FOUND_PAGE {
    notFoundPage {
      title
      description
      buttonText
      url
      code
    }
  }
`;

export {
  GET_ALL_SUPERVISORS,
  GET_ALL_MANAGERS,
  GET_ALL_AGENTS,
  GET_ALL_DEPARTMENTS,
  GET_ALL_LOCATIONS,
  GET_LOGO,
  GET_NAVIGATION,
  GET_404,
};
