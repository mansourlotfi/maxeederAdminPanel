import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  departmentsSelectors,
  fetchDepartmentsAsync,
} from "../../features/admin/departments/departmentsSlice";

export default function useDepartments() {
  const departments = useAppSelector(departmentsSelectors.selectAll);
  const { isLoaded, status } = useAppSelector((state) => state.departments);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchDepartmentsAsync());
  }, [isLoaded, dispatch]);

  return {
    departments,
    isLoaded,
    status,
  };
}
