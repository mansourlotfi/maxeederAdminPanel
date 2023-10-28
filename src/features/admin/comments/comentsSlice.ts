import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { CommentParams, Comment } from "../../../app/models/Comment";

interface CommentState {
  isLoaded: boolean;
  status: string;
  messageParams: CommentParams;
  metaData: MetaData | null;
}

const commentAdapter = createEntityAdapter<Comment>();

function getAxiosParams(param: CommentParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  return params;
}

export const fetchCommentsAsync = createAsyncThunk<
  Comment[],
  void,
  { state: RootState }
>("Comment/fetchCommentsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().comments.messageParams);
  try {
    var response = await agent.Admin.CommentList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): CommentParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const commentsSlice = createSlice({
  name: "comment",
  initialState: commentAdapter.getInitialState<CommentState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    messageParams: initParams(),
  }),
  reducers: {
    setCommentParams: (state, action) => {
      state.isLoaded = false;
      state.messageParams = {
        ...state.messageParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setComment: (state, action) => {
      commentAdapter.upsertOne(state, action.payload);
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
    removeComment: (state, action) => {
      commentAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsAsync.pending, (state, action) => {
      state.status = "pendingfetchCommentsAsync";
    });
    builder.addCase(fetchCommentsAsync.fulfilled, (state, action) => {
      commentAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchCommentsAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const commentSelectors = commentAdapter.getSelectors(
  (state: RootState) => state.comments
);

export const {
  setMetaData,
  setComment,
  removeComment,
  setPageNumber,
  setCommentParams,
} = commentsSlice.actions;
