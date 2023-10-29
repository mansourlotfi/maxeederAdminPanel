import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Usage, UsageParams } from "../../../app/models/Usage";
import { MetaData } from "../../../app/models/pagination";

interface UsageState {
  isLoaded: boolean;
  status: string;
  params: UsageParams;
  metaData: MetaData | null;
}

const usageAdapter = createEntityAdapter<Usage>();

function getAxiosParams(productParams: UsageParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);

  return params;
}

export const fetchUsagesAsync = createAsyncThunk<
  Usage[],
  void,
  { state: RootState }
>("Usage/fetchUsagesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().usages.params);

  try {
    var response = await agent.Admin.UsageList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));

    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): UsageParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}

export const usagesSlice = createSlice({
  name: "Usage",
  initialState: usageAdapter.getInitialState<UsageState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    params: initParams(),
  }),
  reducers: {
    setUsage: (state, action) => {
      usageAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    removeUsage: (state, action) => {
      usageAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
    setParams: (state, action) => {
      state.isLoaded = false;
      state.params = {
        ...state.params,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.params = { ...state.params, ...action.payload };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetParams: (state) => {
      state.params = initParams();
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsagesAsync.pending, (state, action) => {
      state.status = "pendingfetchUsagesAsync";
    });
    builder.addCase(fetchUsagesAsync.fulfilled, (state, action) => {
      usageAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchUsagesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const usagesSelectors = usageAdapter.getSelectors(
  (state: RootState) => state.usages
);

export const {
  setUsage,
  removeUsage,
  setMetaData,
  setParams,
  setPageNumber,
  resetParams,
} = usagesSlice.actions;
