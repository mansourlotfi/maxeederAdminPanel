import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchSizesAsync,
  sizesSelectors,
} from "../../features/admin/Sizes/sizesSlice";

export default function useSizes() {
  const sizes = useAppSelector(sizesSelectors.selectAll);
  const { isLoaded, status, metaData, sizeParams } = useAppSelector(
    (state) => state.sizes
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchSizesAsync());
  }, [isLoaded, dispatch]);

  return {
    sizes,
    isLoaded,
    status,
    metaData,
    sizeParams,
  };
}
