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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import {
  removePageItem,
  setPageNumber,
  setPageItemParams,
} from "./pageItemsSlice";
import DialogComponent from "../../../app/components/draggableDialog";
import FormHandler from "./formHandler";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import AppPagination from "../../../app/components/AppPagination";
import { pagesItemsObj } from "./data";
import { pageItems } from "../../../app/models/PageItems";
import usePageItems from "../../../app/hooks/usePageItems";
import TypographyWithTooltip from "../../../app/components/typographyWithTooltip";

export default function AdminPageItems() {
  const { pageItems, isLoaded, status, metaData, pageItemsParams } =
    usePageItems();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  const [selectedItem, setSelectedItem] = useState<pageItems | undefined>(
    undefined
  );

  function handleSelectItem(pageItems: pageItems) {
    setSelectedItem(pageItems);
    setIsOpen(true);
  }

  function handleDelete(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deletePageItem(id)
      .then(() => dispatch(removePageItem(id)))
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
          لیست ایتم های صفحات
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          ایتم جدید
        </Button>
      </Box>
      <Grid container sm={4} mb={5}>
        <FormControl fullWidth>
          <InputLabel>انتخاب ایتم و صفحه </InputLabel>
          <Select
            value={pageItemsParams.page}
            label="انتخاب ایتم و صفحه"
            onChange={(e: any) =>
              dispatch(setPageItemParams({ page: e.target.value }))
            }
          >
            {pagesItemsObj.map((item, index) => (
              <MenuItem value={item.id} key={index}>
                {item.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">عنوان</TableCell>
              <TableCell align="left">متن</TableCell>
              <TableCell align="left">لینک</TableCell>
              <TableCell align="left">تصویر</TableCell>
              <TableCell align="left">اولویت</TableCell>
              <TableCell align="left">صفحه</TableCell>
              <TableCell align="left">کپی</TableCell>
              <TableCell align="left">ویرایش</TableCell>
              <TableCell align="left">حذف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageItems.map((A) => (
              <TableRow
                key={A.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {A.id}
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
                    <TypographyWithTooltip text={A.text} />
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
                      {pagesItemsObj.find((P) => P.id === A.page)?.displayName}
                    </span>
                  </Box>
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
        <DialogComponent open={true} maxWidth="lg">
          <FormHandler
            closeModalHandler={closeModalHandler}
            itemToEdit={selectedItem}
          />
        </DialogComponent>
      )}
    </>
  );
}
