import { SET_USER } from "../types";
import { SET_BOOKS } from "../types";
import { SET_BOOKS_CONTROLLER } from "../types";
import { SET_BOOKS_FOR_SEARCH } from "../types";
import { SET_SEARCHED_BOOK } from "../types";

export const setUser = user => {
  return dispatch => {
    dispatch({
      type: SET_USER,
      user: user
    });
  };
};

export const setBooks = books => {
  return dispatch => {
    dispatch({
      type: SET_BOOKS,
      books: books
    });
  };
};

export const setBooksController = booksController => {
  return dispatch => {
    dispatch({
      type: SET_BOOKS_CONTROLLER,
      booksController: booksController
    });
  };
};

export const setBooksForSearch = booksForSearch => {
  return dispatch => {
    dispatch({
      type: SET_BOOKS_FOR_SEARCH,
      booksForSearch: booksForSearch
    });
  };
};

export const setSearchedBook = searchedBook => {
  return dispatch => {
    dispatch({
      type: SET_SEARCHED_BOOK,
      searchedBook: searchedBook
    });
  };
};
