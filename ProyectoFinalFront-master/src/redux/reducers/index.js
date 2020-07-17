import { SET_USER } from "../types";
import { SET_BOOKS } from "../types";
import { SET_BOOKS_CONTROLLER } from "../types";
import { SET_BOOKS_FOR_SEARCH } from "../types";
import { SET_SEARCHED_BOOK } from "../types";

const initialState = {
  user: null,
  books: null,
  booksController: null,
  booksForSearch: null,
  searchedBook: null
};

export const manageState = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user
      };
    case SET_BOOKS:
      return {
        ...state,
        books: action.books
      };
    case SET_BOOKS_CONTROLLER:
      return {
        ...state,
        booksController: action.booksController
      };
    case SET_BOOKS_FOR_SEARCH:
      return {
        ...state,
        booksForSearch: action.booksForSearch
      };
    case SET_SEARCHED_BOOK:
      return {
        ...state,
        searchedBook: action.searchedBook
      };
    default:
      return state;
  }
};
