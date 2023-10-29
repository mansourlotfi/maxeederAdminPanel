import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { pageItems, pageItemsParams } from "../../../app/models/PageItems";

interface PageItemsState {
  isLoaded: boolean;
  status: string;
  pageItemsParams: pageItemsParams;
  metaData: MetaData | null;
}

const pageItemsAdapter = createEntityAdapter<pageItems>();

function getAxiosParams(param: pageItemsParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  params.append("page", param.page.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);

  return params;
}

export const fetchPageItemsAsync = createAsyncThunk<
  pageItems[],
  void,
  { state: RootState }
>("PageItems/fetchPageItemsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().pageItems.pageItemsParams);
  try {
    var response = await agent.Admin.pageItemList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): pageItemsParams {
  return {
    pageNumber: 1,
    pageSize: 6,
    page: 1,
  };
}
export const pageItemsSlice = createSlice({
  name: "PageItems",
  initialState: pageItemsAdapter.getInitialState<PageItemsState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    pageItemsParams: initParams(),
  }),
  reducers: {
    setPageItem: (state, action) => {
      pageItemsAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageItemParams: (state, action) => {
      state.isLoaded = false;
      state.pageItemsParams = {
        ...state.pageItemsParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.pageItemsParams = {
        ...state.pageItemsParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removePageItem: (state, action) => {
      pageItemsAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPageItemsAsync.pending, (state, action) => {
      state.status = "pendingFetchPageItemsAsync";
    });
    builder.addCase(fetchPageItemsAsync.fulfilled, (state, action) => {
      pageItemsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchPageItemsAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const pageItemsSelectors = pageItemsAdapter.getSelectors(
  (state: RootState) => state.pageItems
);

export const {
  setMetaData,
  setPageItem,
  removePageItem,
  setPageNumber,
  setPageItemParams,
} = pageItemsSlice.actions;
