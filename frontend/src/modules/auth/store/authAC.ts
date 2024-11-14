import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { ILoginReq } from "../types";
import authApi from "../services/authApi";
import { AxiosError } from "axios";
import { IServerException } from "@shared/types/common";

export const authUser = createAsyncThunk<
  string,
  ILoginReq | undefined,
  { rejectValue: string }
>("auth/authUser", async (loginData, thunkApi) => {
  try {
    if (loginData) {
      const {
        data: { jwttoken },
      } = await authApi.login(loginData);
      Cookies.set("jwttoken", jwttoken);
      return jwttoken;
    }

    const {
      data: { isAuthenticated, jwttoken },
    } = await authApi.auth();
    if (!isAuthenticated) {
      return thunkApi.rejectWithValue(
        "Токен авторизации не актуален. Пройдите авторизацию."
      );
    }

    return jwttoken;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      return thunkApi.rejectWithValue(axiosError.message);
    }

    const responseError = error as { response: { data: IServerException } };
    if (responseError.response) {
      return thunkApi.rejectWithValue(
        responseError.response.data.message ?? "Неизвестная ошибка"
      );
    }

    return thunkApi.rejectWithValue("Неизвестная ошибка");
  }
});

export const authParticipant = createAsyncThunk<
  string,
  { tradeId: string; participantId: string },
  { rejectValue: string }
>("auth/authParticipant", async (joinData, thunkApi) => {
  try {
    await authApi.joinTrade(joinData);
    return joinData.participantId;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.isAxiosError) {
      return thunkApi.rejectWithValue(axiosError.message);
    }

    const responseError = error as { response: { data: IServerException } };
    if (responseError.response) {
      return thunkApi.rejectWithValue(
        responseError.response.data.message ?? "Неизвестная ошибка"
      );
    }

    return thunkApi.rejectWithValue("Неизвестная ошибка");
  }
});
