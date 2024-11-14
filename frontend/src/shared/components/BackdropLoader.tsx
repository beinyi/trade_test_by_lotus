import * as React from "react";
import {
  Backdrop,
  CircularProgress,
  CircularProgressProps,
} from "@mui/material";

interface IBackdropLoaderProps extends CircularProgressProps {
  loading: boolean;
}

const BackdropLoader: React.FunctionComponent<IBackdropLoaderProps> = ({
  loading,
  ...props
}) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={loading}
    >
      <CircularProgress {...props} />
    </Backdrop>
  );
};

export default BackdropLoader;
