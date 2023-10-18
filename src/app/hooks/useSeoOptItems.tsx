import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchSeoOptItemsAsync,
  seoOptSelectors,
} from "../../features/admin/seoOptimization/seoOptSlice";

export default function useSeoOptItems() {
  const seoOptItems = useAppSelector(seoOptSelectors.selectAll);
  const { isLoaded, status, metaData, seoOptParams } = useAppSelector(
    (state) => state.seoOptItems
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchSeoOptItemsAsync());
  }, [isLoaded, dispatch]);

  return {
    seoOptItems,
    isLoaded,
    status,
    metaData,
    seoOptParams,
  };
}
