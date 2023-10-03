import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { Partner, PartnerParams } from "../../../app/models/Partner";

interface PartnerState {
  isLoaded: boolean;
  status: string;
  partnerParams: PartnerParams;
  metaData: MetaData | null;
}

const partnerAdapter = createEntityAdapter<Partner>();

function getAxiosParams(param: PartnerParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);
  return params;
}

export const fetchPartnersAsync = createAsyncThunk<
  Partner[],
  void,
  { state: RootState }
>("MainMenu/fetchPartnersAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().partners.partnerParams);
  try {
    var response = await agent.Admin.partnersList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): PartnerParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const PartnersSlice = createSlice({
  name: "MainMenu",
  initialState: partnerAdapter.getInitialState<PartnerState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    partnerParams: initParams(),
  }),
  reducers: {
    setPartnerParams: (state, action) => {
      state.isLoaded = false;
      state.partnerParams = {
        ...state.partnerParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPartner: (state, action) => {
      partnerAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.partnerParams = {
        ...state.partnerParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removePartner: (state, action) => {
      partnerAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPartnersAsync.pending, (state, action) => {
      state.status = "pendingfetchPartnersAsync";
    });
    builder.addCase(fetchPartnersAsync.fulfilled, (state, action) => {
      partnerAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchPartnersAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const partnersSelectors = partnerAdapter.getSelectors(
  (state: RootState) => state.partners
);

export const {
  setMetaData,
  setPartner,
  removePartner,
  setPageNumber,
  setPartnerParams,
} = PartnersSlice.actions;
