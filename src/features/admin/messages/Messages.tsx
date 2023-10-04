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
import { useAppDispatch } from "../../../app/store/configureStore";
import { removeMessage, setPageNumber } from "./messagesSlice";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import AppPagination from "../../../app/components/AppPagination";
import useMessages from "../../../app/hooks/useMessages";

export default function AdminMessages() {
  const { messages, isLoaded, status, metaData } = useMessages();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDelete(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteMessage(id)
      .then(() => dispatch(removeMessage(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  if (!isLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="flex-start">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست پیام ها
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">دپارتمان</TableCell>
              <TableCell align="left">نام</TableCell>
              <TableCell align="left">ایمیل</TableCell>
              <TableCell align="left">عنوان</TableCell>
              <TableCell align="left">تلفن</TableCell>
              <TableCell align="left">متن</TableCell>
              <TableCell align="left">تاریخ</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((M) => (
              <TableRow
                key={M.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {M.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.department}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.fullName}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.email}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.subject}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.tel}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.text}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{M.addedDate}</span>
                  </Box>
                </TableCell>

                <TableCell align="left">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(M.text);
                      toast.success("کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                </TableCell>
                <TableCell align="left">
                  <LoadingButton
                    loading={loading && target === M.id}
                    onClick={() => handleDelete(M.id)}
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
    </>
  );
}
