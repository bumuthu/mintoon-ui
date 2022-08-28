import { combineReducers } from "@reduxjs/toolkit";

import configReducer from "store/slices/config-slice";
import userReducer from "store/slices/user-slice";

const rootReducer = combineReducers({
  configuration: configReducer,
  user: userReducer,
});

export default rootReducer;
