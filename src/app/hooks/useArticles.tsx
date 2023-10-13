import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  articlesSelectors,
  fetchArticlesAsync,
} from "../../features/admin/articles/articlesSlice";

export default function useArticles() {
  const articles = useAppSelector(articlesSelectors.selectAll);
  const { isLoaded, status, metaData, articlesParams } = useAppSelector(
    (state) => state.article
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchArticlesAsync());
  }, [isLoaded, dispatch]);

  return {
    articles,
    isLoaded,
    status,
    metaData,
    articlesParams,
  };
}
