// import { ShoppingCart, DarkMode, Home } from "@mui/icons-material";
import { AppBar, List, ListItem, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import useMediaQuery from "@mui/material/useMediaQuery";

const rightLinks = [
  { title: "ورود", path: "/login" },
  { title: "ثبت نام", path: "/register" },
];

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
  },
};

export default function Header() {
  const { user } = useAppSelector((state) => state.account);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="dense"
      >
        <Box display="flex" alignItems="center"></Box>

        <Box display="flex" alignItems="center">
          {!isMobile ? (
            <>
              {user ? (
                <SignedInMenu />
              ) : (
                <List sx={{ display: "flex" }}>
                  {rightLinks.map(({ title, path }) => (
                    <ListItem
                      component={NavLink}
                      to={path}
                      key={path}
                      sx={navStyles}
                    >
                      {title.toUpperCase()}
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
