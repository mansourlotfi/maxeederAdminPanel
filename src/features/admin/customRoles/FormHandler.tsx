import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setCustomeRole } from "./customRolesSlice";
import { validationSchema } from "./validation";
import { ICustomUserRoles } from "../../../app/models/users";

interface Props {
  closeModalHandler: () => void;
}

export default function FormHandler({ closeModalHandler }: Props) {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });

  const dispatch = useAppDispatch();

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: ICustomUserRoles;
      response = await agent.Admin.createCustomRole(data);
      dispatch(setCustomeRole(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        افزودن نقش
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="name" label="نام نقش " />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            disabled={!isDirty}
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
