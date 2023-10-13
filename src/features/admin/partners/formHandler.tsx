import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setPartner } from "./partnersSlice";
import { useEffect } from "react";
import { Partner } from "../../../app/models/Partner";

interface Props {
  itemToEdit?: Partner;
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
    if (!isDirty) reset(itemToEdit);
  }, [reset, isDirty, itemToEdit]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Partner;
      if (itemToEdit) {
        response = await agent.Admin.updatePartner(data);
      } else {
        response = await agent.Admin.createPartner(data);
      }
      dispatch(setPartner(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} نماینده
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="title" label="عنوان" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="ceo" label="مدیر" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="state" label="استان" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="city" label="شهر" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="titleEn"
              label="عنوان انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="ceoEn" label="مدیر انگلیسی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="stateEn"
              label="استان انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="cityEn" label="شهر انگلیسی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="tel" label="تلفن" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="long" label="لانگ" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="lat" label="لت" />
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
