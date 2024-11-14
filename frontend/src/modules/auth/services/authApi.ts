import axiosInstance from "../../../core/axios/instance";
import { IAuthRes, ILoginReq, ILoginRes } from "../types";

const LOGIN = `/api/auth/login/`;
const AUTH = "/api/auth/check/";
const TRADE_BASE = "/api/trade/";

const authApi = {
  login: (params: ILoginReq) => axiosInstance.post<ILoginRes>(LOGIN, params),

  auth: () => axiosInstance.get<IAuthRes>(AUTH),

  joinTrade: ({
    tradeId,
    participantId,
  }: {
    tradeId: string;
    participantId: string;
  }) => axiosInstance.get(`${TRADE_BASE}${tradeId}/join/${participantId}`),
};

export default authApi;
