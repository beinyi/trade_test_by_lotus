import axiosInstance from "@core/axios/instance";
import { ITrade } from "@shared/types/trade";

const BASE = `/api/trade/`;

const tradeApi = {
  getTradeById: (id: string) => axiosInstance.get<ITrade>(`${BASE}${id}`),
};

export default tradeApi;
