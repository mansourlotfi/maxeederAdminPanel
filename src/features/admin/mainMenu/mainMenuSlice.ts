import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { MainMenu, MainMenuParams } from "../../../app/models/MainMenu";

interface MainMenuState {
  isLoaded: boolean;
  status: string;
  mainMenuParams: MainMenuParams;
  metaData: MetaData | null;
}

const mainMenuAdapter = createEntityAdapter<MainMenu>();

function getAxiosParams(param: MainMenuParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  if (param.searchTerm) params.append("searchTerm", param.searchTerm);

  return params;
}

export const fetchMainMenusAsync = createAsyncThunk<
  MainMenu[],
  void,
  { state: RootState }
>("MainMenu/fetchMainMenusAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().mainMenu.mainMenuParams);
  try {
    var response = await agent.Admin.MainMenuList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): MainMenuParams {
  return {
    pageNumber: 1,
    pageSize: 6,
  };
}
export const mainMenuSlice = createSlice({
  name: "MainMenu",
  initialState: mainMenuAdapter.getInitialState<MainMenuState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    mainMenuParams: initParams(),
  }),
  reducers: {
    setMenu: (state, action) => {
      mainMenuAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.mainMenuParams = {
        ...state.mainMenuParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeMenu: (state, action) => {
      mainMenuAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
    setMenuParams: (state, action) => {
      state.isLoaded = false;
      state.mainMenuParams = {
        ...state.mainMenuParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMainMenusAsync.pending, (state, action) => {
      state.status = "pendingFetchMainMenusAsync";
    });
    builder.addCase(fetchMainMenusAsync.fulfilled, (state, action) => {
      mainMenuAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchMainMenusAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const mainMenuSelectors = mainMenuAdapter.getSelectors(
  (state: RootState) => state.mainMenu
);

export const {
  setMetaData,
  setMenu,
  removeMenu,
  setPageNumber,
  setMenuParams,
} = mainMenuSlice.actions;
