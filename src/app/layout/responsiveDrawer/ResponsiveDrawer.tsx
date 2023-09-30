import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
// import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import {
  AdminLinks,
  LogedInUserLinks,
  LogedOutUserLinks,
  UserLinks,
} from "./data";
import { signOut } from "../../../features/account/accountSlice";
import { clearBasket } from "../../../features/basket/basketSlice";
import { Link, NavLink } from "react-router-dom";
// import { DarkMode, LightMode } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useCategories from "../../hooks/useCategories";
import { setProductParams } from "../../../features/catalog/catalogSlice";
import useBrands from "../../hooks/useBrands";
import ContactSocials from "../contactSocials";
import "./styles.css";

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

interface Props {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export default function ResponsiveDrawer({
  handleThemeChange,
  darkMode,
}: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAppSelector((state) => state.account);
  const { categories } = useCategories();
  const { brands } = useBrands();
  const dispatch = useAppDispatch();

  const toggleDrawer = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <Grid
        container
        height="100vh"
        flexDirection="column"
        flexWrap="nowrap"
        sx={{
          height: "100vh",
          overflowy: "scroll",
        }}
      >
        <Grid container justifyContent="space-between">
          <Grid item xs={2}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleThemeChange();
              }}
              sx={{ margin: 2 }}
            >
              {/* {!darkMode ? <DarkMode /> : <LightMode />} */}
              <Avatar
                variant="square"
                alt="brightness"
                src="/assets/icons/brightness.png"
              />
            </IconButton>
          </Grid>
          <Grid
            item
            container
            justifyContent="flex-end"
            alignItems="center"
            // textAlign="center"
            xs={10}
          >
            <img
              src="/android-chrome-192x192.png"
              alt="Admin"
              style={{ height: 100, width: 100, borderRadius: 50 }}
            />
          </Grid>
        </Grid>
        <List>
          {user
            ? LogedInUserLinks.map((item) => (
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
            : LogedOutUserLinks.map((item) => (
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
              ))}
        </List>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-Drawer-category"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Avatar
              variant="square"
              alt="category"
              src="/assets/icons/category.png"
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body1" ml={1} alignSelf="center">
              دسته بندی کالاها
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categories.map((C, i) => (
              <MenuItem
                key={C.id}
                component={Link}
                to="/catalog"
                onClick={(e) => {
                  dispatch(setProductParams({ types: [C.name] }));
                }}
              >
                {C.name}
              </MenuItem>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-Drawer-category"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Avatar
              variant="square"
              alt="brand"
              src="/assets/icons/brand.png"
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body1" ml={1} alignSelf="center">
              برند کالا
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {brands.map((C, i) => (
              <MenuItem
                key={C.id}
                component={Link}
                to="/catalog"
                onClick={(e) => {
                  dispatch(setProductParams({ brands: [C.name] }));
                }}
              >
                {C.name}
              </MenuItem>
            ))}
          </AccordionDetails>
        </Accordion>
        <List>
          {user && user.roles?.includes("Admin")
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
            : UserLinks.map((item) => (
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
              ))}
        </List>
        <Grid container>
          <Grid item container xs={12} justifyContent="flex-end" mr={2}>
            {user ? (
              <Typography
                style={{
                  // direction: "ltr",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {user?.email}
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            {user ? (
              <Button
                variant="outlined"
                onClick={() => {
                  dispatch(signOut());
                  dispatch(clearBasket());
                }}
                sx={{
                  borderColor: theme.palette.secondary.main,
                  ml: 2,
                }}
              >
                خروج
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <ContactSocials />
      </Grid>
    </Box>
  );

  return (
    <Grid container justifyContent="flex-end">
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        sx={{ mr: 2 }}
        onClick={toggleDrawer}
      >
        <Avatar
          variant="square"
          alt="menu"
          src="/assets/icons/menu.png"
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>

      <Drawer
        anchor={"left"}
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          elevation: 0,
          style: {
            borderRadius: "50px 0 0 0",
          },
          className: "hideScrollbar",
        }}
      >
        {list()}
      </Drawer>
    </Grid>
  );
}
