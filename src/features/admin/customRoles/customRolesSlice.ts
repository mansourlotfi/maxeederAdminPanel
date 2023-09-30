import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { ICustomUserRoles } from "../../../app/models/users";

interface CustomRolesState {
  isLoaded: boolean;
  status: string;
}

const customRolesAdapter = createEntityAdapter<ICustomUserRoles>();

export const fetchRolesAsync = createAsyncThunk<
  ICustomUserRoles[],
  void,
  { state: RootState }
>("users/fetchRolesAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Admin.customRoleList();
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

// export const fetchCategoryAsync = createAsyncThunk<ICustomUserRoles, number>(
//   "users/fetchCategoryAsync",
//   async (categoryId, thunkAPI) => {
//     try {
//       const category = await agent.Category.details(categoryId);
//       return category;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue({ error: error.data });
//     }
//   }
// );

export const customRolesSlice = createSlice({
  name: "customRolesSlice",
  initialState: customRolesAdapter.getInitialState<CustomRolesState>({
    isLoaded: false,
    status: "idle",
  }),
  reducers: {
    setCustomeRole: (state, action) => {
      customRolesAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    removeCustomRole: (state, action) => {
      customRolesAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRolesAsync.pending, (state, action) => {
      state.status = "pendingFetchRoles";
    });
    builder.addCase(fetchRolesAsync.fulfilled, (state, action) => {
      customRolesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchRolesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    // builder.addCase(fetchCategoryAsync.pending, (state) => {
    //   state.status = "pendingFetchCategory";
    // });
    // builder.addCase(fetchCategoryAsync.fulfilled, (state, action) => {
    //   customRolesAdapter.upsertOne(state, action.payload);
    //   state.status = "idle";
    // });
    // builder.addCase(fetchCategoryAsync.rejected, (state, action) => {
    //   state.status = "idle";
    // });
  },
});

export const customRolesSelectors = customRolesAdapter.getSelectors(
  (state: RootState) => state.customRoles
);

export const { setCustomeRole, removeCustomRole } = customRolesSlice.actions;
