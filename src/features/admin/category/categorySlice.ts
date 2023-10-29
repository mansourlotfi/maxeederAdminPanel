import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Category, CategoryParams } from "../../../app/models/Category";
import { MetaData } from "../../../app/models/pagination";

interface CategoryState {
  categoriesLoaded: boolean;
  status: string;
  params: CategoryParams;
  metaData: MetaData | null;
}

const categoriesAdapter = createEntityAdapter<Category>();

function getAxiosParams(productParams: CategoryParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);

  return params;
}

export const fetchCategoriesAsync = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>("catalog/fetchCategoriesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().category.params);

  try {
    var response = await agent.Category.list(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchCategoryAsync = createAsyncThunk<Category, number>(
  "catalog/fetchCategoryAsync",
  async (categoryId, thunkAPI) => {
    try {
      const category = await agent.Category.details(categoryId);
      return category;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

function initParams(): CategoryParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}

export const categorySlice = createSlice({
  name: "category",
  initialState: categoriesAdapter.getInitialState<CategoryState>({
    categoriesLoaded: false,
    status: "idle",
    params: initParams(),
    metaData: null,
  }),
  reducers: {
    setCategory: (state, action) => {
      categoriesAdapter.upsertOne(state, action.payload);
      state.categoriesLoaded = false;
    },
    removeCategory: (state, action) => {
      categoriesAdapter.removeOne(state, action.payload);
      state.categoriesLoaded = false;
    },
    setParams: (state, action) => {
      state.categoriesLoaded = false;
      state.params = {
        ...state.params,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.categoriesLoaded = false;
      state.params = { ...state.params, ...action.payload };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetParams: (state) => {
      state.params = initParams();
      state.categoriesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategoriesAsync.pending, (state, action) => {
      state.status = "pendingFetchCategories";
    });
    builder.addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
      categoriesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.categoriesLoaded = true;
    });
    builder.addCase(fetchCategoriesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(fetchCategoryAsync.pending, (state) => {
      state.status = "pendingFetchCategory";
    });
    builder.addCase(fetchCategoryAsync.fulfilled, (state, action) => {
      categoriesAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchCategoryAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const categorySelectors = categoriesAdapter.getSelectors(
  (state: RootState) => state.category
);

export const {
  setCategory,
  removeCategory,
  setMetaData,
  setParams,
  setPageNumber,
} = categorySlice.actions;
