import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  brokerSelectors,
  fetchBrokersAsync,
} from "../../features/admin/broker/brokerSlice";

export default function useBrands() {
  const brokers = useAppSelector(brokerSelectors.selectAll);
  const { brokersLoaded, status } = useAppSelector((state) => state.brokers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!brokersLoaded) dispatch(fetchBrokersAsync());
  }, [brokersLoaded, dispatch]);

  return {
    brokers,
    brokersLoaded,
    status,
  };
}
