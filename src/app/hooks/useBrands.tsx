import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  brandSelectors,
  fetchBrandsAsync,
} from "../../features/admin/brands/brandSlice";

export default function useBrands() {
  const brands = useAppSelector(brandSelectors.selectAll);
  const { brandsLoaded, status } = useAppSelector((state) => state.brands);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!brandsLoaded) dispatch(fetchBrandsAsync());
  }, [brandsLoaded, dispatch]);

  return {
    brands,
    brandsLoaded,
    status,
  };
}
