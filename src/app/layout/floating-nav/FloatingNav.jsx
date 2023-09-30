import data from "./data";
import Nav from "./Nav";
import { useLocation } from "react-router-dom";
import "./floating-nav.css";

const FloatingNav = () => {
  const location = useLocation();

  return (
    <ul id="floating__nav">
      <div className="scrollspy">
        {data.map((item) => (
          <Nav
            key={item.id}
            className={location.pathname === item.link ? "active" : null}
            item={item}
          />
        ))}
      </div>
    </ul>
  );
};

export default FloatingNav;
