import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().required(),
  brand: yup.string().required(),
  type: yup.string().required(),
  usage: yup.string().required(),
  quantityInStock: yup.number().nullable().min(0).max(200).required(),
  price: yup.number().nullable().moreThan(100).notRequired(),
  description: yup.string().required(),
  // file: yup.mixed().when("pictureUrl", {
  //   is: (value: string) => !value,
  //   then: yup.mixed().required("Please provide an image"),
  //   otherwise: yup.mixed().nonNullable().notRequired(),
  // }),
});
