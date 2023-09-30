import {
  Box,
  Button,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { clearBasket } from "../basket/basketSlice";
import { useAppDispatch } from "../../app/store/configureStore";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";

const steps = ["آدرس ارسال", "مرور سفارش", "پرداخت"];

export default function CheckoutPage() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();

  let callback = searchParams.get("callback");
  let transId = searchParams.get("trans_id");
  let orderId = searchParams.get("order_id");
  let amount = searchParams.get("amount");
  let status = searchParams.get("np_status");
  let ref = searchParams.get("ref");

  const [cookies, setCookie] = useCookies(["ref"]);

  const dispatch = useAppDispatch();
  // const { basket } = useAppSelector((state) => state.basket);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // const [paymentMessage, setPaymentMessage] = useState("");
  // const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  // const subtotal =
  //   basket?.items.reduce((sum, item) => sum + item.quantity * item.price, 0) ??
  //   0;
  // const deliveryFee = subtotal > 300000 ? 0 : 30000;

  const currentValidationSchema = validationSchema[activeStep];

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema),
  });

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <Review {...methods} />;
      case 2:
        return (
          <PaymentForm
            orderNumber={orderId ?? ""}
            amount={amount ?? ""}
            transId={transId ?? ""}
            status={status ?? ""}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({
          ...methods.getValues(),
          ...response,
          saveAddress: false,
        });
      }
    });
  }, [methods]);

  // async function submitOrder(data: FieldValues) {
  //   console.log("data", data);
  //   setLoading(true);
  //   try {
  //   } catch (error) {
  //     console.log(error);

  //     setLoading(false);
  //   }
  // }

  const handleNext = (data: FieldValues) => {
    const { saveAddress, ...address } = data;
    if (activeStep === 1) {
      setLoading(true);
      agent.Orders.create({
        saveAddress,
        shippingAddress: address,
        ref: cookies.ref ?? null,
        noDelivery: address.noDelivery ?? false,
      })
        .then((res) => {
          if (res.code === -1) {
            window.location.href = `https://nextpay.org/nx/gateway/payment/${res.trans_id}`;
          } else {
            toast.error(`خطای شماره ${res.code}`);
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error("پرداخت با مشکل مواجه شد");
          setLoading(false);
        });

      // setPaymentSucceeded(true);
      // setPaymentMessage("Thank you - we have received your payment");
      // dispatch(clearBasket());
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // function submitDisabled(): boolean {
  //   if (activeStep === steps.length - 1) {
  //     return !methods.formState.isValid;
  //   } else {
  //     return !methods.formState.isValid;
  //   }
  // }

  useEffect(() => {
    if (callback === "true") {
      setActiveStep(2);
      dispatch(clearBasket());
    }
  }, [callback, dispatch]);

  useEffect(() => {
    if (ref?.length) {
      setCookie("ref", ref, {
        path: "/",
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        maxAge: 604800,
      });
    }
  }, [ref, setCookie]);

  return (
    <FormProvider {...methods}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          تکمیل سفارش
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {activeStep === 2 ? (
            <PaymentForm
              orderNumber={orderId ?? ""}
              amount={amount ?? ""}
              transId={transId ?? ""}
              status={status ?? ""}
            />
          ) : (
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              {activeStep === 1 ? (
                <Grid container justifyContent="flex-end">
                  <Grid item md={2} xs={6} mt={4}>
                    <img
                      src="https://nextpay.org/storage/2019/12/nextpay-pay-button.png"
                      loading="lazy"
                      alt="nextPay"
                      width="100%"
                      height={60}
                    />
                  </Grid>
                </Grid>
              ) : null}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <LoadingButton
                  loading={loading}
                  // disabled={submitDisabled()}
                  variant="contained"
                  type="submit"
                  sx={{
                    mt: 3,
                    ml: 1,
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
                  {activeStep === 1
                    ? "پرداخت با درگاه اینترنتی معتبر"
                    : "مرحله بعد"}
                </LoadingButton>
              </Box>
            </form>
          )}
        </>
      </Paper>
    </FormProvider>
  );
}
