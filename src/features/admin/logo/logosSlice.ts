import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { Logo, LogoParams } from "../../../app/models/Logo";

interface LogosState {
  isLoaded: boolean;
  status: string;
  logoParams: LogoParams;
  metaData: MetaData | null;
}

const logosAdapter = createEntityAdapter<Logo>();

function getAxiosParams(param: LogoParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);

  return params;
}

export const fetchLogosAsync = createAsyncThunk<
  Logo[],
  void,
  { state: RootState }
>("Logo/fetchLogosAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().logo.logoParams);
  try {
    var response = await agent.Admin.logoList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): LogoParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const logoSlice = createSlice({
  name: "Logo",
  initialState: logosAdapter.getInitialState<LogosState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    logoParams: initParams(),
  }),
  reducers: {
    setLogo: (state, action) => {
      logosAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.logoParams = {
        ...state.logoParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    setLogoParams: (state, action) => {
      state.isLoaded = false;
      state.logoParams = {
        ...state.logoParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    removeLogo: (state, action) => {
      logosAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogosAsync.pending, (state, action) => {
      state.status = "pendingFetchLogosAsync";
    });
    builder.addCase(fetchLogosAsync.fulfilled, (state, action) => {
      logosAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchLogosAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const logoSelectors = logosAdapter.getSelectors(
  (state: RootState) => state.logo
);

export const {
  setMetaData,
  setLogo,
  removeLogo,
  setPageNumber,
  setLogoParams,
} = logoSlice.actions;
