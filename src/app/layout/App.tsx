import { CssBaseline, Grid, ThemeProvider, createTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
// import HomePage from "../../features/home/HomePage";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { grey } from "@mui/material/colors";
// import FloatingNav from "./floating-nav/FloatingNav";
import "quill/dist/quill.snow.css"; // Add css for snow theme
import "./styles.css";
import Login from "../../features/account/Login";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  // Create rtl cache
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const [darkMode] = useState(false);
  const palleteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: palleteType,
      background: {
        default: palleteType === "light" ? "#eaeaea" : "#121212",
      },
      primary: {
        main: "#1F56A3",
        dark: "#153D76",
        light: "#7FA4D8",
        contrastText: "#F6F6FF",
      },
      secondary: {
        main: "#f25081",
        dark: "#931846",
        light: "#E8C7C8",
        contrastText: "#F6F6FF",
      },
      error: {
        main: "#DC3545",
        light: "#FFEDEF",
      },
      info: {
        main: "#0DA7A7",
        light: "#EDFFFF",
      },
      success: {
        main: "#20BC7A",
        light: "#E9FFF6",
      },
      warning: {
        main: "#FAC641",
        light: "#FFF9EA",
      },
      grey: {
        ...grey,
      },
    },
    direction: "rtl",
    typography: {
      fontFamily: "dana,Arial",
    },
    components: {},
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          theme="colored"
        />
        <CssBaseline />
        {/* <main ref={mainRef}> */}
        {loading ? (
          <LoadingComponent message="در حال بارگزاری..." />
        ) : location.pathname === "/" ? (
          <Grid mt={10}>
            <Login />
            {/* <Footer /> */}
          </Grid>
        ) : (
          <Outlet />
        )}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
