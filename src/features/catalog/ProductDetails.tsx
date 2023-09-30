import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";
import { EntityId } from "@reduxjs/toolkit";
import useMediaQuery from "@mui/material/useMediaQuery";
import { currencyFormat } from "../../app/util/util";
import { useCookies } from "react-cookie";

function ProductDetails() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { basket, status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const product = useAppSelector((state) =>
    productSelectors.selectById(state, id as EntityId)
  );

  const { status: productStatus } = useAppSelector((state) => state.catalog);
  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find((i) => i.productId === product?.id);

  const [searchParams] = useSearchParams();
  let ref = searchParams.get("ref");
  const [, setCookie] = useCookies(["ref"]);

  useEffect(() => {
    if (ref?.length) {
      setCookie("ref", ref, {
        path: "/",
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        maxAge: 604800,
      });
    }
  }, [ref, setCookie]);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }

    if (!product) dispatch(fetchProductAsync(parseInt(id!)));
  }, [id, item, product, dispatch]);

  function handleInputeChange(e: any) {
    if (e.target.value >= 0) {
      setQuantity(parseInt(e.target.value));
    }
  }

  function handleUpdateCart() {
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(
        addBasketItemAsync({
          productId: product?.id!,
          quantity: updatedQuantity,
        })
      );
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(
        removeBasketItemAsync({
          productId: product?.id!,
          quantity: updatedQuantity,
        })
      );
    }
  }

  if (productStatus.includes("pending")) return <LoadingComponent />;

  if (!product) return <NotFound />;

  return (
    <Grid container>
      <Grid container>
        <IconButton
          component={Link}
          to="/catalog"
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2, mb: 2 }}
        >
          <Avatar
            variant="square"
            alt="back"
            src="/assets/icons/back.png"
            sx={{ width: 24, height: 24 }}
          />
        </IconButton>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={4} md={6}>
          <img
            src={product.pictureUrl}
            alt={product.name}
            style={{ width: "100%" }}
          />
        </Grid>
        {isMobile ? (
          <Grid item xs={8} alignSelf="center">
            <Typography variant="h6">{product.name}</Typography>
          </Grid>
        ) : null}
        <Grid item xs={12} md={6}>
          {!isMobile ? (
            <Typography variant="h4">{product.name}</Typography>
          ) : null}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h4" color="secondary">
            {currencyFormat(product.price)}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>نام</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>توضیحات</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>نوع</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>برند</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>تعداد موجود</TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                onChange={handleInputeChange}
                variant="outlined"
                type="number"
                label="تعداد خرید"
                fullWidth
                value={quantity}
                sx={{
                  borderColor: "secondary.main",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={
                  item?.quantity === quantity || (!item && quantity === 0)
                }
                loading={status.includes("pending")}
                onClick={handleUpdateCart}
                color="primary"
                size="large"
                variant="contained"
                fullWidth
                sx={{
                  height: 55,
                  backgroundColor: "secondary.main",
                }}
              >
                {item ? "بروزرسانی تعداد" : "افزودن به سبد خرید"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProductDetails;
