import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchUsagesAsync,
  usagesSelectors,
} from "../../features/admin/usage/usageSlice";

export default function useUsages() {
  const usages = useAppSelector(usagesSelectors.selectAll);
  const { isLoaded, status, metaData, params } = useAppSelector(
    (state) => state.usages
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchUsagesAsync());
  }, [isLoaded, dispatch]);

  return {
    usages,
    isLoaded,
    status,
    metaData,
    params,
  };
}
