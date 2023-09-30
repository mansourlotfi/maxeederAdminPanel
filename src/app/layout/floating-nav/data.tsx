import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
const data = [
  { id: 1, link: "/", icon: <HomeIcon /> },
  { id: 2, link: "/catalog", icon: <CategoryIcon /> },
  {
    id: 3,
    link: "/contact",
    icon: <ConnectWithoutContactIcon />,
  },
  { id: 4, link: "/basket", icon: <ShoppingCartIcon /> },
];

export const links = [
  { id: 1, link: "/", title: "صفحه نخست" },
  { id: 2, link: "/about", title: "درباره ما" },
  { id: 3, link: "/catalog", title: "محصولات" },
  { id: 4, link: "/basket", title: "سبد خرید" },
  { id: 5, link: "/contact", title: "تماس با ما" },
];

export default data;
