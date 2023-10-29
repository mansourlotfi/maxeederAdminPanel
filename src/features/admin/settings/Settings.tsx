import { useCallback, useEffect, useState } from "react";
import agent from "../../../app/api/agent";
import { Setting } from "../../../app/models/Setting";
import { FieldValues, useForm } from "react-hook-form";
import { Box, Grid, Typography } from "@mui/material";
import AppTextInput from "../../../app/components/AppTextInput";
import { LoadingButton } from "@mui/lab";
import { validationSchema } from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { enNumberConvertor } from "../../../app/util/util";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting | null>();
  const [isSubmitting, setisSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });

  const postSettings = useCallback((data: FieldValues) => {
    setisSubmitting(true);
    agent.Admin.postSettingsData(data)
      .then((response) => {
        toast.success("تنظیمات به روزرسانی شد");
        setisSubmitting(false);
      })
      .catch((err) => {
        toast.error("مشکلی به وجود امده است");
        setisSubmitting(false);
      });
  }, []);

  useEffect(() => {
    let getQuillHtml = () => {
      try {
        agent.Admin.getSettingsData().then((response) => {
          if (response) {
            setSettings(response);
          }
        });
      } catch (error) {}
    };
    getQuillHtml();
  }, []);

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          تنظیمات سایت
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(postSettings)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="email" label="ایمیل سایت" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="address" label="آدرس" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="addressEn"
              label="آدرس انگلیسی"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="phone" label="تلفن" />
          </Grid>

          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="footerText"
              label="متن پاصفحه"
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              name="footerTextEn"
              label="متن پاصفحه انگلیسی"
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              name="workHours"
              label="ساعات کار"
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              name="workHoursEn"
              label="ساعات کار انگلیسی"
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              name="ProductCountInPage"
              label="تعداد نمایش محصول در صفحه"
              onKeyPress={enNumberConvertor}
            />
          </Grid>
        </Grid>
        <Box mt={10} display="flex" justifyContent="space-between" p={10}>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            ثبت
          </LoadingButton>
        </Box>
      </form>
    </>
  );
}
