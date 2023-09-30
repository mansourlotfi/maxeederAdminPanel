import Slider from "react-slick";
import { Grid, useMediaQuery } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  rtl: true,
  autoplay: true,
  speed: 1000,
  cssEase: "linear",
  autoplaySpeed: 8000,
};
function TopSwiper() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Slider {...settings}>
        <Grid container>
          <Grid
            container
            item
            style={{
              backgroundImage: isMobile
                ? "url(images/cover/cover1.jpg)"
                : "url(images/cover/slide1.jpg)",
              height: 400,
              width: "100%",
              aspectRatio: "auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              // objectFit: "fill",
              backgroundSize: "cover",
              display: "block",
            }}
          ></Grid>
        </Grid>
        <Grid container>
          <Grid
            container
            item
            style={{
              backgroundImage: isMobile
                ? "url(images/cover/cover2.jpg)"
                : "url(images/cover/slide2.jpg)",
              height: 400,
              width: "100%",
              aspectRatio: "auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              // objectFit: "fill",
              backgroundSize: "cover",
              display: "block",
            }}
          ></Grid>
        </Grid>
        <Grid container>
          <Grid
            container
            item
            style={{
              backgroundImage: isMobile
                ? "url(images/cover/cover3.jpg)"
                : "url(images/cover/slide3.jpg)",
              height: 400,
              width: "100%",
              aspectRatio: "auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              // objectFit: "fill",
              backgroundSize: "cover",
              display: "block",
            }}
          ></Grid>
        </Grid>
        <Grid container>
          <Grid
            container
            item
            style={{
              backgroundImage: isMobile
                ? "url(images/cover/cover4.jpg)"
                : "url(images/cover/slide4.jpg)",
              height: 400,
              width: "100%",
              aspectRatio: "auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              // objectFit: "fill",
              backgroundSize: "cover",
              display: "block",
            }}
          ></Grid>
        </Grid>
      </Slider>
    </>
  );
}

export default TopSwiper;
