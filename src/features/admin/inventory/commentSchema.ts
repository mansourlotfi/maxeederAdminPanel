import * as yup from "yup";

export const CommentSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  text: yup.string().required(),
});
