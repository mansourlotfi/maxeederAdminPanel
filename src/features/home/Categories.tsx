import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import useCategories from "../../app/hooks/useCategories";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProductParams } from "../catalog/catalogSlice";
import { NavLink } from "react-router-dom";
function Categories() {
  const { categories, categoriesLoaded } = useCategories();
  const dispatch = useAppDispatch();
  const navStyles = {
    borderRadius: 4,
    color: "inherit",
    textDecoration: "none",
    typography: "h6",
    whiteSpace: "nowrap",
    "&:hover": {
      color: "grey.500",
    },
    "&.active": {
      color: "text.secondary",
    },
    width: "100%",
  };
  if (!categoriesLoaded) return <LoadingComponent />;
  return (
    <Grid container justifyContent="center" mt={10}>
      <Typography variant="h5">دسته بندی کالاها</Typography>
      <Grid container spacing={5} mt={1}>
        {categories.map((C, i) => (
          <Grid item xs={6} md={2} key={C.id}>
            <Card
              component={NavLink}
              to={"/catalog"}
              sx={navStyles}
              onClick={(e) => {
                dispatch(setProductParams({ types: [C.name] }));
              }}
            >
              <CardActionArea>
                <CardMedia
                  sx={{
                    borderRadius: 4,
                    objectFit: "fill",
                  }}
                  component="img"
                  // height={140}
                  // width={140}
                  image={C.pictureUrl}
                  alt={C.name}
                />
                <CardContent sx={{ background: "transparent" }}>
                  <Typography
                    variant="h6"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {C.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default Categories;
