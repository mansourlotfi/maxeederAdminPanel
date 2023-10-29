import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Size, SizeParams } from "../../../app/models/Sizes";
import { MetaData } from "../../../app/models/pagination";

interface SizeState {
  isLoaded: boolean;
  status: string;
  sizeParams: SizeParams;
  metaData: MetaData | null;
}

const sizesAdapter = createEntityAdapter<Size>();

function getAxiosParams(param: SizeParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);
  return params;
}

export const fetchSizesAsync = createAsyncThunk<
  Size[],
  void,
  { state: RootState }
>("Size/fetchSizesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().sizes.sizeParams);

  try {
    var response = await agent.Admin.SizeList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));

    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): SizeParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}

export const sizesSlice = createSlice({
  name: "Size",
  initialState: sizesAdapter.getInitialState<SizeState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    sizeParams: initParams(),
  }),
  reducers: {
    setSize: (state, action) => {
      sizesAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    removeSize: (state, action) => {
      sizesAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.sizeParams = {
        ...state.sizeParams,
        ...action.payload,
      };
    },
    setSizeParams: (state, action) => {
      state.isLoaded = false;
      state.sizeParams = {
        ...state.sizeParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSizesAsync.pending, (state, action) => {
      state.status = "pendingfetchSizesAsync";
    });
    builder.addCase(fetchSizesAsync.fulfilled, (state, action) => {
      sizesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchSizesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const sizesSelectors = sizesAdapter.getSelectors(
  (state: RootState) => state.sizes
);

export const {
  setSize,
  removeSize,
  setMetaData,
  setPageNumber,
  setSizeParams,
} = sizesSlice.actions;
