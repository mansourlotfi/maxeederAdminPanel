import {
  Paper,
  Grid,
  Container,
  ListItemText,
  ListItemIcon,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import Header from "../../app/layout/Header";
import { useAppSelector } from "../../app/store/configureStore";
import { NavLink, Outlet } from "react-router-dom";
import { AdminLinks } from "./data";

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  whiteSpace: "nowrap",
  "&:hover": {
    color: "grey.500",
  },
  "&.active": {
    color: "text.secondary",
    backgroundColor: "primary.light",
  },
};
function AdminDashboard() {
  const { user } = useAppSelector((state) => state.account);

  return (
    <Grid
      container
      flexDirection="column"
      minHeight={"100vh"}
      component={Paper}
    >
      <Grid container item>
        <Header />
      </Grid>
      <Grid container item>
        <Grid item container width={250}>
          <Paper
            sx={{
              width: 250,
              maxWidth: "100%",
              minHeight: "calc(100vh - 48px)",
            }}
          >
            <List>
              {user
                ? AdminLinks.map((item) => (
                    <ListItem
                      key={item.id}
                      disablePadding
                      component={NavLink}
                      to={item.link}
                      sx={navStyles}
                    >
                      <ListItemButton>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    </ListItem>
                  ))
                : null}
            </List>
          </Paper>
        </Grid>
        <Grid item container xs>
          <Container>
            <Outlet />
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;
