// import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
// import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
// import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import ListIcon from "@mui/icons-material/List";
import GroupsIcon from "@mui/icons-material/Groups";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MessageIcon from "@mui/icons-material/Message";
import DiamondIcon from "@mui/icons-material/Diamond";
import AlbumIcon from "@mui/icons-material/Album";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import AppsIcon from "@mui/icons-material/Apps";
import ArticleIcon from "@mui/icons-material/Article";

export const AdminLinks = [
  {
    id: 666,
    title: "محصول",
    icon: <InventoryIcon color="primary" />,
    items: [
      {
        link: "/admin-dashboard/category",
        title: "دسته بندی ها",
      },
      {
        link: "/admin-dashboard/inventory",
        title: "محصولات",
      },
      {
        link: "/admin-dashboard/features",
        title: "ویژگی ها محصول",
      },
      {
        link: "/admin-dashboard/brands",
        title: "برندها",
      },
      {
        link: "/admin-dashboard/size",
        title: "ابعاد",
      },
      {
        link: "/admin-dashboard/usage",
        title: "کاربرد",
      },
    ],
  },
  {
    id: 0,
    link: "/admin-dashboard/articles",
    title: "مقالات",
    icon: <ArticleIcon color="primary" />,
  },
  {
    id: 1,
    link: "/admin-dashboard/socialNetworks",
    title: "شبکه های اجتماعی",
    icon: <ConnectWithoutContactIcon color="primary" />,
  },
  {
    id: 2,
    link: "/admin-dashboard/mainMenu",
    title: "منوی اصلی",
    icon: <ListIcon color="primary" />,
  },
  {
    id: 3,
    link: "/admin-dashboard/logo",
    title: "لوگوها",
    icon: <DiamondIcon color="primary" />,
  },
  {
    id: 4,
    link: "/admin-dashboard/slides",
    title: "اسلایدها",
    icon: <SlideshowIcon color="primary" />,
  },

  {
    id: 6,
    link: "/admin-dashboard/partners",
    title: "نمایندگان",
    icon: <GroupsIcon color="primary" />,
  },
  {
    id: 7,
    link: "/admin-dashboard/artists",
    title: "هنرمندان",
    icon: <AlbumIcon color="primary" />,
  },
  {
    id: 8,
    link: "/admin-dashboard/qickAccessMenu",
    title: "منوی دسترسی سریع",
    icon: <ListIcon color="primary" />,
  },

  {
    id: 10,
    link: "/admin-dashboard/pageItems",
    title: "ایتم های صفحات",
    icon: <ListIcon color="primary" />,
  },
  {
    id: 11,
    link: "/admin-dashboard/departments",
    title: "دپارتمان ها",
    icon: <ApartmentIcon color="primary" />,
  },
  {
    id: 12,
    link: "/admin-dashboard/messages",
    title: "پیام ها",
    icon: <MessageIcon color="primary" />,
  },

  {
    id: 14,
    link: "/admin-dashboard/users",
    title: "همکاران",
    icon: <AccountCircleIcon color="primary" />,
  },

  {
    id: 15,
    link: "/admin-dashboard/fileManager",
    title: "مدیریت فایل ها",
    icon: <AppsIcon color="primary" />,
  },

  // {
  //   id: 15,
  //   link: "/admin-dashboard/customRoles",
  //   title: "نقش ها",
  //   icon: <BeachAccessIcon color="primary" />,
  // },
  {
    id: 16,
    title: "تنظیمات",
    icon: <SettingsIcon color="primary" />,
    items: [
      {
        title: "تنظیمات ",
        link: "/admin-dashboard/settings",
      },
      {
        title: "سئو و بهینه سازی",
        link: "/admin-dashboard/seo",
      },
    ],
  },

  {
    id: 17,
    title: "گزارشات",
    icon: <SummarizeIcon color="primary" />,
    items: [
      {
        title: "چارت",
        link: "/admin-dashboard/reports",
      },
    ],
  },
];
