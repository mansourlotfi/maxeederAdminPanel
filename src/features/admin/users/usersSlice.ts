import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { User, UsersParams } from "../../../app/models/users";
import { MetaData } from "../../../app/models/pagination";

interface UsersState {
  isLoaded: boolean;
  status: string;
  userParams: UsersParams;
  metaData: MetaData | null;
}

const usersAdapter = createEntityAdapter<User>();

function getAxiosParams(userParams: UsersParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", userParams.pageNumber.toString());
  params.append("pageSize", userParams.pageSize.toString());

  return params;
}

export const fetchUsersAsync = createAsyncThunk<
  User[],
  void,
  { state: RootState }
>("Users/fetchUsersAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().users.userParams);
  try {
    var response = await agent.Admin.userList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

// export const fetchuseryAsync = createAsyncThunk<Users, number>(
//   "Users/fetchuseryAsync",
//   async (categoryId, thunkAPI) => {
//     try {
//       const category = await agent.Category.details(categoryId);
//       return category;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue({ error: error.data });
//     }
//   }
// );

function initParams(): UsersParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}

export const usersSlice = createSlice({
  name: "category",
  initialState: usersAdapter.getInitialState<UsersState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    userParams: initParams(),
  }),
  reducers: {
    setUserParams: (state, action) => {
      state.isLoaded = false;
      state.userParams = {
        ...state.userParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.userParams = { ...state.userParams, ...action.payload };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    setUser: (state, action) => {
      usersAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    removeUser: (state, action) => {
      usersAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersAsync.pending, (state, action) => {
      state.status = "pendingfFetchUsersAsync";
    });
    builder.addCase(fetchUsersAsync.fulfilled, (state, action) => {
      usersAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchUsersAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    // builder.addCase(fetchuseryAsync.pending, (state) => {
    //   state.status = "pendingFetchCategory";
    // });
    // builder.addCase(fetchuseryAsync.fulfilled, (state, action) => {
    //   categoriesAdapter.upsertOne(state, action.payload);
    //   state.status = "idle";
    // });
    // builder.addCase(fetchuseryAsync.rejected, (state, action) => {
    //   state.status = "idle";
    // });
  },
});

export const usersSelectors = usersAdapter.getSelectors(
  (state: RootState) => state.users
);

export const {
  setMetaData,
  setUser,
  setUserParams,
  setPageNumber,
  removeUser,
} = usersSlice.actions;
