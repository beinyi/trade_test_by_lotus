import {
  Box,
  Button,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import * as React from "react";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ITradeCreate } from "@shared/types/trade";
import { useAppSelector } from "@store/hooks";
import { selectLobbySending } from "@modules/lobby/store/lobbySlice";

const MAX_PARTICIPANTS = 4;

interface ICreateTradeProps {
  onSubmit: (data: ITradeCreate) => void;
  onClose: () => void;
}

const CreateTrade: React.FunctionComponent<ICreateTradeProps> = ({
  onSubmit,
  onClose,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ITradeCreate>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participantData",
  });

  const isSending = useAppSelector(selectLobbySending);

  const handleFormSubmit = (data: ITradeCreate) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const handleAddParticipant = () => {
    if (fields.length < MAX_PARTICIPANTS) {
      append({ name: "" });
    }
  };

  const handleRemoveParticipant = (index: number) => {
    remove(index);
  };
  return (
    <Box maxWidth={360} pl={2} pr={2}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: "Название обязательно" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Название трейда"
              margin="normal"
              variant="outlined"
              error={!!errors.title}
            />
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id} style={{ display: "flex", alignItems: "center" }}>
            <Controller
              key={field.id}
              name={`participantData.${index}.name`}
              control={control}
              defaultValue=""
              rules={{ required: "Имя участника обязательно" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={`Участник ${index + 1}`}
                  margin="normal"
                  variant="outlined"
                  error={!!errors.participantData?.[index]?.name}
                />
              )}
            />
            {fields.length > 2 && (
              <IconButton
                onClick={() => handleRemoveParticipant(index)}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            )}
          </div>
        ))}

        {fields.length < MAX_PARTICIPANTS && (
          <Button
            onClick={handleAddParticipant}
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            style={{ marginTop: "10px" }}
          >
            Добавить участника
          </Button>
        )}

        <DialogActions>
          <Button
            sx={{ margin: "16px" }}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSending}
          >
            {isSending ? "Создание..." : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Box>
  );
};

export default CreateTrade;
