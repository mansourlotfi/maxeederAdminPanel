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
import { removeCustomRole } from "./customRolesSlice";
import useCustomeRoles from "../../../app/hooks/useCustomeRoles";
import FormHandler from "./FormHandler";
import DialogComponent from "../../../app/components/draggableDialog";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function AdminCustomRoles() {
  const { roles, isLoaded, status } = useCustomeRoles();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDeleteRole(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteCustomRole(id)
      .then(() => dispatch(removeCustomRole(id)))
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
          لیست نقش ها
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          نقش جدید
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">نام</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((R) => (
              <TableRow
                key={R.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {R.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{R.name}</span>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <LoadingButton
                    onClick={() => {
                      navigator.clipboard.writeText(R.name);
                      toast.success("نقش کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                  <LoadingButton
                    loading={loading && target === R.id}
                    onClick={() => handleDeleteRole(R.id)}
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
