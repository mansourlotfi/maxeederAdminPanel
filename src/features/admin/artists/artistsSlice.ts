import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { Artist, ArtistParams } from "../../../app/models/Artsts";

interface ArtistsState {
  isLoaded: boolean;
  status: string;
  artistsParams: ArtistParams;
  metaData: MetaData | null;
}

const artistsAdapter = createEntityAdapter<Artist>();

function getAxiosParams(param: ArtistParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  return params;
}

export const fetchArtistsAsync = createAsyncThunk<
  Artist[],
  void,
  { state: RootState }
>("Artist/fetchArtistsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().socialNetworks.socialNetworksParams
  );
  try {
    var response = await agent.Admin.artistList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): ArtistParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const artistsSlice = createSlice({
  name: "Artist",
  initialState: artistsAdapter.getInitialState<ArtistsState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    artistsParams: initParams(),
  }),
  reducers: {
    setArtist: (state, action) => {
      artistsAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.artistsParams = {
        ...state.artistsParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeArtist: (state, action) => {
      artistsAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArtistsAsync.pending, (state, action) => {
      state.status = "pendingFetchArtistsAsync";
    });
    builder.addCase(fetchArtistsAsync.fulfilled, (state, action) => {
      artistsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchArtistsAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const artistsSelectors = artistsAdapter.getSelectors(
  (state: RootState) => state.artists
);

export const { setMetaData, setArtist, removeArtist, setPageNumber } =
  artistsSlice.actions;
