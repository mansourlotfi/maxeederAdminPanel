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
import useCategories from "../../../app/hooks/useCategories";
import { removeCategory } from "./categorySlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function AdminCategory() {
  const { categories, categoriesLoaded, status } = useCategories();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDeleteCategory(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteCategory(id)
      .then(() => dispatch(removeCategory(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    setIsOpen(false);
  }
  if (!categoriesLoaded && status === "idle")
    return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست دسته بندی
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          دسته بندی جدید
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">نام</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{category.name}</span>
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

                <TableCell align="right">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(category.name);
                      toast.success("دسته بندی کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
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
      {isOpen && (
        <DialogComponent open={true}>
          <FormHandler closeModalHandler={closeModalHandler} />
        </DialogComponent>
      )}
    </>
  );
}
