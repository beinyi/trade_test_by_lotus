import { createTrade, getTrades } from "@modules/lobby/store/lobbyAC";
import {
  selectLobbyError,
  selectLobbyLoading,
  selectTrades,
} from "@modules/lobby/store/lobbySlice";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  IconButton,
  LinearProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { ETradeStatus, ITradeCreate } from "@shared/types/trade";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@shared/components/Modal";
import CreateTrade from "./components/CreateTrade";
import { useNavigate } from "react-router-dom";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  borderLeft: "1px solid #dbdbdb",
}));

interface ILobbyProps {}

const Lobby: React.FunctionComponent<ILobbyProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isOpenModal, setIsCreateModal] = useState<boolean>(false);

  const trades = useAppSelector(selectTrades);
  const loading = useAppSelector(selectLobbyLoading) === "pending";

  const lobbyError = useAppSelector(selectLobbyError);

  useEffect(() => {
    if (lobbyError) {
      enqueueSnackbar({
        message: lobbyError,
        variant: "error",
      });
    }
  }, [lobbyError]);

  const columns = ["Предмет торгов", "Участники", "Статус"];

  useEffect(() => {
    dispatch(getTrades());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsCreateModal(true);
  };

  const handleCloseModal = () => {
    setIsCreateModal(false);
  };

  const handleCreateTrade = (trade: ITradeCreate) => {
    dispatch(createTrade(trade));
    setIsCreateModal(false);
  };

  const handleRouteTrade = (tradeId: string) => {
    navigate(`/trade/${tradeId}`);
  };
  return (
    <>
      <TableContainer sx={{ m: "5px" }} component={Paper}>
        {loading && <LinearProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="head"></TableCell>
              <TableCell variant="head">
                <Typography variant="h6" align="center">
                  Торги
                </Typography>
              </TableCell>
              <TableCell variant="head" align="right">
                <IconButton onClick={handleOpenModal}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  {column}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => (
              <StyledTableRow
                key={`trade-${trade._id}`}
                onClick={() => handleRouteTrade(trade._id)}
              >
                <StyledTableCell>{trade.title}</StyledTableCell>
                <StyledTableCell sx={{ whiteSpace: "pre-wrap" }} align="center">
                  {trade.participants.map((p) => `${p.name} \n`)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {ETradeStatus[trade.status]}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={isOpenModal}
        title="Создать торги"
        onClose={handleCloseModal}
      >
        <CreateTrade onSubmit={handleCreateTrade} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default Lobby;
