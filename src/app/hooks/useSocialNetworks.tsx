import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchSocialNetworksAsync,
  socialNetworkSelectors,
} from "../../features/admin/socialNetworks/socialnetworksSlice";

export default function useSocialNetworks() {
  const socialNetworks = useAppSelector(socialNetworkSelectors.selectAll);
  const { isLoaded, status, metaData, socialNetworksParams } = useAppSelector(
    (state) => state.socialNetworks
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchSocialNetworksAsync());
  }, [isLoaded, dispatch]);

  return {
    socialNetworks,
    isLoaded,
    status,
    metaData,
    socialNetworksParams,
  };
}
