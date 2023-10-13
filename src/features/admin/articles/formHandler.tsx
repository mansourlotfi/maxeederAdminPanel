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
import { setArticles } from "./articlesSlice";
import { useEffect } from "react";
import { enNumberConvertor } from "../../../app/util/util";
import { useQuill } from "react-quilljs";
import { Article } from "../../../app/models/Article";
import useArticles from "../../../app/hooks/useArticles";

interface Props {
  itemToEdit?: Article;
  closeModalHandler: () => void;
}

export default function FormHandler({ closeModalHandler, itemToEdit }: Props) {
  const { articles } = useArticles();

  const { quill: editor1, quillRef: quillRef1 } = useQuill({
    // Specify a unique id and a unique toolbar id for the first editor
    id: "editor1",
    toolbarId: "toolbar1",
  });
  const { quill: editor2, quillRef: quillRef2 } = useQuill({
    // Specify a unique id and a unique toolbar id for the second editor
    id: "editor2",
    toolbarId: "toolbar2",
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
      let parsedQuill2 = itemToEdit.ritchTextEn?.substring(
        1,
        itemToEdit.ritchTextEn.length - 1
      );

      if (editor1) {
        editor1.clipboard.dangerouslyPasteHTML(parsedQuill1);
      }
      if (editor2) {
        editor2.clipboard.dangerouslyPasteHTML(parsedQuill2);
      }
    }
  }, [editor1, editor2, itemToEdit]);

  async function handleSubmitData(data: FieldValues) {
    data.ritchText = JSON.stringify(quillRef1.current.firstChild.innerHTML);
    data.ritchTextEn = JSON.stringify(quillRef2.current.firstChild.innerHTML);

    try {
      let response: Article;
      if (itemToEdit) {
        response = await agent.Admin.updatearticle(data);
      } else {
        response = await agent.Admin.createarticle(data);
      }
      dispatch(setArticles(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (articles && !itemToEdit) {
      setValue(
        "priority",
        Math.max(...articles.map((o) => o.priority), 0)
          ? Math.max(...articles.map((o) => o.priority), 0) + 1
          : 1
      );
    }
  }, [articles, itemToEdit, setValue]);

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} مقاله
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
              label="عنوان انگلیسی"
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
            <InputLabel> متن فارسی </InputLabel>
            <div ref={quillRef1} />
          </Grid>
          <Grid
            item
            xs={12}
            mt={20}
            style={{ height: 300, direction: "rtl", textAlign: "right" }}
          >
            <InputLabel>متن انگلیسی</InputLabel>
            <div
              style={{ direction: "rtl", textAlign: "right" }}
              ref={quillRef2}
            />
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
