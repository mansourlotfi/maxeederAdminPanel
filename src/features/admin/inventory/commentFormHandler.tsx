import { Box, Typography, Grid, Button, DialogContent } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Product } from "../../../app/models/product";
import { yupResolver } from "@hookform/resolvers/yup";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { setProduct } from "./catalogSlice";
import AppTextInput from "../../../app/components/AppTextInput";
import { CommentSchema } from "./commentSchema";

interface Props {
  product: Product;
  cancel: () => void;
}

export default function CommentFormHandler({ product, cancel }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(CommentSchema),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (product && !isDirty)
      reset({
        ...product,
      });
  }, [product, reset, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    const exposedData: FieldValues = {
      id: product.id,
      name: data.name,
      email: data.email,
      text: data.text,
    };
    try {
      let response: Product;

      response = await agent.Admin.AddCommentToProduct(exposedData);

      dispatch(setProduct(response));
      toast.success("کامنت اضافه شد");
      cancel();
    } catch (error) {
      toast.error("خطا در کامنت گذاری");

      console.log(error);
    }
  }

  return (
    <DialogContent>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        افزودن کامنت برای محصول {product.name}
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppTextInput control={control} name="name" label="نام" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput control={control} name="email" label="ایمیل" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              name="text"
              label="متن"
              rows={3}
              multiline
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
          <Button onClick={cancel} variant="contained" color="inherit">
            انصراف
          </Button>
        </Box>
      </form>
    </DialogContent>
  );
}
