import { gql } from "apollo-boost";

const getAuthorsQuery = gql`
  query($id: ID) {
    authors(id: $id) {
      id
      firstName
      lastName
      area {
        id
        name
      }
      email
      password
      userType
      active
    }
  }
`;

const getRecordsQuery = gql`
  {
    records {
      id
      user {
        firstName
        lastName
        userType
      }
      action
      date
      time
    }
  }
`;

const getBooksQuery = gql`
  {
    books {
      id
      name
      area {
        id
        name
      }
      author {
        id
        firstName
        lastName
      }
      stateRepresentative
      stateCoordinator
      fileWithNames
      fileWithoutNames
      dictamenOne
      dictamenTwo
      dictamenThree
      correctedBook
      ISBN
      fileISBN
      acceptedBook
      armado
      ready
      agradecimiento1
      agradecimiento2
      agradecimiento3
      requestUrl
    }
  }
`;

const getUsersQuery = gql`
  {
    users {
      id
      firstName
      lastName
      area
      email
      password
      userType
      active
    }
  }
`;

const getAreasQuery = gql`
  {
    areas {
      id
      name
    }
  }
`;

const getRepresentativesQuery = gql`
  {
    representatives {
      id
      firstName
      lastName
      area {
        id
        name
      }
      email
      password
      userType
      active
    }
  }
`;

const getAreaQuery = gql`
  query($id: ID) {
    area(id: $id) {
      id
      name
    }
  }
`;

const getRepresentativeQuery = gql`
  query($id: ID) {
    representative(id: $id) {
      id
      firstName
      lastName
      area {
        id
        name
      }
      email
      password
      userType
      active
    }
  }
`;

const getUserQuery = gql`
  query($id: ID) {
    user(id: $id) {
      id
      firstName
      lastName
      area {
        id
        name
      }
      email
      password
      userType
      active
    }
  }
`;

const getBookQuery = gql`
  query($id: ID) {
    book(id: $id) {
      id
      name
      area {
        id
        name
      }
      author {
        id
        firstName
        lastName
      }
      stateRepresentative
      stateCoordinator
      fileWithNames
      fileWithoutNames
      dictamenOne
      dictamenTwo
      dictamenThree
      correctedBook
      ISBN
      fileISBN
      acceptedBook
      armado
      ready
      agradecimiento1
      agradecimiento2
      agradecimiento3
      requestUrl
    }
  }
`;

const getBooksByAreaIdQuery = gql`
  query($userId: ID, $userType: String) {
    booksByAreaId(userId: $userId, userType: $userType) {
      id
      name
      area {
        id
        name
      }
      author {
        id
        firstName
        lastName
      }
      stateRepresentative
      stateCoordinator
      fileWithNames
      fileWithoutNames
      dictamenOne
      dictamenTwo
      dictamenThree
      correctedBook
      ISBN
      fileISBN
      acceptedBook
      armado
      ready
      agradecimiento1
      agradecimiento2
      agradecimiento3
      requestUrl
    }
  }
`;

const getAreaByRepresentativeId = gql`
  query($id: ID) {
    areaByRepresentativeId(id: $id) {
      id
      name
    }
  }
`;

const getFiles = gql`
  {
    files {
      id
      url
    }
  }
`;

export {
  getFiles,
  getAuthorsQuery,
  getBooksQuery,
  getBookQuery,
  getUsersQuery,
  getUserQuery,
  getAreasQuery,
  getAreaQuery,
  getRepresentativesQuery,
  getRepresentativeQuery,
  getBooksByAreaIdQuery,
  getRecordsQuery,
  getAreaByRepresentativeId
};
