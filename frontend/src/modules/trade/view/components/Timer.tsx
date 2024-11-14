import React from "react";
import { Typography, LinearProgress, Box } from "@mui/material";
import { useTradeSocket } from "@modules/trade/service/TradeSocketContext";

const TRADE_DURATION = 900; // 15 минут
const TURN_DURATION = 30; // 30 секунд

interface ITimerProps {
  isTurnTimer?: boolean;
}

const Timer: React.FunctionComponent<ITimerProps> = ({
  isTurnTimer = false,
}) => {
  const { timer, turnTimer } = useTradeSocket();

  const totalSeconds = Math.floor(
    (isTurnTimer && turnTimer ? turnTimer.timer : timer) / 1000
  );
  const percentage =
    (totalSeconds / (isTurnTimer ? TURN_DURATION : TRADE_DURATION)) * 100;
  const isActive = totalSeconds > 0;

  const formatTime = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getColor = () => {
    if (percentage >= 50) {
      return "success"; // green
    } else if (percentage >= 25) {
      return "warning"; // yellow
    } else {
      return "error"; // red
    }
  };

  return (
    <Box py={1} px={1}>
      {!isTurnTimer &&
        (isActive ? (
          <Typography color="info">Осталось времени: {formatTime()}</Typography>
        ) : (
          <Typography color="error">Торги завершены</Typography>
        ))}
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={getColor()}
        sx={{
          height: 8,
          borderRadius: 5,
          mt: 1,
        }}
      />
    </Box>
  );
};

export default Timer;
