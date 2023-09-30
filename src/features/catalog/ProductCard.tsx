import { LoadingButton } from "@mui/lab";
import {
  CardMedia,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  CardHeader,
  Avatar,
  useMediaQuery,
  Grid,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { addBasketItemAsync } from "../basket/basketSlice";

interface IProps {
  product: Product;
}
function ProductCard({ product }: IProps) {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      <Grid container>
        <Grid item xs={isMobile ? 5 : 12}>
          <CardMedia
            sx={{
              height: 140,
              backgroundSize: isMobile ? "cover" : "contain",
              // bgcolor: "primary.light",
              borderRadius: 4,
              marginLeft: 1,
            }}
            image={product.pictureUrl}
            title={product.name}
          />
        </Grid>
        <Grid item container alignItems="center" xs={isMobile ? 7 : 12}>
          <CardContent>
            <Typography
              gutterBottom
              color="secondry"
              variant="h5"
              component="div"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currencyFormat(product.price)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.brand} / {product.type}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>

      <CardActions>
        <Grid container justifyContent="space-between" mt={1}>
          <LoadingButton
            loading={status.includes("pendingAddItem" + product.id)}
            onClick={() =>
              dispatch(addBasketItemAsync({ productId: product.id }))
            }
            variant="contained"
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
            افزودن به سبد خرید
          </LoadingButton>
          <Button
            component={Link}
            to={`/catalog/${product.id}`}
            variant="outlined"
            sx={{
              borderColor: theme.palette.secondary.main,
            }}
          >
            جزئیات
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
