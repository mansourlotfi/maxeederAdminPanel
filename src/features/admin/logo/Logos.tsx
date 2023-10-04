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
} from "@mui/material";
import { useState } from "react";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { removeLogo, setPageNumber } from "./logosSlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import AppPagination from "../../../app/components/AppPagination";
import useLogo from "../../../app/hooks/useLogo";
import { Logo } from "../../../app/models/Logo";

export default function AdminLogos() {
  const { logos, isLoaded, status, metaData } = useLogo();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  const [selectedItem, setSelectedItem] = useState<Logo | undefined>(undefined);

  function handleSelectItem(logo: Logo) {
    setSelectedItem(logo);
    setIsOpen(true);
  }

  function handleDelete(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteLogo(id)
      .then(() => dispatch(removeLogo(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    if (selectedItem) setSelectedItem(undefined);
    setIsOpen(false);
  }
  if (!isLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست لوگوها
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          لوگوی جدید
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h6">
          لوگوی اصلی اولویت 1 می باشد
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">نام</TableCell>
              <TableCell align="left">لینک</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="left">اولویت</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">ویرایش</TableCell>
              <TableCell align="left">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logos.map((L) => (
              <TableRow
                key={L.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {L.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{L.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{L.link}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={L.pictureUrl}
                      alt={L.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{L.priority}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(L.link);
                      toast.success("کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                </TableCell>
                <TableCell align="left">
                  <Button
                    onClick={() => handleSelectItem(L)}
                    startIcon={<Edit />}
                  />
                </TableCell>
                <TableCell align="left">
                  <LoadingButton
                    loading={loading && target === L.id}
                    onClick={() => handleDelete(L.id)}
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
          <FormHandler
            closeModalHandler={closeModalHandler}
            itemToEdit={selectedItem}
          />
        </DialogComponent>
      )}
    </>
  );
}
