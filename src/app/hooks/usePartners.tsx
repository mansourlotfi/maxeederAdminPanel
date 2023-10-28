import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchPartnersAsync,
  partnersSelectors,
} from "../../features/admin/partners/partnersSlice";

export default function usePartners() {
  const partners = useAppSelector(partnersSelectors.selectAll);
  const { isLoaded, status, metaData, partnerParams } = useAppSelector(
    (state) => state.partners
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchPartnersAsync());
  }, [isLoaded, dispatch]);

  return {
    partners,
    isLoaded,
    status,
    metaData,
    partnerParams,
  };
}
