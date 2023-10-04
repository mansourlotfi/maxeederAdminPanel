import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchLogosAsync,
  logoSelectors,
} from "../../features/admin/logo/logosSlice";

export default function useSocialNetworks() {
  const logos = useAppSelector(logoSelectors.selectAll);
  const { isLoaded, status, metaData } = useAppSelector((state) => state.logo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchLogosAsync());
  }, [isLoaded, dispatch]);

  return {
    logos,
    isLoaded,
    status,
    metaData,
  };
}
