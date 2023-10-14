import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Usage } from "../../../app/models/Usage";

interface UsageState {
  isLoaded: boolean;
  status: string;
}

const usageAdapter = createEntityAdapter<Usage>();

export const fetchUsagesAsync = createAsyncThunk<
  Usage[],
  void,
  { state: RootState }
>("Usage/fetchUsagesAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Admin.UsageList();

    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const usagesSlice = createSlice({
  name: "Usage",
  initialState: usageAdapter.getInitialState<UsageState>({
    isLoaded: false,
    status: "idle",
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

export const { setUsage, removeUsage } = usagesSlice.actions;
