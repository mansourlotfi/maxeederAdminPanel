import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../../app/components/AppDropzone";
import AppTextInput from "../../../app/components/AppTextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validation";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { setArtist } from "./artistsSlice";
import { useEffect } from "react";
import { enNumberConvertor } from "../../../app/util/util";
import { Artist } from "../../../app/models/Artsts";
import useArtists from "../../../app/hooks/useArtists";

interface Props {
  itemToEdit?: Artist;
  closeModalHandler: () => void;
}

export default function FormHandler({ closeModalHandler, itemToEdit }: Props) {
  const { artists } = useArtists();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!watchFile && !isDirty) reset(itemToEdit);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [reset, watchFile, isDirty, itemToEdit]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Artist;
      if (itemToEdit) {
        response = await agent.Admin.updateArtist(data);
      } else {
        response = await agent.Admin.createArtist(data);
      }
      dispatch(setArtist(response));
      closeModalHandler();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (artists && !itemToEdit) {
      setValue(
        "priority",
        Math.max(...artists.map((o) => o.priority), 0)
          ? Math.max(...artists.map((o) => o.priority), 0) + 1
          : 1
      );
    }
  }, [artists, itemToEdit, setValue]);
  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {itemToEdit ? "ویرایش" : "افزودن"} هنرمند
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="name" label="نام" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="text" label="متن" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="nameEn" label="نام انگلیسی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="textEn" label="متن انگلیسی" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="priority"
              label="اولویت"
              onKeyPress={enNumberConvertor}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <AppDropzone control={control} name="file" />
              {watchFile?.preview ? (
                <img
                  src={watchFile.preview}
                  alt="preview"
                  style={{ maxHeight: 200 }}
                />
              ) : null}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            ثبت
          </LoadingButton>
          <Button
            onClick={closeModalHandler}
            variant="contained"
            color="inherit"
          >
            انصراف
          </Button>
        </Box>
      </form>
    </Box>
  );
}
