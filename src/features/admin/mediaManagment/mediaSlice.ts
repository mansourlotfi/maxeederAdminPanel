import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Media } from "../../../app/models/Media";

interface MediaManagmentState {
  isLoaded: boolean;
  status: string;
}

const mediamanagmentsAdapter = createEntityAdapter<Media>();

export const fetchMediasAsync = createAsyncThunk<
  Media[],
  void,
  { state: RootState }
>("Media/fetchMediasAsync", async (_, thunkAPI) => {
  try {
    let response = await agent.Admin.MediaList();
    let res: Media[] = response.map(
      (R: string, i: number): Media => ({ name: R, id: i })
    );

    return res;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const mediaManagmentsSlice = createSlice({
  name: "Media",
  initialState: mediamanagmentsAdapter.getInitialState<MediaManagmentState>({
    isLoaded: false,
    status: "idle",
  }),
  reducers: {
    setMedia: (state, action) => {
      mediamanagmentsAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    removeMedia: (state, action) => {
      mediamanagmentsAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMediasAsync.pending, (state, action) => {
      state.status = "pendingfetchMediasAsync";
    });
    builder.addCase(fetchMediasAsync.fulfilled, (state, action) => {
      mediamanagmentsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchMediasAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const mediaManagmentSelectors = mediamanagmentsAdapter.getSelectors(
  (state: RootState) => state.media
);

export const { setMedia, removeMedia } = mediaManagmentsSlice.actions;
