import { debounce, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import SearchIcon from "@mui/icons-material/Search";
import { setProductFeatureParams } from "./productFeaturesSlice";

export default function FeatureSearch() {
  const { productFeatureParams } = useAppSelector(
    (state) => state.productFeature
  );
  const [searchTerm, setSearchTerm] = useState(productFeatureParams.searchTerm);
  const dispatch = useAppDispatch();
  const debouncedSearchTerm = debounce((event: any) => {
    dispatch(setProductFeatureParams({ searchTerm: event.target.value }));
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
