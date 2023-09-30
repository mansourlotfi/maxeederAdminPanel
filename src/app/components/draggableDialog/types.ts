import { DialogProps, PaperProps } from "@mui/material";
import { ReactNode } from "react";

export interface IPaperProps extends PaperProps {}

export interface IProps extends Omit<DialogProps, "children"> {
  children?: ReactNode;
}
