import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import { Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useProducts from "../../app/hooks/useProducts";
import { NavLink } from "react-router-dom";
import Badge from "./badge";

function NewProducts() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { products } = useProducts();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    arrows: false,
    rtl: true,
    autoplay: true,
    speed: 2000,
    cssEase: "linear",
    className: "center",
    centerMode: true,
    centerPadding: "60px",
  };
  return (
    <>
      <Typography variant="h5" textAlign="center" m="40px 0 10px 0">
        جدید ترین ها
      </Typography>

      <Slider {...settings}>
        {products.map((P, i) => (
          <Grid container justifyContent="center" key={i}>
            <Grid
              container
              item
              xs={11}
              component={NavLink}
              to={`/catalog/${P.id}`}
              justifyContent="center"
              style={{
                backgroundImage: `url(${P.pictureUrl})`,
                width: "auto",
                height: "auto",
                margin: "auto",
                aspectRatio: "1/1",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                // objectFit: "fill",
                backgroundSize: "cover",
                borderRadius: 8,
                position: "relative",
              }}
            >
              <Badge amount={P.price} />
            </Grid>
          </Grid>
        ))}
      </Slider>
    </>
  );
}

export default NewProducts;
