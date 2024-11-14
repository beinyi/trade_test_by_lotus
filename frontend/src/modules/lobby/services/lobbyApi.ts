import axiosInstance from "@core/axios/instance";
import { ITrade, ITradeCreate } from "@shared/types/trade";

const BASE = `/api/trade/`;

const lobbyApi = {
  createTrade: (params: ITradeCreate) =>
    axiosInstance.post<ITrade>(BASE, params),

  getAllTrade: () => axiosInstance.get<ITrade[]>(BASE),

  getTradeById: (id: number) => axiosInstance.get<ITrade>(`${BASE}${id}`),
};

export default lobbyApi;
