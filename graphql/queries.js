import { gql } from "@apollo/client";

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

const GET_ALL_MANAGERS = gql`
  query Manager {
    managers {
      documentId
      name
      role
      createdAt
      updatedAt
      publishedAt
    }
  }
`;

const GET_ALL_DEPARTMENTS = gql`
  query Department {
    departments {
      documentId
      name
      supervisors {
        documentId
        name
        role
        location
      }
      managers {
        documentId
        name
        role
        managerOfDominican
      }
    }
  }
`;

const GET_HOME_PAGE = gql`
  query HomePage {
    homePage {
      documentId
      slug
      imageSection {
        background {
          url
        }
        city
        text
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
    }
  }
`;
const GET_403 = gql`
  query Forbidden {
    forbidden {
      title
      description
      buttonText
      url
    }
  }
`;
const GET_500 = gql`
  query GET_500 {
    internalServerError {
      title
      description
      buttonText
      url
    }
  }
`;
const GET_503 = gql`
  query GET_503 {
    serviceUnavailable {
      title
      description
      buttonText
      url
    }
  }
`;
export {
  GET_ALL_SUPERVISORS,
  GET_ALL_MANAGERS,
  GET_ALL_AGENTS,
  GET_ALL_DEPARTMENTS,
  GET_HOME_PAGE,
  GET_LOGO,
  GET_NAVIGATION,
  GET_404,
  GET_403,
  GET_500,
  GET_503,
};
