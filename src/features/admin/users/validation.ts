import * as yup from "yup";

export const validationSchema = yup.object({
  phoneNumber: yup.string().nullable().required(),
  // file: yup.mixed().when("pictureUrl", {
  //   is: (value: string) => !value,
  //   then: yup.mixed().required("Please provide an image"),
  // }),
});
