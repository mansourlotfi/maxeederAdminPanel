import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchPageItemsAsync,
  pageItemsSelectors,
} from "../../features/admin/pageItems/pageItemsSlice";

export default function usePageItems() {
  const pageItems = useAppSelector(pageItemsSelectors.selectAll);
  const { isLoaded, status, metaData, pageItemsParams } = useAppSelector(
    (state) => state.pageItems
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchPageItemsAsync());
  }, [isLoaded, dispatch]);

  return {
    pageItems,
    isLoaded,
    status,
    metaData,
    pageItemsParams,
  };
}
