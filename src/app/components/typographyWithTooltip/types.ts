import { TypographyProps, TooltipProps } from "@mui/material";

export interface IProps extends TypographyProps {
  text: string;
  placement?: TooltipProps["placement"];
  Title?: string;
}
