import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./brandValidation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { Brand } from "../../../app/models/Brand";
import { setBrand } from "./brandSlice";
import AppDropzone from "../../../app/components/AppDropzone";
import { useEffect } from "react";

interface Props {
  closeModalHandler: () => void;
}

export default function FormHandler({ closeModalHandler }: Props) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!watchFile && !isDirty) reset();
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Brand;
      response = await agent.Admin.createBrand(data);
      dispatch(setBrand(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        افزودن برند
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="name" label="نام  برند" />
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
