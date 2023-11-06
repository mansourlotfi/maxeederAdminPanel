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
  Checkbox,
  Badge,
} from "@mui/material";
import { useCallback, useState } from "react";
import agent from "../../../app/api/agent";
import AppPagination from "../../../app/components/AppPagination";
import useProducts from "../../../app/hooks/useProducts";
import { Product } from "../../../app/models/product";
import { useAppDispatch } from "../../../app/store/configureStore";
import { currencyFormat } from "../../../app/util/util";
import ProductForm from "./formHandler";
import DialogComponent from "../../../app/components/draggableDialog";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ProductSearch from "./ProductSearch";
import useBrands from "../../../app/hooks/useBrands";
import useCategories from "../../../app/hooks/useCategories";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../../../app/components/confirmDialog";
import useSizes from "../../../app/hooks/useSizes";
import useUsages from "../../../app/hooks/useUsages";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploaderFormHandler from "./uploaderFormHandler";
import {
  fetchProductsAsync,
  removeProduct,
  resetProductParams,
  setPageNumber,
  setProductParams,
} from "./catalogSlice";
import useSubCategories from "../../../app/hooks/useSubCategories";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentFormHandler from "./commentFormHandler";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExtraFilesFormHandler from "./extraFilesFormHandler";
import TypographyWithTooltip from "../../../app/components/typographyWithTooltip";

const sortOptions = [
  { value: "name", label: "حروف الفبا" },
  { value: "priceDesc", label: "قیمت - زیاد به کم" },
  { value: "price", label: "قیمت - کم به زیاد" },
];

export default function AdminInventory() {
  const navigate = useNavigate();
  const { products, metaData, productParams, status } = useProducts();
  const { brands } = useBrands();
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();
  const { sizes } = useSizes();
  const { usages } = useUsages();
  const [confirmModalIsOpen, setconfirmModalIsOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [itemsChecked, setItemsChecked] = useState(false);

  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [showFiles, setshowFiles] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product);
    setEditMode(true);
  }

  const handleUploadProductMedia = useCallback((product: Product) => {
    setSelectedProduct(product);
    setMediaModal(true);
  }, []);

  const handleShowFiles = useCallback((product: Product) => {
    setSelectedProduct(product);
    setshowFiles(true);
  }, []);

  const handlecommentModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCommentModal(true);
  }, []);

  function cancelMediaUpload() {
    if (selectedProduct) setSelectedProduct(undefined);
    setMediaModal(false);
  }

  function cancelCommentUpload() {
    if (selectedProduct) setSelectedProduct(undefined);
    setCommentModal(false);
  }

  function cancelShowFiles() {
    if (selectedProduct) setSelectedProduct(undefined);
    setshowFiles(false);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // handle the change of checkbox state here
    // for example, add or remove the id from the checkedIds array
    const id = Number(event.target.value); // get the id from the value attribute
    const checked = event.target.checked; // get the checked state from the event
    if (checked) {
      // if checked, add the id to the array if not already present
      setCheckedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      // if unchecked, remove the id from the array if present
      setCheckedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const selectAllItem = (e: any) => {
    const { checked } = e.target;
    const collection = [];

    if (checked) {
      for (const item of products) {
        collection.push(item.id);
      }
    }
    setCheckedIds(collection);
    setItemsChecked(checked);
  };

  const multipleItemsDeleteHandler = useCallback(() => {
    agent.Admin.ProductsDeleteMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchProductsAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  const multipleItemsEditHandler = useCallback(() => {
    agent.Admin.ProductsEditMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchProductsAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

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
        <Grid item xs={2}>
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
            <InputLabel>انتخاب زیر دسته بندی</InputLabel>
            <Select
              value={productParams.types}
              label="انتخاب دسته بندی"
              onChange={(e) =>
                dispatch(setProductParams({ types: e.target.value }))
              }
            >
              {subCategories.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>سایز</InputLabel>
            <Select
              value={productParams.size}
              label="انتخاب سایز"
              onChange={(e) =>
                dispatch(setProductParams({ size: e.target.value }))
              }
            >
              {sizes.map((item, index) => (
                <MenuItem value={item.sizeName} key={index}>
                  {item.sizeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>کاربرد</InputLabel>
            <Select
              value={productParams.usage}
              label="انتخاب کاربرد"
              onChange={(e) =>
                dispatch(setProductParams({ usage: e.target.value }))
              }
            >
              {usages.map((item, index) => (
                <MenuItem value={item.name} key={index}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <InputLabel>وضعیت محصول فعال</InputLabel>
          <Checkbox
            onChange={(e) =>
              dispatch(setProductParams({ isActive: !!e.target.checked }))
            }
            color="primary"
            checked={Boolean(productParams.isActive)}
          />
        </Grid>
        <Grid item xs={2}>
          <InputLabel>نمایش قیمت فعال</InputLabel>
          <Checkbox
            onChange={(e) =>
              dispatch(setProductParams({ showPrice: !!e.target.checked }))
            }
            color="primary"
            checked={Boolean(productParams.showPrice)}
          />
        </Grid>

        <Grid item xs={2} alignSelf="center">
          {productParams.searchTerm?.length ||
          productParams.brands.length ||
          productParams.types.length ||
          productParams.size.length ||
          productParams.usage.length ||
          productParams.isActive !== null ||
          productParams.showPrice !== null ? (
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
      <Grid item container xs={12} mb={2} mt={2} justifyContent="flex-end">
        <LoadingButton
          sx={{ marginInlineEnd: 4 }}
          variant="contained"
          disabled={!checkedIds.length}
          endIcon={<CheckIcon color="success" />}
          size="small"
          onClick={multipleItemsEditHandler}
        >
          فعال/غیرفعال سازی انتخاب شده ها
        </LoadingButton>
        <LoadingButton
          variant="contained"
          disabled={!checkedIds.length}
          endIcon={<CloseIcon color="error" />}
          size="small"
          onClick={() => setconfirmModalIsOpen(true)}
        >
          حذف انتخاب شده ها
        </LoadingButton>
      </Grid>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(100vh - 400px)",
          overflowX: "auto",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Grid
                  container
                  justifyContent="space-between"
                  flexWrap="nowrap"
                  alignItems="center"
                >
                  <Box>#</Box>
                  <Box>
                    <Checkbox
                      onChange={selectAllItem}
                      color="primary"
                      checked={itemsChecked}
                    />
                  </Box>
                </Grid>
              </TableCell>
              <TableCell align="left">کالا</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="left">قیمت</TableCell>
              <TableCell align="center" sx={{ minWidth: 100 }}>
                دسته بندی
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 100 }}>
                زیر دسته بندی
              </TableCell>
              <TableCell align="center">برند</TableCell>
              <TableCell align="center">اولویت</TableCell>
              <TableCell align="center">نمایش قیمت</TableCell>
              <TableCell align="center">تعداد</TableCell>
              <TableCell align="center">کاربری</TableCell>
              <TableCell align="center">سایز</TableCell>
              <TableCell align="center" sx={{ minWidth: 150 }}>
                قابلیت ها
              </TableCell>
              <TableCell align="center">وضعیت</TableCell>
              <TableCell align="center"> فایل</TableCell>
              <TableCell align="center"> کامنت</TableCell>
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
                  <Grid
                    container
                    justifyContent="space-between"
                    flexWrap="nowrap"
                    alignItems="center"
                  >
                    <Box display="inline-block">{product.id}</Box>
                    <Box display="inline-block">
                      <Checkbox
                        value={product.id}
                        onChange={handleChange}
                        color="primary"
                        checked={
                          !!checkedIds.find((item) => item === product.id)
                        }
                      />
                    </Box>
                  </Grid>
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
                  {product.price
                    ? currencyFormat(product.price)
                    : "قیمت وارد نشده"}
                </TableCell>
                <TableCell align="center">
                  {
                    categories.find(
                      (I) => I.id === product.subCategory?.categoryId
                    )?.name
                  }
                </TableCell>
                <TableCell align="center">
                  {product.subCategory?.name}
                </TableCell>
                <TableCell align="center">{product.brand}</TableCell>
                <TableCell align="center">{product.priority}</TableCell>
                <TableCell align="center">
                  {product.showPrice ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>
                <TableCell align="center">{product.quantityInStock}</TableCell>
                <TableCell align="center">
                  <span>{product.usage}</span>
                </TableCell>
                <TableCell align="center">{product.size}</TableCell>

                <TableCell align="center" sx={{ maxWidth: 150 }}>
                  <TypographyWithTooltip
                    text={
                      (Array.isArray(product.features) &&
                        product.features
                          .map((F) => F.feature?.name)
                          .join(", ")) ||
                      "-"
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  {product.isActive ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>
                <TableCell align="left">
                  <Grid
                    container
                    justifyContent="space-between"
                    alignSelf="center"
                  >
                    <Grid item xs={6}>
                      <Button
                        onClick={() => handleUploadProductMedia(product)}
                        startIcon={<CloudUploadIcon />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Button onClick={() => handleShowFiles(product)}>
                        <Badge
                          badgeContent={product.mediaList.length}
                          color="secondary"
                        >
                          <VisibilityIcon color="primary" />
                        </Badge>
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Grid
                    container
                    justifyContent="space-between"
                    alignSelf="center"
                  >
                    <Grid item xs={6}>
                      <Button
                        onClick={() => handlecommentModal(product)}
                        startIcon={<AddCommentIcon />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        onClick={() => navigate("/admin-dashboard/comments")}
                      >
                        <Badge
                          badgeContent={product.commentList.length}
                          color="secondary"
                        >
                          <MailIcon color="primary" />
                        </Badge>
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>

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
        <Grid container mt={5} justifyContent="space-between">
          <Grid item xs={2}>
            <Box sx={{ pt: 2 }}>
              <AppPagination
                metaData={metaData}
                onPageChange={(page: number) =>
                  dispatch(setPageNumber({ pageNumber: page }))
                }
              />
            </Box>
          </Grid>
          <Grid item xs={1}>
            <FormControl fullWidth>
              <InputLabel>تعداد در صفحه</InputLabel>
              <Select
                value={productParams.pageSize}
                label="تعداد در صفحه"
                onChange={(e) =>
                  dispatch(setProductParams({ pageSize: e.target.value }))
                }
              >
                {[6, 10, 25, 50].map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}
      {editMode && (
        <DialogComponent open={true} maxWidth={"xl"}>
          <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />;
        </DialogComponent>
      )}

      {selectedProduct ? (
        <DialogComponent open={mediaModal} maxWidth={"md"}>
          <UploaderFormHandler
            product={selectedProduct}
            cancelEdit={cancelMediaUpload}
          />
        </DialogComponent>
      ) : null}
      {selectedProduct ? (
        <DialogComponent open={commentModal} maxWidth={"sm"}>
          <CommentFormHandler
            product={selectedProduct}
            cancel={cancelCommentUpload}
          />
        </DialogComponent>
      ) : null}

      <DialogComponent open={showFiles} maxWidth={"lg"}>
        <ExtraFilesFormHandler
          product={selectedProduct}
          cancel={cancelShowFiles}
        />
      </DialogComponent>

      <ConfirmDialog
        fullWidth
        maxWidth="xs"
        open={confirmModalIsOpen}
        onSubmit={multipleItemsDeleteHandler}
        onClose={() => setconfirmModalIsOpen(false)}
        onCancel={() => setconfirmModalIsOpen(false)}
        submitLabel="تایید"
        closeLabel="کنسل"
        title={<Typography variant="h4">حذف آیتم های انتخابی</Typography>}
        children={
          <Typography variant="h6">
            آیا از حذف آیتم های انتخاب شده مطمئن هستید؟
          </Typography>
        }
      />
    </Grid>
  );
}
