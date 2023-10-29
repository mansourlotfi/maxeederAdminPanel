import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { Article, ArticleParams } from "../../../app/models/Article";

interface ArticlesState {
  isLoaded: boolean;
  status: string;
  articlesParams: ArticleParams;
  metaData: MetaData | null;
}

const articlesAdapter = createEntityAdapter<Article>();

function getAxiosParams(param: ArticleParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  params.append("page", param.page.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);

  return params;
}

export const fetchArticlesAsync = createAsyncThunk<
  Article[],
  void,
  { state: RootState }
>("Articles/fetchArticlesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().article.articlesParams);
  try {
    var response = await agent.Admin.articleList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): ArticleParams {
  return {
    pageNumber: 1,
    pageSize: 6,
    page: 1,
  };
}
export const articlesSlice = createSlice({
  name: "Articles",
  initialState: articlesAdapter.getInitialState<ArticlesState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    articlesParams: initParams(),
  }),
  reducers: {
    setArticles: (state, action) => {
      articlesAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setArticlesParams: (state, action) => {
      state.isLoaded = false;
      state.articlesParams = {
        ...state.articlesParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.articlesParams = {
        ...state.articlesParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeArticle: (state, action) => {
      articlesAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticlesAsync.pending, (state, action) => {
      state.status = "pendingFetchArticlesAsync";
    });
    builder.addCase(fetchArticlesAsync.fulfilled, (state, action) => {
      articlesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchArticlesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const articlesSelectors = articlesAdapter.getSelectors(
  (state: RootState) => state.article
);

export const {
  setMetaData,
  setArticles,
  removeArticle,
  setPageNumber,
  setArticlesParams,
} = articlesSlice.actions;
