import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import agent from "../../../app/api/agent";

export interface IProps {
  closeModalHandler: () => void;
}
export default function Register(props: IProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Email")) {
          setError("email", { message: error });
        } else if (error.includes("Username")) {
          setError("username", { message: error });
        }
      });
    }
  }

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Typography component="h1" variant="h5">
        ثبت نام کاربر جدید
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data: any) =>
          agent.Account.otpRegister(data)
            .then(() => {
              toast.success("ثبت کاربر با موفقیت انجام شد");
              props.closeModalHandler();
            })
            .catch((error) => handleApiErrors(error))
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="شماره همراه"
          autoFocus
          size="small"
          {...register("phoneNumber", { required: " شماره همراه اجباری" })}
          error={!!errors.phoneNumber}
          helperText={<>{errors?.phoneNumber?.message}</>}
        />

        <Grid item container justifyContent="space-between" mt={3}>
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            ثبت نام
          </LoadingButton>
          <Button
            onClick={props.closeModalHandler}
            variant="contained"
            color="inherit"
          >
            انصراف
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
}
