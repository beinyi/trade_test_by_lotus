import {
  Box,
  Grid2,
  List,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import ListItemTextMui, { ListItemTextProps } from "@mui/material/ListItemText";
import { IParticipant } from "@shared/types/participant";
import * as React from "react";
import Timer from "./Timer";
import { useTradeSocket } from "@modules/trade/service/TradeSocketContext";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(1),
  textAlign: "center",
}));

const ListItemText: React.FC<ListItemTextProps> = (props) => (
  <ListItemTextMui
    primaryTypographyProps={{ variant: "subtitle2", color: "textDisabled" }}
    secondaryTypographyProps={{ color: "textPrimary", variant: "body2" }}
    {...props}
  />
);

interface IParticipantsListProps {}

const ParticipantsList: React.FunctionComponent<
  IParticipantsListProps
> = () => {
  const { turnTimer, trade } = useTradeSocket();
  const currentParticipant = turnTimer?.participantId;

  if (!trade) {
    return <ParticipantSkeleton />;
  }

  const participants = trade.participants;

  return (
    <Stack spacing={2}>
      {participants.map((participant) => {
        const isTurn = participant._id === currentParticipant;
        return (
          <ParticipantsItem
            key={`pList-item-${participant._id}`}
            participant={participant}
            isTurn={isTurn}
          />
        );
      })}
    </Stack>
  );
};

const ParticipantsItem: React.FunctionComponent<{
  participant: IParticipant;
  isTurn: boolean;
}> = React.memo(
  ({ participant, isTurn }) => {
    const lastBid = participant.bids?.at(-1) || undefined;
    return (
      <Box component={Paper} px={2} py={1}>
        <Typography variant="h6">{participant.name}</Typography>
        <List>
          {lastBid ? (
            <Grid2 container>
              <Grid2 size={{ xs: 6, sm: 3 }}>
                <StyledListItem>
                  <ListItemText
                    primary="Стоимость"
                    secondary={`${lastBid.amount} руб.`}
                  />
                </StyledListItem>
              </Grid2>

              <Grid2 size={{ xs: 6, sm: 3 }}>
                <StyledListItem>
                  <ListItemText
                    primary="Срок изготовления"
                    secondary={`${lastBid.prodTime} д.`}
                  />
                </StyledListItem>
              </Grid2>

              <Grid2 size={{ xs: 6, sm: 3 }}>
                <StyledListItem>
                  <ListItemText
                    primary="Гарантийный срок"
                    secondary={`${lastBid.warrantyTime} мес.`}
                  />
                </StyledListItem>
              </Grid2>

              <Grid2 size={{ xs: 6, sm: 3 }}>
                <StyledListItem>
                  <ListItemText
                    primary="Условия оплаты"
                    secondary={`${lastBid.paymentTerms}%`}
                  />
                </StyledListItem>
              </Grid2>
            </Grid2>
          ) : (
            <StyledListItem>
              <ListItemText primary="Нет ставок" />
            </StyledListItem>
          )}
        </List>

        {isTurn && <Timer isTurnTimer />}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isTurn === nextProps.isTurn && nextProps.isTurn;
  }
);

const ParticipantSkeleton: React.FunctionComponent = () => {
  const skeleton = [];
  for (let i = 0; i < 4; i++) {
    skeleton.push(
      <Skeleton key={`participant-skeleton-${i}`} width={"100%"} height={130} />
    );
  }

  return skeleton;
};

export default ParticipantsList;
