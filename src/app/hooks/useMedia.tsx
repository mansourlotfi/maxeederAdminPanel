import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchMediasAsync,
  mediaManagmentSelectors,
} from "../../features/admin/mediaManagment/mediaSlice";

export default function useMedia() {
  const files = useAppSelector(mediaManagmentSelectors.selectAll);
  const { isLoaded, status } = useAppSelector((state) => state.media);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchMediasAsync());
  }, [isLoaded, dispatch]);

  return {
    files,
    isLoaded,
    status,
  };
}
