import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import * as React from "react";

import CloseIcon from "@mui/icons-material/Close";
import BackdropLoader from "./BackdropLoader";

interface IModalProps extends DialogProps {
  children: React.ReactElement;
  open: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
  noCloseIcon?: boolean;
}

const Modal: React.FunctionComponent<IModalProps> = ({
  children,
  open,
  onClose,
  sx,
  title,
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={undefined}
      PaperProps={{
        sx: {
          width: "auto",
          height: "auto",
          minWidth: "360px",
          maxWidth: "50%",
          maxHeight: "100hv",
          overflow: "unset",
          ...sx,
        },
      }}
    >
      <BackdropLoader loading={isLoading} />
      {title && (
        <DialogTitle
          sx={{
            fontSize: "1rem",
            lineHeight: "initial",
          }}
        >
          {title}
        </DialogTitle>
      )}
      {!isLoading && (
        <DialogActions>
          <IconButton
            size="medium"
            onClick={onClose}
            sx={{ position: "absolute", left: "100%", top: "-50px" }}
            title={"Закрыть"}
          >
            <CloseIcon
              sx={{
                fontSize: 40,
                color: "#AAA",
              }}
            />
          </IconButton>
        </DialogActions>
      )}

      <DialogContent sx={{ padding: "initial" }}>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
