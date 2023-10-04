import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Department } from "../../../app/models/Department";

interface DepartmentState {
  isLoaded: boolean;
  status: string;
}

const deparmentsAdapter = createEntityAdapter<Department>();

export const fetchDepartmentsAsync = createAsyncThunk<
  Department[],
  void,
  { state: RootState }
>("Department/fetchDepartmentsAsync", async (_, thunkAPI) => {
  try {
    var response = await agent.Admin.departmentList();

    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const departmentsSlice = createSlice({
  name: "Department",
  initialState: deparmentsAdapter.getInitialState<DepartmentState>({
    isLoaded: false,
    status: "idle",
  }),
  reducers: {
    setDepartment: (state, action) => {
      deparmentsAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    removeDepartment: (state, action) => {
      deparmentsAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDepartmentsAsync.pending, (state, action) => {
      state.status = "pendingfetchDepartmentsAsync";
    });
    builder.addCase(fetchDepartmentsAsync.fulfilled, (state, action) => {
      deparmentsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchDepartmentsAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const departmentsSelectors = deparmentsAdapter.getSelectors(
  (state: RootState) => state.departments
);

export const { setDepartment, removeDepartment } = departmentsSlice.actions;
