import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
} from "@mui/material";
import { ETradeStatus, ITrade } from "@shared/types/trade";
import * as React from "react";

interface ITradeInfoProps {
  trade?: ITrade;
}

const TradeInfo: React.FunctionComponent<ITradeInfoProps> = React.memo(
  ({ trade }) => {
    return (
      <Box component={Paper}>
        <List>
          <ListItem>
            <ListItemText
              primary="Предмет торгов"
              secondary={trade?.title ?? <Skeleton />}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Статус"
              secondary={trade ? ETradeStatus[trade.status] : <Skeleton />}
            />
          </ListItem>
        </List>
      </Box>
    );
  }
);

export default TradeInfo;
