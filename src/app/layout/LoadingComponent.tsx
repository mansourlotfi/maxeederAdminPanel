import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  message?: string;
}

export default function LoadingComponent({
  message = "در حال بارگزاری...",
}: Props) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Backdrop open={true} invisible={true}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress size={isMobile ? 24 : 100} />
        {!isMobile ? (
          <Typography
            variant="h4"
            sx={{ justifyContent: "center", position: "fixed", top: "60%" }}
          >
            {message}
          </Typography>
        ) : null}
      </Box>
    </Backdrop>
  );
}
