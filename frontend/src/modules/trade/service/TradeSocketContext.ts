import { ITrade } from "@shared/types/trade";
import { Socket } from "socket.io-client";
import { ITurnTimer } from "../types";
import { createContext, useContext } from "react";

interface TradeSocketContextType {
  socket: Socket | null;
  trade?: ITrade;
  timer: number;
  turnTimer?: ITurnTimer;
}

export const TradeSocketContext = createContext<
  TradeSocketContextType | undefined
>(undefined);

export const useTradeSocket = () => {
  const context = useContext(TradeSocketContext);
  if (context === undefined) {
    throw new Error(
      "useTradeSocket должен быть использован в TradeSocketProvider"
    );
  }
  return context;
};
