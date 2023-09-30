import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppCheckbox from "../../app/components/AppCheckbox";
import AppTextInput from "../../app/components/AppTextInput";
import { enNumberConvertor } from "../../app/util/util";

export default function AddressForm() {
  const { control, formState } = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        مقصد ارسال
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="fullName" label="نام کامل" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput
            control={control}
            name="phoneNumber"
            label="تلفن همراه"
            onKeyPress={enNumberConvertor}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="شهر" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="استان" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zip" label="کد پستی" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address1" label="آدرس" />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <AppCheckbox
          disabled={!formState.isDirty}
          name="saveAddress"
          label="ذخیره به عنوان آدرس پسش فرض برای خرید های بعدی"
          control={control}
        />
      </Grid>
      <Grid item xs={12}>
        <AppCheckbox
          disabled={false}
          name="noDelivery"
          label="تحویل حضوری بدون هزینه ارسال"
          control={control}
        />
      </Grid>
    </>
  );
}
