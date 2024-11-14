import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { ITrade } from "@shared/types/trade";
import { ITurnTimer } from "../types";

interface TradeSocketContextType {
  socket: Socket | null;
  trade: ITrade | null;
  timer: number;
  turnTimer: ITurnTimer | null;
}

const TradeSocketContext = createContext<TradeSocketContextType | undefined>(
  undefined
);
export const useTradeSocket = () => {
  const context = useContext(TradeSocketContext);
  if (context === undefined) {
    throw new Error(
      "useTradeSocket должен быть использован в TradeSocketProvider"
    );
  }
  return context;
};
