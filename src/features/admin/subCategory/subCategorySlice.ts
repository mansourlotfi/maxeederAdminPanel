import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Category } from "../../../app/models/Category";

interface CategoryState {
  categoriesLoaded: boolean;
  status: string;
}

const subCategoriesAdapter = createEntityAdapter<Category>();

export const fetchSubCategoriesAsync = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>("SubCategory/fetchSubCategoriesAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Admin.subCategorylist();
    return response;
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

export const subCategorySlice = createSlice({
  name: "SubCategory",
  initialState: subCategoriesAdapter.getInitialState<CategoryState>({
    categoriesLoaded: false,
    status: "idle",
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

export const { setSubCategory, removeSubCategory } = subCategorySlice.actions;
