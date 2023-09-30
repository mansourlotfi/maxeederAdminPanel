import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  usersSelectors,
  fetchUsersAsync,
} from "../../features/admin/users/usersSlice";

export default function useUsers() {
  const users = useAppSelector(usersSelectors.selectAll);

  const { isLoaded, metaData, status } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) dispatch(fetchUsersAsync());
  }, [isLoaded, dispatch]);

  return {
    users,
    isLoaded,
    status,
    metaData,
  };
}
