import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  commentSelectors,
  fetchCommentsAsync,
} from "../../features/admin/comments/comentsSlice";

export default function useComments() {
  const comments = useAppSelector(commentSelectors.selectAll);
  const { isLoaded, status, metaData } = useAppSelector(
    (state) => state.comments
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchCommentsAsync());
  }, [isLoaded, dispatch]);

  return {
    comments,
    isLoaded,
    status,
    metaData,
  };
}
