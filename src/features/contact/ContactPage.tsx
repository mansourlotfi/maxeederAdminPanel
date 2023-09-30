import { Container, Grid, Typography } from "@mui/material";
import ContactSocials from "../../app/layout/contactSocials";

function ContactPage() {
  return (
    <Container sx={{ minHeight: "90vh" }}>
      <Typography gutterBottom variant={"h6"}></Typography>

      <Typography gutterBottom variant={"h6"}></Typography>
      <ContactSocials />
      <Grid container justifyContent="center" mt={5}>
        <img
          src="/android-chrome-192x192.png"
          alt="Admin"
          style={{ height: 100, width: 100, borderRadius: 50 }}
        />
      </Grid>
    </Container>
  );
}

export default ContactPage;
