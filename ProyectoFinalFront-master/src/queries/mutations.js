import { gql } from "apollo-boost";

const addBookMutation = gql`
  mutation(
    $name: String!
    $areaId: ID!
    $authorId: ID!
    $stateRepresentative: String!
    $stateCoordinator: String!
  ) {
    addBook(
      name: $name
      areaId: $areaId
      authorId: $authorId
      stateRepresentative: $stateRepresentative
      stateCoordinator: $stateCoordinator
    ) {
      id
    }
  }
`;

const addUserMutation = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $areaId: ID
    $email: String!
    $userType: String!
    $recordUserId: ID!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      areaId: $areaId
      email: $email
      userType: $userType
      recordUserId: $recordUserId
    ) {
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

const getUserByEmailAndPasswordMutation = gql`
  mutation($email: String!, $password: String!) {
    getUserByEmailAndPassword(email: $email, password: $password) {
      id
      userType
    }
  }
`;

const updateUserMutation = gql`
  mutation(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $areaId: ID
    $email: String!
    $password: String!
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      areaId: $areaId
      email: $email
      password: $password
    ) {
      id
    }
  }
`;

const deleteUserMutation = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const deleteBookMutation = gql`
  mutation($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

const updateBookMutation = gql`
  mutation(
    $id: ID!
    $name: String!
    $areaId: ID!
    $authorId: ID!
    $stateRepresentative: String!
    $stateCoordinator: String!
  ) {
    updateBook(
      id: $id
      name: $name
      areaId: $areaId
      authorId: $authorId
      stateRepresentative: $stateRepresentative
      stateCoordinator: $stateCoordinator
    ) {
      id
    }
  }
`;

const getBooksForSearchMutation = gql`
  mutation($userId: ID!) {
    getBooksForSearch(userId: $userId) {
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
        email
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

const addFileMutation = gql`
  mutation(
    $bookId: ID!
    $name: String!
    $base64: String!
    $typeOfFile: String!
    $ISBN: String!
  ) {
    addFile(
      bookId: $bookId
      name: $name
      base64: $base64
      typeOfFile: $typeOfFile
      ISBN: $ISBN
    ) {
      id
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

const addFirstFilesMutation = gql`
  mutation($bookName: String!, $base64: String!, $typeOfFile: String!) {
    addFirstFiles(
      bookName: $bookName
      base64: $base64
      typeOfFile: $typeOfFile
    ) {
      id
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

const addRequestMutation = gql`
  mutation(
    $areaId: ID!
    $authorId: ID!
    $bookName: String!
    $justification: String!
    $docenciaActive: Boolean!
    $docenciaPriority: String!
    $docenciaJustification: String!
    $docenciaKindOfText: String!
    $researchActive: Boolean!
    $researchPriority: String!
    $difusionActive: Boolean!
    $difusionPriority: String!
    $myPublic: String!
    $market: String!
    $numberOfBooks: String!
    $financing: String!
    $autorization: Boolean!
  ) {
    addRequest(
      areaId: $areaId
      authorId: $authorId
      bookName: $bookName
      justification: $justification
      docenciaActive: $docenciaActive
      docenciaPriority: $docenciaPriority
      docenciaJustification: $docenciaJustification
      docenciaKindOfText: $docenciaKindOfText
      researchActive: $researchActive
      researchPriority: $researchPriority
      difusionActive: $difusionActive
      difusionPriority: $difusionPriority
      myPublic: $myPublic
      market: $market
      numberOfBooks: $numberOfBooks
      financing: $financing
      autorization: $autorization
    ) {
      id
    }
  }
`;

export {
  addBookMutation,
  deleteBookMutation,
  updateBookMutation,
  addUserMutation,
  getUserByEmailAndPasswordMutation,
  updateUserMutation,
  deleteUserMutation,
  getBooksForSearchMutation,
  addFileMutation,
  addRequestMutation,
  addFirstFilesMutation
};
