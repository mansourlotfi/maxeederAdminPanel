import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import {
  QuickAccessMenu,
  QuickAccessMenuParams,
} from "../../../app/models/QuickAccessMenu";

interface QuickAccessMenuAdapterState {
  isLoaded: boolean;
  status: string;
  quickAccessMenuParams: QuickAccessMenuParams;
  metaData: MetaData | null;
}

const quickAccessMenuAdapter = createEntityAdapter<QuickAccessMenu>();

function getAxiosParams(param: QuickAccessMenuParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  return params;
}

export const fetchQuickAccessMenuAsync = createAsyncThunk<
  QuickAccessMenu[],
  void,
  { state: RootState }
>("MainMenu/fetchQuickAccessMenuAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().quickAccess.quickAccessMenuParams
  );
  try {
    var response = await agent.Admin.quickAccessList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): QuickAccessMenuParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const QuickAccessMenulice = createSlice({
  name: "MainMenu",
  initialState:
    quickAccessMenuAdapter.getInitialState<QuickAccessMenuAdapterState>({
      isLoaded: false,
      status: "idle",
      metaData: null,
      quickAccessMenuParams: initParams(),
    }),
  reducers: {
    setMenu: (state, action) => {
      quickAccessMenuAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.quickAccessMenuParams = {
        ...state.quickAccessMenuParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeMenu: (state, action) => {
      quickAccessMenuAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuickAccessMenuAsync.pending, (state, action) => {
      state.status = "pendingFetchQuickAccessMenuAsync";
    });
    builder.addCase(fetchQuickAccessMenuAsync.fulfilled, (state, action) => {
      quickAccessMenuAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchQuickAccessMenuAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const quickAccessMenuSelectors = quickAccessMenuAdapter.getSelectors(
  (state: RootState) => state.quickAccess
);

export const { setMetaData, setMenu, removeMenu, setPageNumber } =
  QuickAccessMenulice.actions;
