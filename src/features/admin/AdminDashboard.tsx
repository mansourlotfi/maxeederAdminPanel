import React from "react";
import {
  Paper,
  Grid,
  Container,
  ListItemText,
  ListItemIcon,
  List,
  ListItem,
  ListItemButton,
  Collapse,
} from "@mui/material";
import Header from "../../app/layout/Header";
import { useAppSelector } from "../../app/store/configureStore";
import { NavLink, Outlet } from "react-router-dom";
import { AdminLinks } from "./data";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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

const SingleLevel = ({ item }: any) => {
  return (
    <ListItem
      to={item?.link ? item.link : ""}
      key={item.id}
      disablePadding
      component={NavLink}
      sx={navStyles}
    >
      <ListItemButton>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemButton>
    </ListItem>
  );
};

const MultiLevel = ({ item }: any) => {
  const { items: children } = item;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child: any, key: any) => (
            <DynamicMenuItem key={key} item={child} />
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export function hasChildren(item: any) {
  const { items: children } = item;

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
}

const DynamicMenuItem = ({ item }: any) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} />;
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
      <Grid container item flexWrap="nowrap">
        <Grid item container width={250}>
          <Paper
            sx={{
              width: 250,
              maxWidth: "100%",
              minHeight: "calc(100vh - 48px)",
              backgroundColor: "warning.light",
            }}
          >
            <List
              sx={{
                maxHeight: "calc(100vh - 48px)",
                overflowY: "auto",
              }}
            >
              {user
                ? AdminLinks.map((item, key): any => (
                    <DynamicMenuItem key={key} item={item} />
                  ))
                : null}
            </List>
          </Paper>
        </Grid>
        <Grid item container xs sx={{ maxWidth: "100%", overflowY: "auto" }}>
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;
