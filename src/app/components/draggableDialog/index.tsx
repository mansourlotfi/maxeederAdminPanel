import { memo } from "react";
import { Dialog } from "@mui/material";
import type * as types from "./types";

const DialogComponent = memo((props: types.IProps) => {
  return <Dialog fullWidth {...props} children={props.children} />;
});

export default DialogComponent;
export { DialogComponent };
