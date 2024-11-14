import * as React from "react";
import { useParams } from "react-router-dom";
import { TradeSocketProvider } from "../service/TradeSocketProvider";
import Room from "./components/Room";

interface ITradeRoomProps {}

const TradeRoom: React.FunctionComponent<ITradeRoomProps> = () => {
  const { tradeId } = useParams();

  return (
    <TradeSocketProvider tradeId={tradeId}>
      <Room />
    </TradeSocketProvider>
  );
};

export default TradeRoom;
