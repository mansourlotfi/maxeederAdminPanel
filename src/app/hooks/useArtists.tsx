import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  artistsSelectors,
  fetchArtistsAsync,
} from "../../features/admin/artists/artistsSlice";

export default function useArtists() {
  const artists = useAppSelector(artistsSelectors.selectAll);
  const { isLoaded, status, metaData, artistsParams } = useAppSelector(
    (state) => state.artists
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchArtistsAsync());
  }, [isLoaded, dispatch]);

  return {
    artists,
    isLoaded,
    status,
    metaData,
    artistsParams,
  };
}
