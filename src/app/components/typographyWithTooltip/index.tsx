import { memo } from "react";

import { Tooltip, Typography } from "@mui/material";

import type * as types from "./types";
import * as styles from "./styles";

const TypographyWithTooltip = memo(
  ({
    Title,
    text,
    placement,

    sx,
    ...rest
  }: types.IProps) => {
    const sxStyles = { ...styles.text, ...sx };

    return (
      <Tooltip
        title={Title !== undefined ? Title : text}
        placement={placement ?? "bottom-start"}
      >
        <Typography sx={sxStyles} {...rest}>
          {text}
        </Typography>
      </Tooltip>
    );
  }
);

export default TypographyWithTooltip;
export { TypographyWithTooltip };
