import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../../app/components/AppDropzone";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { resetParams, setSubCategory } from "./subCategorySlice";
import { useEffect } from "react";
import { enNumberConvertor } from "../../../app/util/util";
import useSubCategories from "../../../app/hooks/useSubCategories";
import useCategories from "../../../app/hooks/useCategories";
import AppSelectList from "../../../app/components/AppSelectList";
import { SubCategory } from "../../../app/models/SubCategory";

interface Props {
  closeModalHandler: () => void;
  itemToEdit?: SubCategory;
}

export default function FormHandler({ closeModalHandler, itemToEdit }: Props) {
  const { subCategories } = useSubCategories();
  const { categories } = useCategories();

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
    if (!watchFile && !isDirty) reset(itemToEdit);
    setTimeout(() => {
      setValue("categoryId", null);
    }, 100);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [reset, watchFile, isDirty, itemToEdit, setValue]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: SubCategory;

      data.categoryId = categories.find((i) => i.name === data.categoryId)?.id;

      if (itemToEdit) {
        response = await agent.Admin.updateSubCategory(data);
      } else {
        response = await agent.Admin.createSubCategory(data);
      }
      dispatch(setSubCategory(response));
      dispatch(resetParams());
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (subCategories && !itemToEdit) {
      setValue(
        "priority",
        Math.max(...subCategories.map((o) => o.priority), 0)
          ? Math.max(...subCategories.map((o) => o.priority), 0) + 1
          : 1
      );
    }
  }, [subCategories, itemToEdit, setValue]);

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} زیر دسته بندی
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="name" label="نام دسته بندی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="nameEn" label="نام انگلیسی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="link" label="لینک" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList
              control={control}
              items={categories.map((P) => P.name)}
              name="categoryId"
              label="انتخاب دسته بندی مرجع"
            />
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
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
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
