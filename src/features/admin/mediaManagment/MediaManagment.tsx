import {
  Box,
  Typography,
  Button,
  Grid,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useCallback, useState } from "react";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { removeMedia } from "./mediaSlice";
import DialogComponent from "../../../app/components/draggableDialog";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import useMedia from "../../../app/hooks/useMedia";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormHandler from "./formHandler";
import ConfirmDialog from "../../../app/components/confirmDialog";

export default function AdminFileManager() {
  const { files, isLoaded, status } = useMedia();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [confirmModalIsOpen, setconfirmModalIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<string>();

  function getFileName(url: string) {
    // find the last position of the slash character
    var index = url.lastIndexOf("/");
    // get the substring from the next position to the end
    var filename = url.substring(index + 1);
    // return the file name
    return filename;
  }

  const handleDelete = useCallback(() => {
    setLoading(true);
    target &&
      agent.Admin.deleteMedia(getFileName(target))
        .then(() => dispatch(removeMedia(target)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, [target, dispatch]);

  function closeModalHandler() {
    setIsOpen(false);
  }
  if (!isLoaded && status === "idle") return <>something bad happened</>;

  if (status.includes("pending")) return <LoadingComponent />;

  console.log("files", files);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست فایل ها
        </Typography>
        <Button
          onClick={() => setIsOpen(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          فایل جدید
        </Button>
      </Box>
      <Grid
        container
        item
        xs
        maxHeight="100vh"
        maxWidth={"70vw"}
        sx={{ overflowY: "scroll" }}
      >
        <ImageList variant="masonry" cols={3} gap={8}>
          {files.map((item, i) => (
            <ImageListItem key={item.id}>
              <img
                srcSet={`${item.name}?w=128&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.name}?w=128&fit=crop&auto=format`}
                alt={item.name}
                loading="lazy"
              />
              <Box justifyContent="center" textAlign="center">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(item.name);
                    toast.success("کپی شد");
                  }}
                  startIcon={<ContentCopyIcon />}
                />
                <LoadingButton
                  loading={loading && target === item.name}
                  onClick={() => {
                    setTarget(item.name);
                    setconfirmModalIsOpen(true);
                  }}
                  startIcon={<Delete />}
                  color="error"
                />
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>

      {isOpen && (
        <DialogComponent open={true}>
          <FormHandler closeModalHandler={closeModalHandler} />
        </DialogComponent>
      )}

      <ConfirmDialog
        fullWidth
        maxWidth="xs"
        open={confirmModalIsOpen}
        onSubmit={handleDelete}
        onClose={() => setconfirmModalIsOpen(false)}
        onCancel={() => setconfirmModalIsOpen(false)}
        submitLabel="تایید"
        closeLabel="کنسل"
        title={<Typography variant="h4">حذف فایل </Typography>}
        children={
          <Typography variant="h6">
            امکان دارد فایل مورد نظر مطعلق به محصول و یا قسمتی از سایت باشد و با
            حذف آن دچار مشکل شوید. آیا از حذف فایل مطمئن هستید؟
          </Typography>
        }
      />
    </>
  );
}
