import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Container component={Paper} sx={{ height: 400 }}>
      <Typography gutterBottom variant="h4" pt={5}>
        صفحه مورد نظر یافت نشد
      </Typography>
      <Divider />
      <Button
        fullWidth
        component={Link}
        to="/admin-dashboard/inventory"
        sx={{ paddingTop: 5 }}
      >
        برگرد به صفحه محصولات
      </Button>
    </Container>
  );
}
