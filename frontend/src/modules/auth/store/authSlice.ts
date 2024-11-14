import { createSlice } from "@reduxjs/toolkit";
import { authParticipant, authUser } from "./authAC";
import { TLoadingStatus } from "../../../shared/types/common";
import { RootState } from "../../../store/store";

export interface IAuthState {
  isAuthenticated: boolean;
  jwttoken: string | null;
  loading: TLoadingStatus;
  error: string | null;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  loading: "idle",
  jwttoken: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authUser.pending, (state) => {
      state.loading = "pending";
      state.isAuthenticated = false;
      state.jwttoken = null;
      state.error = null;
    });
    builder.addCase(authUser.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.isAuthenticated = true;
      state.jwttoken = action.payload;
    });
    builder.addCase(authUser.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload ?? null;
    });

    builder.addCase(authParticipant.pending, (state) => {
      state.loading = "pending";
      state.isAuthenticated = false;
      state.jwttoken = null;
      state.error = null;
    });
    builder.addCase(authParticipant.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.isAuthenticated = true;
      state.jwttoken = action.payload;
    });
    builder.addCase(authParticipant.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload ?? null;
    });
  },
});

export const selectAuthLoading = (state: RootState) => {
  return state.auth.loading;
};

export const selectAuthError = (state: RootState) => {
  return state.auth.error;
};

export const selectIsisAuthenticated = (state: RootState) => {
  return state.auth.isAuthenticated;
};

export default authSlice.reducer;
