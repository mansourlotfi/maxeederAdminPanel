import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  fetchMainMenusAsync,
  mainMenuSelectors,
} from "../../features/admin/mainMenu/mainMenuSlice";

export default function useMainMenu() {
  const mainMenu = useAppSelector(mainMenuSelectors.selectAll);
  const { isLoaded, status, metaData } = useAppSelector(
    (state) => state.mainMenu
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchMainMenusAsync());
  }, [isLoaded, dispatch]);

  return {
    mainMenu,
    isLoaded,
    status,
    metaData,
  };
}
