import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  customRolesSelectors,
  fetchRolesAsync,
} from "../../features/admin/customRoles/customRolesSlice";

export default function useCustomeRoles() {
  const roles = useAppSelector(customRolesSelectors.selectAll);
  const { isLoaded, status } = useAppSelector((state) => state.customRoles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchRolesAsync());
  }, [isLoaded, dispatch]);

  return {
    roles,
    isLoaded,
    status,
  };
}
