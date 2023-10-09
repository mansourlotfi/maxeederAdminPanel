import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";

export const dialogTitle: SxProps<Theme> = {
  typography: "subtitle2",
  color: "context.black",
  padding: (theme) => theme.spacing(12),
};

export const dialogContent: SxProps<Theme> = {
  display: "flex",
  typography: "body1",
  justifyContent: "space-between",
  padding: (theme) => theme.spacing(12, 12, 0, 12),
};

export const dialogActions = (center: boolean): SxProps<Theme> => ({
  display: "flex",
  justifyContent: center ? "center" : "space-between",
  padding: (theme) => theme.spacing(12),
});

export const closeButton: SxProps<Theme> = {
  backgroundColor: "grey.200",
  color: "context.dark",
  "&:hover": {
    backgroundColor: "grey.300",
    color: "context.dark",
  },
};

export const submitButton: SxProps<Theme> = {
  backgroundColor: "primary.light",
  "&:hover": {
    backgroundColor: "primary.light",
  },
};
