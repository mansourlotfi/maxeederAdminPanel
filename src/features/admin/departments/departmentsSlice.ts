import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { Department, DepartmentParams } from "../../../app/models/Department";
import { MetaData } from "../../../app/models/pagination";

interface DepartmentState {
  isLoaded: boolean;
  status: string;
  params: DepartmentParams;
  metaData: MetaData | null;
}

const deparmentsAdapter = createEntityAdapter<Department>();

function getAxiosParams(productParams: DepartmentParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);

  return params;
}

export const fetchDepartmentsAsync = createAsyncThunk<
  Department[],
  void,
  { state: RootState }
>("Department/fetchDepartmentsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().departments.params);

  try {
    var response = await agent.Admin.departmentList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));

    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): DepartmentParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const departmentsSlice = createSlice({
  name: "Department",
  initialState: deparmentsAdapter.getInitialState<DepartmentState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    params: initParams(),
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
    setParams: (state, action) => {
      state.isLoaded = false;
      state.params = {
        ...state.params,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.params = { ...state.params, ...action.payload };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetParams: (state) => {
      state.params = initParams();
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

export const {
  setDepartment,
  removeDepartment,
  setMetaData,
  setPageNumber,
  setParams,
  resetParams,
} = departmentsSlice.actions;
