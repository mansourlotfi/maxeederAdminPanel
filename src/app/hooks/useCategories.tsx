import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  categorySelectors,
  fetchCategoriesAsync,
} from "../../features/admin/category/categorySlice";

export default function useCategories() {
  const categories = useAppSelector(categorySelectors.selectAll);
  const { categoriesLoaded, status } = useAppSelector(
    (state) => state.category
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!categoriesLoaded) dispatch(fetchCategoriesAsync());
  }, [categoriesLoaded, dispatch]);

  return {
    categories,
    categoriesLoaded,
    status,
  };
}
