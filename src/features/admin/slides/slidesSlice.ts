import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../../app/api/agent";
import { RootState } from "../../../app/store/configureStore";
import { MetaData } from "../../../app/models/pagination";
import { Slide, SlideParams } from "../../../app/models/Slide";

interface SlidesState {
  isLoaded: boolean;
  status: string;
  slidesParams: SlideParams;
  metaData: MetaData | null;
}

const slidesAdapter = createEntityAdapter<Slide>();

function getAxiosParams(param: SlideParams) {
  const params = new URLSearchParams();
  params.append("pageNumber", param.pageNumber.toString());
  params.append("pageSize", param.pageSize.toString());
  params.append("page", param.page.toString());

  return params;
}

export const fetchSlidesAsync = createAsyncThunk<
  Slide[],
  void,
  { state: RootState }
>("Slide/fetchSlidesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().slides.slidesParams);
  try {
    var response = await agent.Admin.slideList(params);
    thunkAPI.dispatch(setMetaData(response.metaData));
    return response.items;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

function initParams(): SlideParams {
  return {
    pageNumber: 1,
    pageSize: 6,
    page: 1,
  };
}
export const slidesSlice = createSlice({
  name: "Slide",
  initialState: slidesAdapter.getInitialState<SlidesState>({
    isLoaded: false,
    status: "idle",
    metaData: null,
    slidesParams: initParams(),
  }),
  reducers: {
    setSlide: (state, action) => {
      slidesAdapter.upsertOne(state, action.payload);
      state.isLoaded = false;
    },
    setSlideParams: (state, action) => {
      state.isLoaded = false;
      state.slidesParams = {
        ...state.slidesParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setPageNumber: (state, action) => {
      state.isLoaded = false;
      state.slidesParams = {
        ...state.slidesParams,
        ...action.payload,
      };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    removeSlide: (state, action) => {
      slidesAdapter.removeOne(state, action.payload);
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSlidesAsync.pending, (state, action) => {
      state.status = "pendingFetchSlidesAsync";
    });
    builder.addCase(fetchSlidesAsync.fulfilled, (state, action) => {
      slidesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.isLoaded = true;
    });
    builder.addCase(fetchSlidesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const slidesSelectors = slidesAdapter.getSelectors(
  (state: RootState) => state.slides
);

export const {
  setMetaData,
  setSlide,
  removeSlide,
  setPageNumber,
  setSlideParams,
} = slidesSlice.actions;
