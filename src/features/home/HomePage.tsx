import { useCookies } from "react-cookie";
import Brands from "./Brands";
import Categories from "./Categories";
import FeturedProducts from "./FeturedProducts";
import TopSwiper from "./TopSwiper";
import NewProducts from "./newProducts ";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Container, Grid } from "@mui/material";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  let ref = searchParams.get("ref");
  const [, setCookie] = useCookies(["ref"]);

  useEffect(() => {
    if (ref?.length) {
      setCookie("ref", ref, {
        path: "/",
        expires: new Date(new Date().setDate(new Date().getDate() + 7)),
        maxAge: 604800,
      });
    }
  }, [ref, setCookie]);

  return (
    <>
      <TopSwiper />
      <Container sx={{ minHeight: "90vh" }}>
        <NewProducts />
        <Categories />
        <Brands />
        <FeturedProducts />
        <Grid container justifyContent="center" mt={10}>
          <a
            referrerPolicy="origin"
            rel="noopener noreferrer"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=363760&amp;Code=QqnLQ39OKN6wJzDCx6Nm"
          >
            <img
              referrerPolicy="origin"
              src="https://Trustseal.eNamad.ir/logo.aspx?id=363760&amp;Code=QqnLQ39OKN6wJzDCx6Nm"
              alt=""
              style={{
                cursor: "pointer",
                width: 150,
                height: 150,
                borderRadius: 8,
              }}
              id="QqnLQ39OKN6wJzDCx6Nm"
            />
          </a>
        </Grid>
      </Container>
    </>
  );
}
