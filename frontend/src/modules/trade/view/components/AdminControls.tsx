import { useTradeSocket } from "@modules/trade/service/TradeSocketContext";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ITrade } from "@shared/types/trade";
import { enqueueSnackbar } from "notistack";
import * as React from "react";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

interface IAdminControlsProps {}

const AdminControls: React.FunctionComponent<IAdminControlsProps> = () => {
  const { tradeId } = useParams();
  const { trade, socket } = useTradeSocket();

  const handleStartTrade = useCallback(() => {
    if (socket) {
      socket.emit("startTrade", { tradeId });
    }
  }, [socket, tradeId]);

  const handleStopTrade = useCallback(() => {
    if (socket) {
      socket.emit("stopTrade", { tradeId });
    }
  }, [socket, tradeId]);

  const handleCopy = useCallback(
    async (id: string) => {
      try {
        const link = `${FRONTEND_URL}/trade/${tradeId}/${id}`;
        await navigator.clipboard.writeText(link);
        enqueueSnackbar("Скопировано в буффер обмена", {
          variant: "default",
        });
      } catch {
        enqueueSnackbar("Не удалось скопировать в буфер обмена", {
          variant: "error",
        });
      }
    },
    [tradeId]
  );
  return (
    <Box component={Paper} px={1} py={1}>
      <AdminControlsItems
        onStopTrade={handleStopTrade}
        onStartTrade={handleStartTrade}
        onCopy={handleCopy}
        trade={trade}
      />
    </Box>
  );
};

const AdminControlsItems: React.FunctionComponent<{
  onStartTrade: () => void;
  onStopTrade: () => void;
  onCopy: (id: string) => void;
  trade?: ITrade;
}> = React.memo(
  ({
    onStartTrade: handleStartTrade,
    onStopTrade: handleStopTrade,
    onCopy: handleCopy,
    trade,
  }) => (
    <Stack spacing={2}>
      <Typography>Ссылки для участников</Typography>
      <List>
        {trade ? (
          trade.participants.map((p) => (
            <ListItem key={`copy-${p._id}`}>
              <ListItemText primary={p.name}></ListItemText>
              <ListItemButton onClick={() => handleCopy(p._id)}>
                Копировать
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ParticipantSkeleton />
        )}
      </List>
      <Button variant="contained" onClick={handleStartTrade} fullWidth>
        Начать торги
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleStopTrade}
        fullWidth
      >
        Закончить торги
      </Button>
    </Stack>
  )
);

const ParticipantSkeleton: React.FunctionComponent = () => {
  const skeleton = [];
  for (let i = 0; i < 4; i++) {
    skeleton.push(
      <ListItem key={`link-skeleton-${i}`}>
        <Stack>
          <Skeleton width={100} />
          <Skeleton width={185} />
        </Stack>
      </ListItem>
    );
  }

  return skeleton;
};

export default AdminControls;
