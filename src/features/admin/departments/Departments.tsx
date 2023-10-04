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
import { removeDepartment } from "./departmentsSlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import useDepartments from "../../../app/hooks/useDepartments";

export default function AdminDepartments() {
  const { departments, isLoaded, status } = useDepartments();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDelete(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteDepartment(id)
      .then(() => dispatch(removeDepartment(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    setIsOpen(false);
  }
  if (!isLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست دپارتمان ها
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          دپارتمان جدید
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">عنوان</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">جذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((D) => (
              <TableRow
                key={D.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {D.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{D.name}</span>
                  </Box>
                </TableCell>

                <TableCell align="left">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(D.name);
                      toast.success("کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                </TableCell>

                <TableCell align="left">
                  <LoadingButton
                    loading={loading && target === D.id}
                    onClick={() => handleDelete(D.id)}
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
