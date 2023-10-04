import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchSlidesAsync,
  slidesSelectors,
} from "../../features/admin/slides/slidesSlice";

export default function useSlides() {
  const slides = useAppSelector(slidesSelectors.selectAll);
  const { isLoaded, status, metaData, slidesParams } = useAppSelector(
    (state) => state.slides
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchSlidesAsync());
  }, [isLoaded, dispatch]);

  return {
    slides,
    isLoaded,
    status,
    metaData,
    slidesParams,
  };
}
