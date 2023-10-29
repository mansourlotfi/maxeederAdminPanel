import { Delete } from "@mui/icons-material";
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
import FormHandler from "./FormHandler";
import {
  fetchUsersAsync,
  removeUser,
  setPageNumber,
  setUserParams,
} from "./usersSlice";
import useUsers from "../../../app/hooks/useUsers";
import DialogComponent from "../../../app/components/draggableDialog";
import AppPagination from "../../../app/components/AppPagination";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../../../app/components/confirmDialog";
import UsersSearch from "./Search";

export default function AdminUserList() {
  const { users, isLoaded, status, metaData, userParams } = useUsers();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDeleteUser(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteUser(id)
      .then(() => {
        dispatch(removeUser(id));
        toast.success("کاربر با حذف انجام شد");
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    setIsOpen(false);
    dispatch(setUserParams({}));
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
      for (const item of users) {
        collection.push(item.id);
      }
    }
    setCheckedIds(collection);
    setItemsChecked(checked);
  };

  const multipleItemsDeleteHandler = useCallback(() => {
    agent.Admin.SocialNetworkDeleteMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchUsersAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  const multipleItemsEditHandler = useCallback(() => {
    agent.Admin.SocialNetworkEditMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchUsersAsync());
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
          لیست همکاران
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          همکار جدید
        </Button>
      </Box>

      <Grid item container xs={12} mb={2} mt={2} justifyContent="space-between">
        <Grid item xs={3}>
          <UsersSearch />
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
              <TableCell align="left">تلفن</TableCell>
              <TableCell align="left">نقش ها</TableCell>
              <TableCell align="left">وضعیت</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter((U) => U.email !== "admin@maxeeder.com")
              .map((U) => (
                <TableRow
                  key={U.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Grid
                      container
                      justifyContent="space-between"
                      flexWrap="nowrap"
                      alignItems="center"
                    >
                      <Box display="inline-block">{U.id}</Box>
                      <Box display="inline-block">
                        <Checkbox
                          value={U.id}
                          onChange={handleChange}
                          color="primary"
                          checked={!!checkedIds.find((item) => item === U.id)}
                        />
                      </Box>
                    </Grid>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <span>{U.phoneNumber}</span>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <span>همکار</span>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {U.isActive ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CloseIcon color="error" />
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <LoadingButton
                      onClick={() => {
                        navigator.clipboard.writeText(U.phoneNumber);
                        toast.success("ایمیل کاربر کپی شد");
                      }}
                      startIcon={<ContentCopyIcon />}
                    />
                    <LoadingButton
                      loading={loading && target === U.id}
                      onClick={() => handleDeleteUser(U.id)}
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
                value={userParams.pageSize}
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
        <DialogComponent open={true}>
          <FormHandler closeModalHandler={closeModalHandler} />
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
