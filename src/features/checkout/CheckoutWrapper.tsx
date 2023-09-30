import CheckoutPage from "./CheckoutPage";
// import { useState, useEffect } from "react";
// import agent from "../../app/api/agent";
// import { useAppDispatch } from "../../app/store/configureStore";
// import { setBasket } from "../basket/basketSlice";
// import LoadingComponent from "../../app/layout/LoadingComponent";

export default function CheckoutWrapper() {
  // const dispatch = useAppDispatch();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   agent.Payments.createPaymentIntent({
  //     api_key: "376de118-4aa6-451e-94c0-3cf1e848a6e6",
  //     amount: 10,
  //     callback_uri: "asd",
  //     order_id: "asd",
  //   })
  //     .then((response) => dispatch(setBasket(response)))
  //     .catch((error) => console.log(error))
  //     .finally(() => setLoading(false));
  // }, [dispatch]);

  // if (loading) return <LoadingComponent message="Loading checkout" />;

  return <CheckoutPage />;
}
