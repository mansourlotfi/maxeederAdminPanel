import { NavLink } from "react-router-dom";
import { IconButton } from "@mui/material";

const Nav = ({ className, item }) => {
  return (
    <li className={className}>
      <IconButton
        component={NavLink}
        to={item.link}
        onClick={() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
      >
        {item.icon}
      </IconButton>
    </li>
  );
};

export default Nav;
