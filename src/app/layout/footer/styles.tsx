import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";

export const navbar: SxProps<Theme> = {
  backgroundColor: "#203040",
  "& a": {
    color: "#ffffdd",
    marginLeft: 10,
  },
};

export const body: SxProps<Theme> = {
  minHeight: "900px",
};

export const footer: SxProps<Theme> = {
  textAlign: "center",
  marginTop: 10,
};
