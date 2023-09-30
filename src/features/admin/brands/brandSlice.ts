import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Brand } from "../../../app/models/Brand";

interface BrandState {
  brandsLoaded: boolean;
  status: string;
}

const brandsAdapter = createEntityAdapter<Brand>();

export const fetchBrandsAsync = createAsyncThunk<
  Brand[],
  void,
  { state: RootState }
>("catalog/fetchBrandsAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Brand.list();
    return response;
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

export const brandSlice = createSlice({
  name: "brand",
  initialState: brandsAdapter.getInitialState<BrandState>({
    brandsLoaded: false,
    status: "idle",
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

export const { setBrand, removeBrand } = brandSlice.actions;
