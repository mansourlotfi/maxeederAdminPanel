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
} from "@mui/material";
import { useState } from "react";
import agent from "../../../app/api/agent";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import FormHandler from "./FormHandler";
import { removeUser, setPageNumber, setUserParams } from "./usersSlice";
import useUsers from "../../../app/hooks/useUsers";
import DialogComponent from "../../../app/components/draggableDialog";
import AppPagination from "../../../app/components/AppPagination";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function AdminUserList() {
  const { users, isLoaded, status, metaData } = useUsers();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);

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
  if (!isLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست کاربران
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          کاربر جدید
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">ایمیل</TableCell>
              <TableCell align="left">نقش ها</TableCell>
              <TableCell align="left">وضعیت</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((U) => (
              <TableRow
                key={U.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {U.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{U.email}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>
                      {U.email === user?.email
                        ? "ادمین"
                        : U.customUserRoles.map((R) => R.name).join(", ") +
                          "کاربر"}
                    </span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{U.isActive ? "فعال" : "غیر فعال"}</span>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <LoadingButton
                    onClick={() => {
                      navigator.clipboard.writeText(U.email);
                      toast.success("ایمیل کاربر کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                  <LoadingButton
                    loading={loading && target === U.id}
                    disabled={U.email === user?.email}
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
        <Box sx={{ pt: 2 }}>
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        </Box>
      )}
      {isOpen && (
        <DialogComponent open={true}>
          <FormHandler closeModalHandler={closeModalHandler} />
        </DialogComponent>
      )}
    </>
  );
}
