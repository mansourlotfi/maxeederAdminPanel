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

const categoriesAdapter = createEntityAdapter<Category>();

export const fetchCategoriesAsync = createAsyncThunk<
  Category[],
  void,
  { state: RootState }
>("catalog/fetchCategoriesAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Category.list();
    return response;
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

export const categorySlice = createSlice({
  name: "category",
  initialState: categoriesAdapter.getInitialState<CategoryState>({
    categoriesLoaded: false,
    status: "idle",
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

export const { setCategory, removeCategory } = categorySlice.actions;
