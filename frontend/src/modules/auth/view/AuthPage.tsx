import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { ILoginReq } from "../types";
import { flexCenter } from "@shared/sx";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { authParticipant, authUser } from "../store/authAC";
import { selectAuthError, selectAuthLoading } from "../store/authSlice";
import BackdropLoader from "@shared/components/BackdropLoader";
import { useParams } from "react-router-dom";

const AuthPage: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILoginReq>();
  const { enqueueSnackbar } = useSnackbar();

  const { tradeId, participantId } = useParams();

  const loading = useAppSelector(selectAuthLoading) === "pending";
  const authError = useAppSelector(selectAuthError);

  React.useEffect(() => {
    if (authError) {
      enqueueSnackbar({
        message: authError,
        variant: "error",
      });
    }
  }, [authError]);

  React.useEffect(() => {
    if (participantId && tradeId) {
      dispatch(authParticipant({ participantId, tradeId }));
    } else {
      dispatch(authUser());
    }
  }, []);

  const onSubmit = (data: ILoginReq) => {
    dispatch(authUser(data))
      .unwrap()
      .then(() => {
        enqueueSnackbar({
          message: `Добро пожаловать`,
          variant: "success",
        });
      });
  };

  return (
    <>
      <BackdropLoader loading={loading} size={64} color="inherit" />
      <Box
        sx={{
          ...flexCenter,
          height: "100vh",
          background: "linear-gradient(135deg, #ffffff, #e6e6e6);",
        }}
      >
        <Paper
          sx={{
            ...flexCenter,
            flexDirection: "column",
            padding: { xs: "18px", sm: "32px" },
            width: { xs: "200px", sm: "350px" },
            mx: "auto",
            my: "auto",
          }}
          elevation={24}
        >
          <Typography variant="h5" gutterBottom>
            Авторизация
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Имя пользователя"
                  margin="normal"
                  variant="outlined"
                  error={!!errors.username}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Пароль"
                  margin="normal"
                  variant="outlined"
                  type="password"
                  error={!!errors.password}
                />
              )}
            />
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Войти
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default AuthPage;
