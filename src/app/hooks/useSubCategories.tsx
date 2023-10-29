import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

import {
  fetchSubCategoriesAsync,
  subCategorySelectors,
} from "../../features/admin/subCategory/subCategorySlice";

export default function useSubCategories() {
  const subCategories = useAppSelector(subCategorySelectors.selectAll);
  const { categoriesLoaded, status, metaData, params } = useAppSelector(
    (state) => state.subCategory
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!categoriesLoaded) dispatch(fetchSubCategoriesAsync());
  }, [categoriesLoaded, dispatch]);

  return {
    subCategories,
    categoriesLoaded,
    status,
    metaData,
    params,
  };
}
