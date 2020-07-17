import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { manageState } from "../reducers";

const store = initialState => {
  return createStore(
    manageState,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );
};

export default store;
