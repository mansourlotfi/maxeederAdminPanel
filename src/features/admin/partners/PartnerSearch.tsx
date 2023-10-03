import { debounce, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { setPartnerParams } from "./partnersSlice";

export default function PartnerSearch() {
  const { partnerParams } = useAppSelector((state) => state.partners);
  const [searchTerm, setSearchTerm] = useState(partnerParams.searchTerm);
  const dispatch = useAppDispatch();
  const debouncedSearchTerm = debounce((event: any) => {
    dispatch(setPartnerParams({ searchTerm: event.target.value }));
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
