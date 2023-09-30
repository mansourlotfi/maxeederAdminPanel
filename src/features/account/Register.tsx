import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
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
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        ثبت نام
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data: any) =>
          agent.Account.register(data)
            .then(() => {
              toast.success("ثبت نام با موفقیت انجام شد");
              navigate("/login");
            })
            .catch((error) => handleApiErrors(error))
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="نام کاربری"
          autoFocus
          size="small"
          {...register("username", { required: "نام کاربری اجباری" })}
          error={!!errors.username}
          helperText={<>{errors?.username?.message}</>}
        />
        <TextField
          margin="normal"
          fullWidth
          label="آدرس ایمیل"
          size="small"
          {...register("email", {
            required: "ایمیل اجباری",
            pattern: {
              value: /^\w+[\w-.]*@\w+((-\w+)|(\w*)).[a-z]{2,3}$/,
              message: "Not a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={<>{errors?.email?.message}</>}
        />
        <TextField
          margin="normal"
          fullWidth
          label="رمز عبور"
          type="password"
          size="small"
          {...register("password", {
            required: "رمز عبور اجباری",
            // pattern: {
            //   value:
            //     /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
            //   message: "Password is not complex enough",
            // },
          })}
          error={!!errors.password}
          helperText={<>{errors?.password?.message}</>}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            background: theme.palette.secondary.main,
            "&:hover": {
              boxShadow: "none",
              background: theme.palette.secondary.main,
            },
            "&:active": {
              boxShadow: "none",
              background: theme.palette.secondary.main,
            },
          }}
        >
          ثبت نام
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/login">{"قبلا ثبت نام کردید؟ اینجا وارد بشید"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
