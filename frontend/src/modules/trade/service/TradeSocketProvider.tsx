import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { ITurnTimer } from "../types";
import { ITrade } from "@shared/types/trade";
import { TradeSocketContext } from "./TradeSocketContext";
import { enqueueSnackbar } from "notistack";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const TradeSocketProvider: React.FC<{
  tradeId?: string;
  children: React.ReactNode;
}> = ({ tradeId, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [trade, setTrade] = useState<ITrade>();
  const [timer, setTimer] = useState<number>(0);
  const [turnTimer, setTurnTimer] = useState<ITurnTimer>();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["polling"],
      extraHeaders: {
        authorization: `Bearer ${Cookies.get("jwttoken")}`,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinTrade", { tradeId });
    });

    newSocket.on("tradeData", (data) => {
      setTrade(data);
    });

    newSocket.on("tradeTimer", ({ timeLeft }) => {
      setTimer(timeLeft);
    });

    newSocket.on("turnTimer", ({ participantId, remainingTime }) => {
      setTurnTimer({ participantId, timer: remainingTime });
    });

    newSocket.on("tradeEnded", () => {
      setTimer(0);
      setTurnTimer({ participantId: "", timer: 0 });
    });

    newSocket.on("error", (message) => {
      enqueueSnackbar({ message, variant: "error" });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [tradeId]);

  return (
    <TradeSocketContext.Provider
      value={{
        socket,
        trade,
        timer,
        turnTimer,
      }}
    >
      {children}
    </TradeSocketContext.Provider>
  );
};
