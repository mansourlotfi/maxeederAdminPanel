import { useCallback, useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import agent from "../../../app/api/agent";
import { Setting } from "../../../app/models/Setting";
import { FieldValues, useForm } from "react-hook-form";
import { Box, Grid, Typography } from "@mui/material";
import AppTextInput from "../../../app/components/AppTextInput";
import { LoadingButton } from "@mui/lab";
import InputLabel from "@mui/material/InputLabel";
import { validationSchema } from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import "./styles.css";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const { quill: editor1, quillRef: quillRef1 } = useQuill({
    // Specify a unique id and a unique toolbar id for the first editor
    id: "editor1",
    toolbarId: "toolbar1",
  });

  const { quill: editor2, quillRef: quillRef2 } = useQuill({
    // Specify a unique id and a unique toolbar id for the second editor
    id: "editor2",
    toolbarId: "toolbar2",
  });
  const [settings, setSettings] = useState<Setting>();
  const [isSubmitting, setisSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });

  const generateValues = useCallback(
    (values: any): Omit<Setting, "id"> => {
      return {
        description: values.description ?? null,
        email: values.email ?? null,
        address: values.address ?? null,
        phone: values.phone ?? null,
        footerText: values.footerText ?? null,
        contactUsRitchText: JSON.stringify(
          quillRef1.current.firstChild.innerHTML
        ),
        servicesRitchText: JSON.stringify(
          quillRef2.current.firstChild.innerHTML
        ),
      };
    },
    [quillRef1, quillRef2]
  );

  const saveQuillHtml = useCallback(
    (data: FieldValues) => {
      setisSubmitting(true);
      agent.Admin.postSettingsData(generateValues(data))
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

  useEffect(() => {
    let getQuillHtml = () => {
      try {
        agent.Admin.getSettingsData().then((response) => {
          if (response) {
            setSettings(response);
            let parsedQuill1 = response.contactUsRitchText?.substring(
              1,
              response.contactUsRitchText.length - 1
            );

            let parsedQuill2 = response.servicesRitchText?.substring(
              1,
              response.servicesRitchText.length - 1
            );

            if (editor1) {
              editor1.clipboard.dangerouslyPasteHTML(parsedQuill1);
            }
            if (editor2) {
              editor2.clipboard.dangerouslyPasteHTML(parsedQuill2);
            }
          }
        });
      } catch (error) {
        console.log("first");
      }
    };
    getQuillHtml();
  }, [editor1, editor2]);

  // const { products, metaData } = useProducts();
  // const dispatch = useAppDispatch();

  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (settings) {
      // setValue([
      //   { description: settings.description },
      //   { email: settings.email },
      // ]);
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
      <form onSubmit={handleSubmit(saveQuillHtml)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="description"
              label="توضیحات سایت"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="email" label="ایمیل سایت" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              multiline
              rows={3}
              name="address"
              label="آدرس سایت"
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput control={control} name="phone" label="تلفن سایت" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              control={control}
              name="footerText"
              label="متن پاصفحه"
            />
          </Grid>

          <Grid item xs={12} style={{ height: 300, direction: "rtl" }}>
            <InputLabel>تماس با ما</InputLabel>
            <div ref={quillRef1} />
          </Grid>

          <Grid
            item
            xs={12}
            mt={20}
            style={{ height: 300, direction: "rtl", textAlign: "right" }}
          >
            <InputLabel>خدمات</InputLabel>
            <div
              style={{ direction: "rtl", textAlign: "right" }}
              ref={quillRef2}
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
