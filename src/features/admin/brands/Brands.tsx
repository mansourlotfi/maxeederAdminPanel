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
import useBrands from "../../../app/hooks/useBrands";
import { removeBrand } from "./brandSlice";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./FormHandler";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function AdminBrands() {
  const { brands, brandsLoaded, status } = useBrands();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDeleteBrand(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteBrand(id)
      .then(() => dispatch(removeBrand(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function closeModalHandler() {
    setIsOpen(false);
  }
  if (!brandsLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست برندها
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          برند جدید
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
            {brands.map((brand) => (
              <TableRow
                key={brand.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {brand.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{brand.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={brand.pictureUrl}
                      alt={brand.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(brand.name);
                      toast.success(" برند کپی شد");
                    }}
                    startIcon={<ContentCopyIcon />}
                  />
                  <LoadingButton
                    loading={loading && target === brand.id}
                    onClick={() => handleDeleteBrand(brand.id)}
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
