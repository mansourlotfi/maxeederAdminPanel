import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  InputLabel,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../../app/components/AppDropzone";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setPageItem } from "./pageItemsSlice";
import { useEffect } from "react";
import { enNumberConvertor } from "../../../app/util/util";
import AppSelectList from "../../../app/components/AppSelectList";
import { pagesItemsObj } from "./data";
import { pageItems } from "../../../app/models/PageItems";
import { useQuill } from "react-quilljs";
import usePageItems from "../../../app/hooks/usePageItems";

interface Props {
  itemToEdit?: pageItems;
  closeModalHandler: () => void;
}

export default function FormHandler({ closeModalHandler, itemToEdit }: Props) {
  const { pageItems } = usePageItems();
  const { quill: editor1, quillRef: quillRef1 } = useQuill({
    // Specify a unique id and a unique toolbar id for the first editor
    id: "editor1",
    toolbarId: "toolbar1",
  });
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!watchFile && !isDirty && itemToEdit)
      reset({
        ...itemToEdit,
        page: pagesItemsObj.find((P) => P.id === itemToEdit.page)?.displayName,
      });
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [reset, watchFile, isDirty, itemToEdit]);

  useEffect(() => {
    if (itemToEdit) {
      let parsedQuill1 = itemToEdit.ritchText?.substring(
        1,
        itemToEdit.ritchText.length - 1
      );

      if (editor1) {
        editor1.clipboard.dangerouslyPasteHTML(parsedQuill1);
      }
    }
  }, [editor1, itemToEdit]);

  async function handleSubmitData(data: FieldValues) {
    data.page = pagesItemsObj.find((I) => I.displayName === data.page)?.id;
    data.ritchText = JSON.stringify(quillRef1.current.firstChild.innerHTML);
    try {
      let response: pageItems;
      if (itemToEdit) {
        response = await agent.Admin.updatePageItem(data);
      } else {
        response = await agent.Admin.createPageItem(data);
      }
      dispatch(setPageItem(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (pageItems && !itemToEdit) {
      setValue(
        "priority",
        Math.max(...pageItems.map((o) => o.priority), 0)
          ? Math.max(...pageItems.map((o) => o.priority), 0) + 1
          : 1
      );
    }
  }, [pageItems, itemToEdit, setValue]);

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} ایتم صفحه
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="title" label="عنوان" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="titleEn"
              label="عوان انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="link" label="لینک" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="priority"
              label="اولویت"
              onKeyPress={enNumberConvertor}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList
              control={control}
              items={pagesItemsObj.map((P) => P.displayName)}
              name="page"
              label="ایتم صفحه"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="text"
              label="متن ساده"
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="textEn"
              label="متن ساده انگلیسی"
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="shortDesc"
              label="توضیح کوتاه"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="shortDescEn"
              label="توضیح کوتاه انگلیسی"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <AppDropzone control={control} name="file" />
              {watchFile?.preview ? (
                <img
                  src={watchFile.preview}
                  alt="preview"
                  style={{ maxHeight: 200 }}
                />
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} style={{ height: 300, direction: "rtl" }}>
            <InputLabel> متن با فرمت </InputLabel>
            <div ref={quillRef1} />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 20 }}>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            ثبت
          </LoadingButton>
          <Button
            onClick={closeModalHandler}
            variant="contained"
            color="inherit"
          >
            انصراف
          </Button>
        </Box>
      </form>
    </Box>
  );
}
