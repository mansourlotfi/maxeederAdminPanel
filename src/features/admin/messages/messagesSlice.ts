import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { Message, MessageParams } from "../../../app/models/Message";

interface MessagesState {
  isLoaded: boolean;
  status: string;
  messageParams: MessageParams;
  metaData: MetaData | null;
}

const messageAdapter = createEntityAdapter<Message>();

function getAxiosParams(param: MessageParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);

  return params;
}

export const fetchMessagesAsync = createAsyncThunk<
  Message[],
  void,
  { state: RootState }
>("MainMenu/fetchMessagesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().messages.messageParams);
  try {
    var response = await agent.Admin.messageList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): MessageParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const messagesSlice = createSlice({
  name: "Messages",
  initialState: messageAdapter.getInitialState<MessagesState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    messageParams: initParams(),
  }),
  reducers: {
    setmessageParams: (state, action) => {
      state.isLoaded = false;
      state.messageParams = {
        ...state.messageParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setMessage: (state, action) => {
      messageAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.messageParams = {
        ...state.messageParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeMessage: (state, action) => {
      messageAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesAsync.pending, (state, action) => {
      state.status = "pendingfetchMessagesAsync";
    });
    builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
      messageAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchMessagesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const messagesSelectors = messageAdapter.getSelectors(
  (state: RootState) => state.messages
);

export const {
  setMetaData,
  setMessage,
  removeMessage,
  setPageNumber,
  setmessageParams,
} = messagesSlice.actions;
