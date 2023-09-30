import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./brokerValidation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setBroker } from "./brokerSlice";
import { Broker } from "../../../app/models/Broker";
import { enNumberConvertor } from "../../../app/util/util";

interface Props {
  cancel: () => void;
}

export default function BrokerForm({ cancel }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const dispatch = useAppDispatch();

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Broker;
      response = await agent.Admin.createBroker(data);
      dispatch(setBroker(response));
      cancel();
      reset();
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
            <AppTextInput control={control} name="fullName" label="نام  کامل" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="phoneNumber"
              label="تلفن همراه"
              onKeyPress={enNumberConvertor}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="ref"
              label="شماره ریفرنس"
              onKeyPress={enNumberConvertor}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button onClick={cancel} variant="contained" color="inherit">
            انصراف
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
            color="success"
          >
            ثبت
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}
