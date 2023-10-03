import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import {
  SocialNetworks,
  SocialNetworksParams,
} from "../../../app/models/socialNetwork";
import { MetaData } from "../../../app/models/pagination";

interface SocialNetworksState {
  isLoaded: boolean;
  status: string;
  socialNetworksParams: SocialNetworksParams;
  metaData: MetaData | null;
}

const socialNetworksAdapter = createEntityAdapter<SocialNetworks>();

function getAxiosParams(param: SocialNetworksParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  return params;
}

export const fetchSocialNetworksAsync = createAsyncThunk<
  SocialNetworks[],
  void,
  { state: RootState }
>("SocialNetworks/fetchSocialNetworksAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().socialNetworks.socialNetworksParams
  );
  try {
    var response = await agent.Admin.socialNetworksList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): SocialNetworksParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const socialNetworkSlice = createSlice({
  name: "socialNetwork",
  initialState: socialNetworksAdapter.getInitialState<SocialNetworksState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    socialNetworksParams: initParams(),
  }),
  reducers: {
    setSocialNetwork: (state, action) => {
      socialNetworksAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.socialNetworksParams = {
        ...state.socialNetworksParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeSocialNetwork: (state, action) => {
      socialNetworksAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSocialNetworksAsync.pending, (state, action) => {
      state.status = "pendingFetchSocialNetworksAsync";
    });
    builder.addCase(fetchSocialNetworksAsync.fulfilled, (state, action) => {
      socialNetworksAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchSocialNetworksAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const socialNetworkSelectors = socialNetworksAdapter.getSelectors(
  (state: RootState) => state.socialNetworks
);

export const {
  setMetaData,
  setSocialNetwork,
  removeSocialNetwork,
  setPageNumber,
} = socialNetworkSlice.actions;
