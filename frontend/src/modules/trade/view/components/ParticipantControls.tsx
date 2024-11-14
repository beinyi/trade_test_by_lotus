import { useTradeSocket } from "@modules/trade/service/TradeSocketContext";
import { Box, Button, Paper, Skeleton, Stack, TextField } from "@mui/material";
import { IBidCreate } from "@shared/types/bid";
import { ITrade } from "@shared/types/trade";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

interface IParticipantControlsProps {}

const ParticipantControls: React.FunctionComponent<
  IParticipantControlsProps
> = () => {
  const { tradeId, participantId } = useParams();
  const { socket, trade } = useTradeSocket();

  const handleAddBid = useCallback(
    (bid: Omit<IBidCreate, "tradeId" | "participantId">) => {
      if (socket) {
        socket.emit("addBid", { tradeId, participantId, ...bid });
      }
    },
    [socket, participantId, tradeId]
  );

  const handleSkipTurn = useCallback(() => {
    if (socket) {
      socket.emit("skipTurn", { tradeId, participantId });
    }
  }, [socket, participantId, tradeId]);

  return (
    <Box component={Paper} px={1} py={1}>
      <ParticipantControlsItems
        onAddBid={handleAddBid}
        onSkipTurn={handleSkipTurn}
        participantId={participantId}
        trade={trade}
      />
    </Box>
  );
};

const ParticipantControlsItems: React.FunctionComponent<{
  onAddBid: (bid: Omit<IBidCreate, "tradeId" | "participantId">) => void;
  onSkipTurn: () => void;
  trade?: ITrade;
  participantId?: string;
}> = React.memo(
  ({
    onAddBid: handleAddBid,
    onSkipTurn: handleSkipTurn,
    trade,
    participantId,
  }) => {
    const isActive = trade?.status === "active";

    const {
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<Omit<IBidCreate, "tradeId" | "participantId">>();

    const handleReset = () => {
      if (trade) {
        const bid = trade.participants
          .find((p) => p._id === participantId)
          ?.bids.at(-1);
        if (bid) {
          reset({
            prodTime: bid.prodTime,
            warrantyTime: bid.warrantyTime,
            paymentTerms: bid.paymentTerms,
            amount: bid.amount,
          });
        }
      }
    };

    useEffect(() => {
      handleReset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trade]);

    return (
      <form onSubmit={handleSubmit(handleAddBid)}>
        <Stack spacing={2}>
          {trade ? (
            <>
              <Controller
                name="prodTime"
                control={control}
                rules={{
                  required: "Поле обязательно",
                  min: {
                    value: 1,
                    message: "Срок изготовления не может быть меньше 1",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Срок изготовления, д."
                    fullWidth
                    error={!!errors.prodTime}
                    helperText={errors.prodTime ? errors.prodTime.message : ""}
                  />
                )}
              />

              <Controller
                name="warrantyTime"
                control={control}
                rules={{
                  required: "Поле обязательно",
                  min: {
                    value: 1,
                    message: "Гарантийный срок не может быть меньше 1",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Гарантийный срок, мес."
                    fullWidth
                    error={!!errors.warrantyTime}
                    helperText={
                      errors.warrantyTime ? errors.warrantyTime.message : ""
                    }
                  />
                )}
              />

              <Controller
                name="paymentTerms"
                control={control}
                rules={{
                  required: "Поле обязательно",
                  min: {
                    value: 0,
                    message: "Условия оплаты не могут быть отрицательными",
                  },
                  max: {
                    value: 100,
                    message: "Условия оплаты не могут превышать 100%",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Условия оплаты, %"
                    fullWidth
                    error={!!errors.paymentTerms}
                    helperText={
                      errors.paymentTerms ? errors.paymentTerms.message : ""
                    }
                  />
                )}
              />

              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Поле обязательно",
                  min: {
                    value: 1,
                    message: "Стоимость не может быть меньше 1",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Стоимость, руб."
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount ? errors.amount.message : ""}
                  />
                )}
              />
            </>
          ) : (
            <InputSkeleton />
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isActive}
          >
            Сделать ставку
          </Button>
          <Button
            onClick={handleSkipTurn}
            variant="contained"
            color="secondary"
            disabled={!isActive}
          >
            Пропустить ход
          </Button>
        </Stack>
      </form>
    );
  },
  (prevProp, nextProp) => prevProp.trade?.status === nextProp.trade?.status
);

const InputSkeleton: React.FunctionComponent = () => {
  const skeleton = [];
  for (let i = 0; i < 4; i++) {
    skeleton.push(<Skeleton width={"100%"} height={56} />);
  }

  return skeleton;
};

export default ParticipantControls;
