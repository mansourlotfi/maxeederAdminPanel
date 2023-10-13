import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setMenu } from "./mainMenuSlice";
import { useEffect } from "react";
import { enNumberConvertor } from "../../../app/util/util";
import { MainMenu } from "../../../app/models/MainMenu";

interface Props {
  itemToEdit?: MainMenu;
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
      let response: MainMenu;
      if (itemToEdit) {
        response = await agent.Admin.updateMainMenu(data);
      } else {
        response = await agent.Admin.createMainMenu(data);
      }
      dispatch(setMenu(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} منو
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="title" label="نام" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="titleEn"
              label="نام انگلیسی"
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
