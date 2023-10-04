import { Grid, Typography } from "@mui/material";
import UsersAndPartners from "./UsersAndPartners";
import ProductReports from "./Products";
import MessagesReport from "./MessagesReport";

function AdminReports() {
  return (
    <Grid container spacing={8}>
      <Grid item container justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          گزارشات
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <UsersAndPartners />
      </Grid>
      <Grid item xs={6}>
        <ProductReports />
      </Grid>

      <Grid item xs={6}>
        <MessagesReport />
      </Grid>
    </Grid>
  );
}

export default AdminReports;
