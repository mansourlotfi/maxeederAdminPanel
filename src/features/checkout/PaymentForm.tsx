import { Typography } from "@mui/material";
// import AppTextInput from "../../app/components/AppTextInput";

interface Props {
  orderNumber: string;
  transId: string;
  amount: string;
  status: string;
}

export default function PaymentForm(props: Props) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        شماره سفارش : {props.orderNumber}
      </Typography>

      <Typography variant="h6" gutterBottom>
        شماره تراکنش : {props.transId}
      </Typography>

      <Typography variant="h6" gutterBottom>
        مبلغ سفارش : {props.amount}
      </Typography>

      {props.status === "OK" ? (
        <Typography variant="h6" gutterBottom>
          با تشکر از خرید شما. پس از بررسی ارسال انجام میگیرد
        </Typography>
      ) : null}
    </>
  );
}
