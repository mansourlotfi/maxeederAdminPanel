import { Grid, Typography, useMediaQuery } from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";
import BasketDetail from "../basket/BasketDetail";

export default function Review(props: any) {
  const { basket } = useAppSelector((state) => state.basket);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Typography variant="h6" gutterBottom>
        جزئیات سفارش
      </Typography>
      {basket && (
        <>
          {isMobile ? (
            <BasketDetail items={basket.items} isBasket={false} />
          ) : (
            <BasketTable items={basket.items} isBasket={false} />
          )}
        </>
      )}

      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={12} md={6}>
          <BasketSummary {...props} />
        </Grid>
      </Grid>
    </>
  );
}
