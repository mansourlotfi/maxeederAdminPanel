import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import {
  ProductFeature,
  ProductFeatureParams,
} from "../../../app/models/ProductFeatures";

interface ProductFeaturesState {
  isLoaded: boolean;
  status: string;
  productFeatureParams: ProductFeatureParams;
  metaData: MetaData | null;
}

const productFeaturesAdapter = createEntityAdapter<ProductFeature>();

function getAxiosParams(param: ProductFeatureParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  return params;
}

export const fetchProductFeaturesAsync = createAsyncThunk<
  ProductFeature[],
  void,
  { state: RootState }
>("ProductFeature/fetchProductFeaturesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().productFeature.productFeatureParams
  );
  try {
    var response = await agent.Admin.productFeatureList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));

    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): ProductFeatureParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const productFeaturesSlice = createSlice({
  name: "ProductFeature",
  initialState: productFeaturesAdapter.getInitialState<ProductFeaturesState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    productFeatureParams: initParams(),
  }),
  reducers: {
    setProductFeature: (state, action) => {
      productFeaturesAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.productFeatureParams = {
        ...state.productFeatureParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeProductFeature: (state, action) => {
      productFeaturesAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductFeaturesAsync.pending, (state, action) => {
      state.status = "pendingFetchProductFeaturesAsync";
    });
    builder.addCase(fetchProductFeaturesAsync.fulfilled, (state, action) => {
      productFeaturesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchProductFeaturesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const productFeaturesSelectors = productFeaturesAdapter.getSelectors(
  (state: RootState) => state.productFeature
);

export const {
  setMetaData,
  setProductFeature,
  removeProductFeature,
  setPageNumber,
} = productFeaturesSlice.actions;
