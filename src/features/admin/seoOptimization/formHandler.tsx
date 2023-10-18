import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setSeoOpt } from "./seoOptSlice";
import { useEffect } from "react";
import { enNumberConvertor } from "../../../app/util/util";
import AppSelectList from "../../../app/components/AppSelectList";
import { seoOptPageObj } from "./data";
import { PageEnum, SeoOptimization } from "../../../app/models/SeoOptimization";

interface Props {
  itemToEdit?: SeoOptimization;
  closeModalHandler: () => void;
}

export default function FormHandler({ closeModalHandler, itemToEdit }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isDirty && itemToEdit)
      reset({
        ...itemToEdit,
        page: seoOptPageObj.find((P) => P.id === itemToEdit.page)?.displayName,
      });
  }, [reset, isDirty, itemToEdit]);

  async function handleSubmitData(data: FieldValues) {
    data.page = seoOptPageObj.find((I) => I.displayName === data.page)?.id;
    try {
      let response: SeoOptimization;
      if (itemToEdit) {
        response = await agent.Admin.updateSeoOptimization(data);
      } else {
        response = await agent.Admin.postSeoOptimizationData(data);
      }
      dispatch(setSeoOpt(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} ایتم
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="text" label="متن" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="textEn" label="متن انگلیسی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="description" label="توضیح" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="descriptionEn"
              label="توضیح انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="metaTagKeyWords"
              label="متا کیورد"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="metaTagKeyWordsEn"
              label="متا کیورد انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="metaTagDescription"
              label="متا دسکریپشن"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="metaTagDescriptionEn"
              label="متا دسکریپشن انگلیسی"
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
          <Grid item xs={12} sm={6}>
            <AppSelectList
              control={control}
              items={seoOptPageObj
                .filter((SEO) => SEO.id !== PageEnum.All)
                .map((P) => P.displayName)}
              name="page"
              label="ایتم"
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
