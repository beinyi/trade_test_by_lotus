import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../modules/auth/store/authSlice";
import lobbySlice from "@modules/lobby/store/lobbySlice";

const rootReducer = combineReducers({
  auth: authSlice,
  lobby: lobbySlice,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
