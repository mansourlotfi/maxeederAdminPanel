import Avatar from "@mui/material/Avatar";

export const UserLinks = [
  {
    id: 1,
    link: "/catalog",
    title: "محصولات",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="محصولات"
        src="/assets/icons/products.png"
      />
    ),
  },
  {
    id: 2,
    link: "/basket",
    title: "سبد خرید",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="سبد خرید"
        src="/assets/icons/cart.png"
      />
    ),
  },
  {
    id: 3,
    link: "/about",
    title: "درباره ما",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="درباره ما"
        src="/assets/icons/about.png"
      />
    ),
  },
  {
    id: 4,
    link: "/contact",
    title: "تماس با ما",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="تماس با ما"
        src="/assets/icons/contactUs.png"
      />
    ),
  },
];

export const AdminLinks = [
  {
    id: 1,
    link: "/catalog",
    title: "محصولات",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="محصولات"
        src="/assets/icons/products.png"
      />
    ),
  },
  {
    id: 2,
    link: "/basket",
    title: "سبد خرید",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="سبد خرید"
        src="/assets/icons/cart.png"
      />
    ),
  },
  {
    id: 3,
    link: "/about",
    title: "درباره ما",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="درباره ما"
        src="/assets/icons/about.png"
      />
    ),
  },
  {
    id: 4,
    link: "/contact",
    title: "تماس با ما",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="تماس با ما"
        src="/assets/icons/contactUs.png"
      />
    ),
  },
  {
    id: 5,
    link: "/admin-dashboard",
    title: "پنل ادمین",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="admin"
        src="/assets/icons/admin.png"
      />
    ),
  },
];

export const LogedInUserLinks = [
  {
    id: 1,
    link: "/",
    title: "خانه",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="home"
        src="/assets/icons/home.png"
      />
    ),
  },
  // { id: 2, link: "/profile", title: "پروفایل", icon: <AccountBoxIcon /> },
  {
    id: 3,
    link: "/orders",
    title: "سفارشات",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="سبد خرید"
        src="/assets/icons/cart.png"
      />
    ),
  },
];

export const LogedOutUserLinks = [
  {
    id: 1,
    link: "/",
    title: "خانه",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="خانه"
        src="/assets/icons/home.png"
      />
    ),
  },
  {
    id: 2,
    link: "/login",
    title: "ورود",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="ورود"
        src="/assets/icons/login.png"
      />
    ),
  },
  {
    id: 3,
    link: "/register",
    title: "ثبت نام",
    icon: (
      <Avatar
        variant="square"
        sx={{ width: 24, height: 24 }}
        alt="ثبت نام"
        src="/assets/icons/register.png"
      />
    ),
  },
];
