import { createSlice } from "@reduxjs/toolkit";
import { createTrade, getTrades } from "./lobbyAC";
import { TLoadingStatus } from "../../../shared/types/common";
import { RootState } from "../../../store/store";
import { ITrade } from "@shared/types/trade";

export interface ILobbyState {
  trades: ITrade[];
  loading: TLoadingStatus;
  sending: boolean;
  error: string | null;
}

const initialState: ILobbyState = {
  trades: [],
  loading: "idle",
  error: null,
  sending: false,
};

export const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createTrade.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(createTrade.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.trades = [...state.trades, action.payload];
    });
    builder.addCase(createTrade.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload ?? null;
    });

    builder.addCase(getTrades.pending, (state) => {
      state.sending = true;
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(getTrades.fulfilled, (state, action) => {
      state.sending = false;
      state.loading = "succeeded";
      state.trades = [...action.payload];
    });
    builder.addCase(getTrades.rejected, (state, action) => {
      state.sending = false;
      state.loading = "failed";
      state.error = action.payload ?? null;
    });
  },
});

export const selectTrades = (state: RootState) => {
  return state.lobby.trades;
};

export const selectLobbyError = (state: RootState) => {
  return state.lobby.error;
};

export const selectLobbyLoading = (state: RootState) => {
  return state.lobby.loading;
};

export const selectLobbySending = (state: RootState) => {
  return state.lobby.sending;
};

export default lobbySlice.reducer;
