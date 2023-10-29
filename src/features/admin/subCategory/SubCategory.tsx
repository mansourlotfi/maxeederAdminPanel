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
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useCallback, useState } from "react";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import {
  fetchSubCategoriesAsync,
  removeSubCategory,
  setPageNumber,
  setParams,
} from "./subCategorySlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Category } from "../../../app/models/Category";
import TypographyWithTooltip from "../../../app/components/typographyWithTooltip";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../../../app/components/confirmDialog";
import useSubCategories from "../../../app/hooks/useSubCategories";
import AppPagination from "../../../app/components/AppPagination";
import SubCategorySearch from "./Search";

export default function AdminSubCategory() {
  const { subCategories, categoriesLoaded, status, metaData, params } =
    useSubCategories();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  const [selectedItem, setSelectedItem] = useState<Category | undefined>(
    undefined
  );

  function handleSelectItem(cat: Category) {
    setSelectedItem(cat);
    setIsOpen(true);
  }

  function handleDeleteCategory(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteCategory(id)
      .then(() => dispatch(removeSubCategory(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    setIsOpen(false);
  }

  const [confirmModalIsOpen, setconfirmModalIsOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [itemsChecked, setItemsChecked] = useState(false);

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
      for (const item of subCategories) {
        collection.push(item.id);
      }
    }
    setCheckedIds(collection);
    setItemsChecked(checked);
  };

  const multipleItemsDeleteHandler = useCallback(() => {
    agent.Admin.subCategoriesDeleteMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchSubCategoriesAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  const multipleItemsEditHandler = useCallback(() => {
    agent.Admin.subCategoriesEditMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchSubCategoriesAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  if (!categoriesLoaded && status === "idle")
    return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست زیر دسته بندی
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          زیر دسته بندی جدید
        </Button>
      </Box>
      <Grid item container xs={12} mb={2} mt={2} justifyContent="space-between">
        <Grid item xs={2}>
          <SubCategorySearch />
        </Grid>
        <Grid item>
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
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              <TableCell align="left">نام</TableCell>
              <TableCell align="left">نام انگلیسی</TableCell>
              <TableCell align="left">لینک</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="left">اولویت</TableCell>
              <TableCell align="center">وضعیت</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">ویرایش</TableCell>
              <TableCell align="left">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories.map((category) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Grid
                    container
                    justifyContent="space-between"
                    flexWrap="nowrap"
                    alignItems="center"
                  >
                    <Box display="inline-block">{category.id}</Box>
                    <Box display="inline-block">
                      <Checkbox
                        value={category.id}
                        onChange={handleChange}
                        color="primary"
                        checked={
                          !!checkedIds.find((item) => item === category.id)
                        }
                      />
                    </Box>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{category.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{category.nameEn}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ maxWidth: 150 }}
                  >
                    <TypographyWithTooltip text={category.link} />
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={category.pictureUrl}
                      alt={category.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{category.priority}</span>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {category.isActive ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        category.link ?? category.name
                      );
                      toast.success("کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => handleSelectItem(category)}
                    startIcon={<Edit />}
                  />
                </TableCell>
                <TableCell align="left">
                  <LoadingButton
                    loading={loading && target === category.id}
                    onClick={() => handleDeleteCategory(category.id)}
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
                value={params.pageSize}
                label="تعداد در صفحه"
                onChange={(e) =>
                  dispatch(setParams({ pageSize: e.target.value }))
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
      {isOpen && (
        <DialogComponent open={true}>
          <FormHandler
            closeModalHandler={closeModalHandler}
            itemToEdit={selectedItem}
          />
        </DialogComponent>
      )}
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
    </>
  );
}
