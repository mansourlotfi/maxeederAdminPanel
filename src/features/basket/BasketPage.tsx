import { Button, Grid, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";
import useMediaQuery from "@mui/material/useMediaQuery";
import BasketDetail from "./BasketDetail";
import EmptyBasket from "./EmptyBasket";

export default function BasketPage() {
  const theme = useTheme();
  const { basket } = useAppSelector((state) => state.basket);
  const isMobile = useMediaQuery("(max-width:600px)");

  if (!basket) return <EmptyBasket />;

  return (
    <>
      {basket.items.length ? (
        <>
          {isMobile ? (
            <BasketDetail items={basket.items} />
          ) : (
            <BasketTable items={basket.items} />
          )}
          <Grid container>
            <Grid item xs={12} md={6}>
              <BasketSummary />
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: theme.palette.secondary.main,
                  "&:hover": {
                    boxShadow: "none",
                    background: theme.palette.secondary.main,
                  },
                  "&:active": {
                    boxShadow: "none",
                    background: theme.palette.secondary.main,
                  },
                }}
              >
                تکمیل سفارش
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <EmptyBasket />
      )}
    </>
  );
}
