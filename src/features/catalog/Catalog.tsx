import { Button, Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchFilters,
  fetchProductsAsync,
  productSelectors,
  resetProductParams,
  setPageNumber,
} from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import FilterAccordion from "./Filters";
import { useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, filtersLoaded, metaData, productParams } =
    useAppSelector((state) => state.catalog);

  const dispatch = useAppDispatch();
  // const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  let ref = searchParams.get("ref");
  const [, setCookie] = useCookies(["ref"]);

  useEffect(() => {
    if (ref?.length) {
      setCookie("ref", ref, {
        path: "/",
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        maxAge: 604800,
      });
    }
  }, [ref, setCookie]);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);
  //to prevent twice api call becuse of dependency array
  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [dispatch, filtersLoaded]);

  // if (loading) return <LoadingComponent />;
  if (!filtersLoaded) return <LoadingComponent />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        {productParams.searchTerm?.length ||
        productParams.brands.length ||
        productParams.types.length ? (
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            endIcon={<FilterAltOffIcon />}
            color="secondary"
            onClick={() => {
              dispatch(resetProductParams());
            }}
          >
            حذف فیلترها
          </Button>
        ) : null}

        <FilterAccordion />
      </Grid>
      <Grid item xs={12} md={9} mt={5}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={12} md={9} sx={{ mb: 2 }}>
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Catalog;
