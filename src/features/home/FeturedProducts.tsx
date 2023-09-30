import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import { Grid } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useProducts from "../../app/hooks/useProducts";
import { NavLink } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function FeturedProducts() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { featuredProducts } = useProducts();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    arrows: false,
    rtl: true,
    autoplay: true,
    speed: 1000,
    cssEase: "linear",
    className: "center",
    centerMode: true,
    centerPadding: "60px",
  };

  return (
    <>
      <Typography variant="h5" textAlign="center" m="20px 0">
        پرفروش ترین ها
      </Typography>
      {/* <Grid container mt={10} spacing={5} p={isMobile ? 0 : 2}> */}

      <Slider {...settings}>
        {featuredProducts.map((P, i) => (
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
                display: "block",
                borderRadius: 8,
              }}
            ></Grid>
          </Grid>
        ))}
      </Slider>
    </>
  );
}

export default FeturedProducts;
