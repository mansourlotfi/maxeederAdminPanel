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
} from "@mui/material";
import { useCallback, useState } from "react";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { fetchDepartmentsAsync, removeDepartment } from "./departmentsSlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import useDepartments from "../../../app/hooks/useDepartments";
import ConfirmDialog from "../../../app/components/confirmDialog";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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
      for (const item of departments) {
        collection.push(item.id);
      }
    }
    setCheckedIds(collection);
    setItemsChecked(checked);
  };

  const multipleItemsDeleteHandler = useCallback(() => {
    agent.Admin.departmentsDeleteMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchDepartmentsAsync());
        toast.success("عملیات با موفقیت انجام شد");
      })
      .catch((err) => {
        toast.error("مشکلی پیش آمده است");
      });
  }, [checkedIds, dispatch]);

  const multipleItemsEditHandler = useCallback(() => {
    agent.Admin.departmentsEditMultipleItems(checkedIds)
      .then(() => {
        dispatch(fetchDepartmentsAsync());
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
      <Grid item container xs={12} mb={2} mt={2} justifyContent="flex-end">
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
              <TableCell align="left">عنوان</TableCell>
              <TableCell align="center">وضعیت</TableCell>
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
                  <Grid
                    container
                    justifyContent="space-between"
                    flexWrap="nowrap"
                    alignItems="center"
                  >
                    <Box display="inline-block">{D.id}</Box>
                    <Box display="inline-block">
                      <Checkbox
                        value={D.id}
                        onChange={handleChange}
                        color="primary"
                        checked={!!checkedIds.find((item) => item === D.id)}
                      />
                    </Box>
                  </Grid>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{D.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {D.isActive ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
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
