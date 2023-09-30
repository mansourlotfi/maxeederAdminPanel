import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { useFormContext } from "react-hook-form";

interface Props {
  subtotal?: number;
}

export default function BasketSummary(props: Props) {
  let { subtotal } = props;
  const x = useFormContext();
  let noDelivery;
  if (x) noDelivery = x.getValues("noDelivery");

  const { basket } = useAppSelector((state) => state.basket);
  if (subtotal === undefined)
    subtotal =
      basket?.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ) ?? 0;
  let deliveryFee = subtotal > 300000 ? 0 : 30000;

  if (noDelivery) deliveryFee = 0;

  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>جمع</TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                }}
                align="right"
              >
                {currencyFormat(subtotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>هزینه ارسال*</TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                }}
                align="right"
              >
                {currencyFormat(deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>جمع کل</TableCell>
              <TableCell
                align="right"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {currencyFormat(subtotal + deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *ارسال رایگان بالای 300 هزار تومان
                </span>
                <span style={{ fontStyle: "italic", display: "inline-block" }}>
                  (تحویل حضوری بدون هزینه)
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
