import { useCallback, useEffect, useState } from "react";
import agent from "../../../app/api/agent";
import { FieldValues, useForm } from "react-hook-form";
import { Box, Grid, Typography } from "@mui/material";
import AppTextInput from "../../../app/components/AppTextInput";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { CeoOptimization } from "../../../app/models/CeoOptimization";

export default function AdminCeoOptimazation() {
  const [settings, setSettings] = useState<CeoOptimization>();
  const [isSubmitting, setisSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  const generateValues = useCallback(
    (values: any): Omit<CeoOptimization, "id"> => {
      return {
        metaTagKeyWords: values.metaTagKeyWords ?? null,
        metaTagDescription: values.metaTagDescription ?? null,
      };
    },
    []
  );

  const saveData = useCallback(
    (data: FieldValues) => {
      setisSubmitting(true);
      agent.Admin.postCeoOptimizationData(generateValues(data))
        .then((response) => {
          toast.success("تنظیمات به روزرسانی شد");
          setisSubmitting(false);
        })
        .catch((err) => {
          toast.error("مشکلی به وجود امده است");
          setisSubmitting(false);
        });
    },
    [generateValues]
  );

  const fetchData = useCallback(() => {
    agent.Admin.getCeoOptimizationsData().then((response) => {
      if (response) {
        setSettings(response);
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          سئو و بهینه سازی
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(saveData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="metaTagKeyWords"
              label="متا تگ Keywords"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="metaTagDescription"
              label="متا تگ Descriptions"
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" p={10}>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            disabled={!isDirty}
            variant="contained"
          >
            ثبت
          </LoadingButton>
        </Box>
      </form>
    </>
  );
}
