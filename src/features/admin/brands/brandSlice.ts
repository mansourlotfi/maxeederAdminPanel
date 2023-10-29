import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Brand, BrandParams } from "../../../app/models/Brand";
import { MetaData } from "../../../app/models/pagination";

interface BrandState {
  brandsLoaded: boolean;
  status: string;
  brandParams: BrandParams;
  metaData: MetaData | null;
}

const brandsAdapter = createEntityAdapter<Brand>();

function getAxiosParams(param: BrandParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);
  return params;
}

export const fetchBrandsAsync = createAsyncThunk<
  Brand[],
  void,
  { state: RootState }
>("catalog/fetchBrandsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().brands.brandParams);

  try {
    var response = await agent.Brand.list(params);
    thunkAPI.dispatch(setMetaData(response.metaData));

    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchBrandAsync = createAsyncThunk<Brand, number>(
  "catalog/fetchBrandAsync",
  async (brandId, thunkAPI) => {
    try {
      const brand = await agent.Brand.details(brandId);
      return brand;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

function initParams(): BrandParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}

export const brandSlice = createSlice({
  name: "brand",
  initialState: brandsAdapter.getInitialState<BrandState>({
    brandsLoaded: false,
    status: "idle",
    metaData: null,
    brandParams: initParams(),
  }),
  reducers: {
    setBrand: (state, action) => {
      brandsAdapter.upsertOne(state, action.payload);
      state.brandsLoaded = false;
    },
    removeBrand: (state, action) => {
      brandsAdapter.removeOne(state, action.payload);
      state.brandsLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.brandsLoaded = false;
      state.brandParams = {
        ...state.brandParams,
        ...action.payload,
      };
    },
    setBrandParams: (state, action) => {
      state.brandsLoaded = false;
      state.brandParams = {
        ...state.brandParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBrandsAsync.pending, (state, action) => {
      state.status = "pendingFetchBrands";
    });
    builder.addCase(fetchBrandsAsync.fulfilled, (state, action) => {
      brandsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.brandsLoaded = true;
    });
    builder.addCase(fetchBrandsAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(fetchBrandAsync.pending, (state) => {
      state.status = "pendingFetchBrand";
    });
    builder.addCase(fetchBrandAsync.fulfilled, (state, action) => {
      brandsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchBrandAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const brandSelectors = brandsAdapter.getSelectors(
  (state: RootState) => state.brands
);

export const {
  setBrand,
  removeBrand,
  setPageNumber,
  setBrandParams,
  setMetaData,
} = brandSlice.actions;
