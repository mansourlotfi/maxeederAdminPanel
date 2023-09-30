import * as yup from "yup";

export const validationSchema = yup.object({
  fullName: yup.string().required(),
  phoneNumber: yup.string().required(),
  ref: yup.string().required(),
});
