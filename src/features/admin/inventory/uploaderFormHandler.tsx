import { Box, Typography, Grid, Button, DialogContent } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../../app/components/AppDropzone";
import { Product } from "../../../app/models/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./productValidation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setProduct } from "../../catalog/catalogSlice";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

interface Props {
  product: Product;
  cancelEdit: () => void;
}

export default function UploaderFormHandler({ product, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });

  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (product && !watchFile && !isDirty)
      reset({
        ...product,
      });

    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [product, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Product;

      response = await agent.Admin.UpdateProductMedia(data);

      dispatch(setProduct(response));
      cancelEdit();
    } catch (error) {
      toast.error("خطا در بارگزاری");

      console.log(error);
    }
  }

  return (
    <DialogContent>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        بارگذاری فایل برای محصول {product.name}
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <AppDropzone control={control} name="file" />
          </Grid>
          <Grid item xs={6}>
            {watchFile ? (
              <img
                src={watchFile.preview}
                alt="preview"
                style={{ maxHeight: 200 }}
              />
            ) : null}
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
          <Button onClick={cancelEdit} variant="contained" color="inherit">
            انصراف
          </Button>
        </Box>
      </form>
    </DialogContent>
  );
}
