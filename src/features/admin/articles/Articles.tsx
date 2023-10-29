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
  removeArticle,
  setPageNumber,
  fetchArticlesAsync,
  setArticlesParams,
} from "./articlesSlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import AppPagination from "../../../app/components/AppPagination";
import TypographyWithTooltip from "../../../app/components/typographyWithTooltip";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../../../app/components/confirmDialog";
import useArticles from "../../../app/hooks/useArticles";
import { Article } from "../../../app/models/Article";
import { articlesPageObj } from "./data";
import ArticlesSearch from "./Search";

export default function AdminArticlesPage() {
  const { articles, isLoaded, status, metaData, articlesParams } =
    useArticles();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  const [selectedItem, setSelectedItem] = useState<Article | undefined>(
    undefined
  );

  function handleSelectItem(pageItems: Article) {
    setSelectedItem(pageItems);
    setIsOpen(true);
  }

  function handleDelete(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deletePageItem(id)
      .then(() => dispatch(removeArticle(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    if (selectedItem) setSelectedItem(undefined);
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
      for (const item of articles) {
        collection.push(item.id);
      }
    }
    setCheckedIds(collection);
    setItemsChecked(checked);
  };

  const multipleItemsDeleteHandler = useCallback(() => {
    agent.Admin.ArticlesDeleteMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchArticlesAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  const multipleItemsEditHandler = useCallback(() => {
    agent.Admin.ArticlesEditMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchArticlesAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  if (!isLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست مقالات
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          مقاله جدید
        </Button>
      </Box>
      <Grid container sm={4} mb={5}>
        <FormControl fullWidth>
          <InputLabel>انتخاب صفحه</InputLabel>
          <Select
            value={articlesParams.page}
            label="انتخاب صفحه"
            onChange={(e: any) =>
              dispatch(setArticlesParams({ page: e.target.value }))
            }
          >
            {articlesPageObj.map((item, index) => (
              <MenuItem value={item.id} key={index}>
                {item.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item container xs={12} mb={2} mt={2} justifyContent="space-between">
        <Grid item xs={2}>
          <ArticlesSearch />
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
      <TableContainer
        component={Paper}
        sx={{
          minWidth: 650,
          maxHeight: "calc(100vh - 400px)",
          overflowY: "auto",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                {" "}
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
              <TableCell align="left">عنوان</TableCell>
              <TableCell align="left">لینک</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="left">اولویت</TableCell>
              <TableCell align="left">صفحه</TableCell>
              <TableCell align="center">وضعیت</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">ویرایش</TableCell>
              <TableCell align="left">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((A) => (
              <TableRow
                key={A.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Grid
                    container
                    justifyContent="space-between"
                    flexWrap="nowrap"
                    alignItems="center"
                  >
                    <Box display="inline-block">{A.id}</Box>
                    <Box display="inline-block">
                      <Checkbox
                        value={A.id}
                        onChange={handleChange}
                        color="primary"
                        checked={!!checkedIds.find((item) => item === A.id)}
                      />
                    </Box>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{A.title}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ maxWidth: 150 }}
                  >
                    <TypographyWithTooltip text={A.link} />
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    {A.pictureUrl ? (
                      <img
                        src={A.pictureUrl}
                        alt={A.title}
                        style={{ height: 50, marginRight: 20 }}
                      />
                    ) : null}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{A.priority}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>
                      {
                        articlesPageObj.find((P) => P.id === A.page)
                          ?.displayName
                      }
                    </span>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {A.isActive ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </TableCell>

                <TableCell align="left">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(A.link);
                      toast.success("کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => handleSelectItem(A)}
                    startIcon={<Edit />}
                  />
                </TableCell>
                <TableCell align="left">
                  <LoadingButton
                    loading={loading && target === A.id}
                    onClick={() => handleDelete(A.id)}
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
                value={articlesParams.pageSize}
                label="تعداد در صفحه"
                onChange={(e) =>
                  dispatch(setPageNumber({ pageSize: e.target.value }))
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
        <DialogComponent open={true} maxWidth="lg">
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
