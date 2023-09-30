import * as yup from "yup";

export const validationSchema = [
  yup.object().shape({
    // noDelivery: yup.boolean(),
    fullName: yup.string().nullable().required("لطفا نام را وارد نمایید"),
    address1: yup.string().test({
      test: function (value, context) {
        let address = value || "";
        let noDelivery = context.parent.noDelivery || "";
        return (
          (noDelivery && !address) ||
          (!noDelivery && address) ||
          (noDelivery && address)
        );
      },
    }),
    city: yup.string().test({
      test: function (value, context) {
        let city = value || "";
        let noDelivery = context.parent.noDelivery || "";
        return (
          (noDelivery && !city) || (!noDelivery && city) || (noDelivery && city)
        );
      },
    }),
    state: yup.string().test({
      test: function (value, context) {
        let state = value || "";
        let noDelivery = context.parent.noDelivery || "";
        return (
          (noDelivery && !state) ||
          (!noDelivery && state) ||
          (noDelivery && state)
        );
      },
    }),
    // s
    zip: yup.string().test({
      test: function (value, context) {
        let zip = value || "";
        let noDelivery = context.parent.noDelivery || "";
        return (
          (noDelivery && !zip) || (!noDelivery && zip) || (noDelivery && zip)
        );
      },
    }),
    // s,
    phoneNumber: yup.string().required("لطفا شماره همراه را وارد نمایید"),
  }),
  yup.object(),
  yup.object({
    // nameOnCard: yup.string().required(),
  }),
  yup.object({
    fullName: yup.string().required(),
    address1: yup.string().notRequired(),
    city: yup.string().notRequired(),
    state: yup.string().notRequired(),
    zip: yup.string().notRequired(),
    phoneNumber: yup.string().required(),
  }),
];
