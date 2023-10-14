import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Size } from "../../../app/models/Sizes";

interface SizeState {
  isLoaded: boolean;
  status: string;
}

const sizesAdapter = createEntityAdapter<Size>();

export const fetchSizesAsync = createAsyncThunk<
  Size[],
  void,
  { state: RootState }
>("Size/fetchSizesAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Admin.SizeList();

    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const sizesSlice = createSlice({
  name: "Size",
  initialState: sizesAdapter.getInitialState<SizeState>({
    isLoaded: false,
    status: "idle",
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

export const { setSize, removeSize } = sizesSlice.actions;
