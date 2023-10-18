import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import {
  SeoOptimization,
  SeoOptimizationParams,
} from "../../../app/models/SeoOptimization";

interface SeoOptState {
  isLoaded: boolean;
  status: string;
  seoOptParams: SeoOptimizationParams;
  metaData: MetaData | null;
}

const seoOptAdapter = createEntityAdapter<SeoOptimization>();

function getAxiosParams(param: SeoOptimizationParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  params.append("page", param.page.toString());

  return params;
}

export const fetchSeoOptItemsAsync = createAsyncThunk<
  SeoOptimization[],
  void,
  { state: RootState }
>("SeoOptimization/fetchSeoOptItemsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().seoOptItems.seoOptParams);
  try {
    var response = await agent.Admin.getSeoOptimizationsData(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): SeoOptimizationParams {
  return {
    pageNumber: 1,
    pageSize: 6,
    page: 1,
  };
}
export const seoOptItemsSlice = createSlice({
  name: "SeoOptimization",
  initialState: seoOptAdapter.getInitialState<SeoOptState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    seoOptParams: initParams(),
  }),
  reducers: {
    setSeoOpt: (state, action) => {
      seoOptAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setSeoOptParams: (state, action) => {
      state.isLoaded = false;
      state.seoOptParams = {
        ...state.seoOptParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.seoOptParams = {
        ...state.seoOptParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeSeoOpt: (state, action) => {
      seoOptAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeoOptItemsAsync.pending, (state, action) => {
      state.status = "pendingFetchSeoOptItemsAsync";
    });
    builder.addCase(fetchSeoOptItemsAsync.fulfilled, (state, action) => {
      seoOptAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchSeoOptItemsAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const seoOptSelectors = seoOptAdapter.getSelectors(
  (state: RootState) => state.seoOptItems
);

export const {
  setMetaData,
  setSeoOpt,
  removeSeoOpt,
  setPageNumber,
  setSeoOptParams,
} = seoOptItemsSlice.actions;
