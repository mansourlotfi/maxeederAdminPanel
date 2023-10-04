import { Edit, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import agent from "../../../app/api/agent";
import AppPagination from "../../../app/components/AppPagination";
import useProducts from "../../../app/hooks/useProducts";
import { Product } from "../../../app/models/product";
import { useAppDispatch } from "../../../app/store/configureStore";
import { currencyFormat } from "../../../app/util/util";
import {
  removeProduct,
  resetProductParams,
  setPageNumber,
  setProductParams,
} from "../../catalog/catalogSlice";
import ProductForm from "./formHandler";
import DialogComponent from "../../../app/components/draggableDialog";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ProductSearch from "../../catalog/ProductSearch";
import useBrands from "../../../app/hooks/useBrands";
import useCategories from "../../../app/hooks/useCategories";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";

const sortOptions = [
  { value: "name", label: "حروف الفبا" },
  { value: "priceDesc", label: "قیمت - زیاد به کم" },
  { value: "price", label: "قیمت - کم به زیاد" },
];

export default function AdminInventory() {
  const { products, metaData, productParams, status } = useProducts();
  const { brands } = useBrands();
  const { categories } = useCategories();

  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setEditMode(true);
  }

  function handleDeleteProduct(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteProduct(id)
      .then(() => dispatch(removeProduct(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedProduct) setSelectedProduct(undefined);
    setEditMode(false);
  }

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <Grid container>
      <Grid item container xs={12} justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست کالاها
        </Typography>
        <Button
          onClick={() => setEditMode(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          کالای جدید
        </Button>
      </Grid>
      <Grid item container xs={12} spacing={4} mb={2}>
        <Grid item xs={3}>
          <ProductSearch />
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>ترتیب نمایش</InputLabel>
            <Select
              value={productParams.orderBy}
              label="ترتیب نمایش"
              onChange={(e) =>
                dispatch(setProductParams({ orderBy: e.target.value }))
              }
            >
              {sortOptions.map((item, index) => (
                <MenuItem value={item.value} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>انتخاب برند</InputLabel>
            <Select
              value={productParams.brands}
              label="انتخاب برند"
              onChange={(e) =>
                dispatch(setProductParams({ brands: e.target.value }))
              }
            >
              {brands.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>انتخاب دسته بندی</InputLabel>
            <Select
              value={productParams.types}
              label="انتخاب دسته بندی"
              onChange={(e) =>
                dispatch(setProductParams({ types: e.target.value }))
              }
            >
              {categories.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item alignSelf="center">
          {productParams.searchTerm?.length ||
          productParams.brands.length ||
          productParams.types.length ? (
            <Button
              sx={{ mb: 2 }}
              variant="contained"
              endIcon={<FilterAltOffIcon />}
              color="secondary"
              size="small"
              onClick={() => {
                dispatch(resetProductParams());
              }}
            >
              حذف فیلترها
            </Button>
          ) : null}
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">کالا</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="left">قیمت</TableCell>
              <TableCell align="center">نوع</TableCell>
              <TableCell align="center">برند</TableCell>
              <TableCell align="center">تعداد</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">ویرایش</TableCell>
              <TableCell align="left">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {product.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{product.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={product.pictureUrl}
                      alt={product.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {currencyFormat(product.price)}
                </TableCell>
                <TableCell align="center">{product.type}</TableCell>
                <TableCell align="center">{product.brand}</TableCell>
                <TableCell align="center">{product.quantityInStock}</TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(product.name);
                      toast.success("کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => handleSelectProduct(product)}
                    startIcon={<Edit />}
                  />
                </TableCell>
                <TableCell align="left">
                  <LoadingButton
                    loading={loading && target === product.id}
                    onClick={() => handleDeleteProduct(product.id)}
                    startIcon={<Delete />}
                    color="error"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {metaData && (
        <Box sx={{ pt: 2 }}>
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        </Box>
      )}
      {editMode && (
        <DialogComponent open={true}>
          <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />;
        </DialogComponent>
      )}
    </Grid>
  );
}
