import * as React from "react";
import { useParams } from "react-router-dom";
import TradeInfo from "./TradeInfo";
import ParticipantsList from "./ParticipantsList";
import { useTradeSocket } from "@modules/trade/service/TradeSocketContext";
import Grid from "@mui/material/Grid2";
import Timer from "./Timer";
import AdminControls from "./AdminControls";
import { Stack } from "@mui/material";
import ParticipantControls from "./ParticipantControls";
import { useEffect } from "react";
import { enqueueSnackbar } from "notistack";

interface ITradeRoomProps {}

const Room: React.FunctionComponent<ITradeRoomProps> = () => {
  const { participantId } = useParams();
  const userRole = participantId ? "participant" : "admin";
  const { trade, turnTimer } = useTradeSocket();

  useEffect(() => {
    if (participantId && participantId === turnTimer?.participantId) {
      enqueueSnackbar({ message: "Ваш ход", variant: "info" });
    }
    console.log(import.meta.env);
  }, [participantId, turnTimer?.participantId]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Timer />
      </Grid>
      <Grid size={{ sm: 12, xs: 12, md: 3 }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row", md: "column" }}
        >
          <TradeInfo trade={trade} />
          {userRole === "admin" ? <AdminControls /> : <ParticipantControls />}
        </Stack>
      </Grid>
      <Grid size={{ sm: 12, xs: 12, md: 9 }}>
        <ParticipantsList />
      </Grid>
    </Grid>
  );
};

export default Room;
