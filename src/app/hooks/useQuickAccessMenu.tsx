import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchQuickAccessMenuAsync,
  quickAccessMenuSelectors,
} from "../../features/admin/quickAccessMenu/quickAccessMenuSlice";

export default function useQuickAccessMenu() {
  const quickAccessMenu = useAppSelector(quickAccessMenuSelectors.selectAll);
  const { isLoaded, status, metaData } = useAppSelector(
    (state) => state.quickAccess
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchQuickAccessMenuAsync());
  }, [isLoaded, dispatch]);

  return {
    quickAccessMenu,
    isLoaded,
    status,
    metaData,
  };
}
