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

const subCategoriesAdapter = createEntityAdapter<Category>();

function getAxiosParams(productParams: CategoryParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);

  return params;
}

export const fetchSubCategoriesAsync = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>("SubCategory/fetchSubCategoriesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().subCategory.params);

  try {
    var response = await agent.Admin.subCategorylist(params);
    thunkAPI.dispatch(setMetaData(response.metaData));

    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchCategoryAsync = createAsyncThunk<Category, number>(
  "SubCategory/fetchCategoryAsync",
  async (categoryId, thunkAPI) => {
    try {
      const category = await agent.Admin.subCategoryDetails(categoryId);
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

export const subCategorySlice = createSlice({
  name: "SubCategory",
  initialState: subCategoriesAdapter.getInitialState<CategoryState>({
    categoriesLoaded: false,
    status: "idle",
    metaData: null,
    params: initParams(),
  }),
  reducers: {
    setSubCategory: (state, action) => {
      subCategoriesAdapter.upsertOne(state, action.payload);
      state.categoriesLoaded = false;
    },
    removeSubCategory: (state, action) => {
      subCategoriesAdapter.removeOne(state, action.payload);
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
    builder.addCase(fetchSubCategoriesAsync.pending, (state, action) => {
      state.status = "pendingFetchSubCategories";
    });
    builder.addCase(fetchSubCategoriesAsync.fulfilled, (state, action) => {
      subCategoriesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.categoriesLoaded = true;
    });
    builder.addCase(fetchSubCategoriesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(fetchCategoryAsync.pending, (state) => {
      state.status = "pendingFetchSubCategory";
    });
    builder.addCase(fetchCategoryAsync.fulfilled, (state, action) => {
      subCategoriesAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchCategoryAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const subCategorySelectors = subCategoriesAdapter.getSelectors(
  (state: RootState) => state.subCategory
);

export const {
  setSubCategory,
  removeSubCategory,
  setMetaData,
  setParams,
  resetParams,
  setPageNumber,
} = subCategorySlice.actions;
