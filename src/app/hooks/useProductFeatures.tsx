import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchProductFeaturesAsync,
  productFeaturesSelectors,
} from "../../features/admin/productFeatures/productFeaturesSlice";

export default function useProductFeatures() {
  const productFeatures = useAppSelector(productFeaturesSelectors.selectAll);
  const { isLoaded, status, metaData, productFeatureParams } = useAppSelector(
    (state) => state.productFeature
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchProductFeaturesAsync());
  }, [isLoaded, dispatch]);

  return {
    productFeatures,
    isLoaded,
    status,
    metaData,
    productFeatureParams,
  };
}
