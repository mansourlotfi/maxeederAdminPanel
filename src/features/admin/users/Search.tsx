import { debounce, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import SearchIcon from "@mui/icons-material/Search";
import { setUserParams } from "./usersSlice";

export default function UsersSearch() {
  const { userParams } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState(userParams.searchTerm);
  const dispatch = useAppDispatch();
  const debouncedSearchTerm = debounce((event: any) => {
    dispatch(setUserParams({ searchTerm: event.target.value }));
  }, 1500);

  return (
    <TextField
      label="جستجو"
      variant="outlined"
      fullWidth
      value={searchTerm || ""}
      onChange={(event: any) => {
        setSearchTerm(event.target.value);
        debouncedSearchTerm(event);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
