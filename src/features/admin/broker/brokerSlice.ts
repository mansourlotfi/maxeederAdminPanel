import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Broker } from "../../../app/models/Broker";

interface BrokerState {
  brokersLoaded: boolean;
  status: string;
}

const brokersAdapter = createEntityAdapter<Broker>();

export const fetchBrokersAsync = createAsyncThunk<
  Broker[],
  void,
  { state: RootState }
>("catalog/fetchBrokersAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Admin.BrokerList();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchBrokerAsync = createAsyncThunk<Broker, number>(
  "catalog/fetchBrokerAsync",
  async (brokerId, thunkAPI) => {
    try {
      const broker = await agent.Admin.brokerDetails(brokerId);
      return broker;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const brokerSlice = createSlice({
  name: "broker",
  initialState: brokersAdapter.getInitialState<BrokerState>({
    brokersLoaded: false,
    status: "idle",
  }),
  reducers: {
    setBroker: (state, action) => {
      brokersAdapter.upsertOne(state, action.payload);
      state.brokersLoaded = false;
    },
    removeBroker: (state, action) => {
      brokersAdapter.removeOne(state, action.payload);
      state.brokersLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBrokersAsync.pending, (state, action) => {
      state.status = "pendingFetchBrokers";
    });
    builder.addCase(fetchBrokersAsync.fulfilled, (state, action) => {
      brokersAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.brokersLoaded = true;
    });
    builder.addCase(fetchBrokersAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(fetchBrokerAsync.pending, (state) => {
      state.status = "pendingFetchBroker";
    });
    builder.addCase(fetchBrokerAsync.fulfilled, (state, action) => {
      brokersAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchBrokerAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const brokerSelectors = brokersAdapter.getSelectors(
  (state: RootState) => state.brokers
);

export const { setBroker, removeBroker } = brokerSlice.actions;
