import { useEffect } from "react";
import {
  productSelectors,
  fetchProductsAsync,
  fetchFilters,
  fetchFeaturedProductsAsync,
} from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts() {
  const products = useAppSelector(productSelectors.selectAll);

  const {
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    metaData,
    featuredProducts,
    featuredStatus,
    featuredProductsLoaded,
    status,
    productParams,
  } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!featuredProductsLoaded) dispatch(fetchFeaturedProductsAsync());
  }, [featuredProductsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [dispatch, filtersLoaded]);

  return {
    products,
    status,
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    metaData,
    featuredProducts,
    featuredStatus,
    productParams,
  };
}
