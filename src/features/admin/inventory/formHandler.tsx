import {
  Box,
  Typography,
  Grid,
  Button,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../../app/components/AppDropzone";
import AppSelectList from "../../../app/components/AppSelectList";
import AppTextInput from "../../../app/components/AppTextInput";
import { Product } from "../../../app/models/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./productValidation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import useCategories from "../../../app/hooks/useCategories";
import useBrands from "../../../app/hooks/useBrands";
import AppCheckbox from "../../../app/components/AppCheckbox";
import useProductFeatures from "../../../app/hooks/useProductFeatures";
import useSizes from "../../../app/hooks/useSizes";
import useUsages from "../../../app/hooks/useUsages";
import { setProduct } from "./catalogSlice";
import { toast } from "react-toastify";

interface Props {
  product?: Product;
  cancelEdit: () => void;
}

export default function FormHandler({ product, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const { brands } = useBrands();

  // const { brands, types } = useProducts();
  const { categories } = useCategories();
  const { sizes } = useSizes();
  const { usages } = useUsages();

  const { productFeatures } = useProductFeatures();

  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // handle the change of checkbox state here
    // for example, add or remove the id from the checkedIds array
    const id = Number(event.target.value); // get the id from the value attribute
    const checked = event.target.checked; // get the checked state from the event
    if (checked) {
      // if checked, add the id to the array if not already present
      setCheckedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      // if unchecked, remove the id from the array if present
      setCheckedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    if (product && !watchFile && !isDirty)
      reset({
        ...product,
      });
    if (product) {
      setCheckedIds(product.features.map((F) => F.featureId));
    }
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [product, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    data.features = checkedIds;
    try {
      let response: Product;
      if (product) {
        response = await agent.Admin.updateProduct(data);
      } else {
        response = await agent.Admin.createProduct(data);
      }
      dispatch(setProduct(response));
      cancelEdit();
    } catch (errors: any) {
      for (const key in errors) {
        toast.error(errors[key]);
      }
    }
  }

  return (
    <DialogContent>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {product ? "ویرایش" : "افزودن"} کالا
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <AppTextInput control={control} name="name" label="نام کالا" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="nameEn"
              label="نام کالا انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppSelectList
              control={control}
              items={brands.map((B) => B.name)}
              name="brand"
              label="برند"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppSelectList
              control={control}
              items={categories.map((C) => C.name) || []}
              name="type"
              label="دسته بندی"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              type="number"
              control={control}
              name="price"
              label="قیمت"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppSelectList
              control={control}
              items={sizes.map((C) => C.sizeName) || []}
              name="size"
              label="اندازه"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppSelectList
              control={control}
              items={usages.map((C) => C.name) || []}
              name="usage"
              label="کاربرد"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              type="number"
              control={control}
              name="quantityInStock"
              label="تعداد موجود"
            />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              control={control}
              multiline={true}
              rows={4}
              name="description"
              label="توضیحات"
            />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              control={control}
              multiline={true}
              rows={4}
              name="descriptionEn"
              label="توضیحات انگلیسی"
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <AppCheckbox
                disabled={false}
                name="isFeatured"
                label="محصول ویژه"
                control={control}
              />
            </Box>
          </Grid>
          <Grid item container xs={12}>
            {productFeatures &&
              productFeatures.map((PF) => (
                <Box key={PF.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={PF.id}
                        onChange={handleChange}
                        color="primary"
                        checked={!!checkedIds.find((item) => item === PF.id)}
                      />
                    }
                    label={PF.name}
                  />
                </Box>
              ))}
          </Grid>

          <Grid item container xs={12}>
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
              ) : (
                <img
                  src={product?.pictureUrl}
                  alt={product?.name}
                  style={{ maxHeight: 200 }}
                />
              )}
            </Grid>
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
