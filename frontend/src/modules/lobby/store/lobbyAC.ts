import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IServerException } from "@shared/types/common";
import { ITrade, ITradeCreate } from "@shared/types/trade";
import lobbyApi from "../services/lobbyApi";

export const createTrade = createAsyncThunk<
  ITrade,
  ITradeCreate,
  { rejectValue: string }
>("lobby/tradeCreate", async (tradeData, thunkApi) => {
  try {
    const { data: trade } = await lobbyApi.createTrade(tradeData);

    return trade;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      return thunkApi.rejectWithValue(axiosError.message);
    }

    const responseError = error as { response: { data: IServerException } };
    if (responseError.response) {
      return thunkApi.rejectWithValue(
        responseError.response.data.message ?? "Ошибка создания комнаты"
      );
    }

    return thunkApi.rejectWithValue("Ошибка создания комнаты");
  }
});

export const getTrades = createAsyncThunk<
  ITrade[],
  undefined,
  { rejectValue: string }
>("lobby/getTrades", async (_, thunkApi) => {
  try {
    const { data: trades } = await lobbyApi.getAllTrade();
    return trades;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      return thunkApi.rejectWithValue(axiosError.message);
    }

    const responseError = error as { response: { data: IServerException } };
    if (responseError.response) {
      return thunkApi.rejectWithValue(
        responseError.response.data.message ?? "Ошибка поулучения комнат"
      );
    }

    return thunkApi.rejectWithValue("Ошибка поулучения комнат");
  }
});
