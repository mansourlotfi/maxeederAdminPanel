import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
export const AdminLinks = [
  {
    id: 1,
    link: "/admin-dashboard/inventory",
    title: "محصولات",
    icon: <InventoryIcon color="primary" />,
  },
  {
    id: 2,
    link: "/admin-dashboard/category",
    title: "دسته بندی ها",
    icon: <CategoryIcon color="primary" />,
  },
  {
    id: 12,
    link: "/admin-dashboard/socialNetworks",
    title: "شبکه های اجتماعی",
    icon: <ConnectWithoutContactIcon color="primary" />,
  },

  {
    id: 3,
    link: "/admin-dashboard/brands",
    title: "برندها",
    icon: <BrandingWatermarkIcon color="primary" />,
  },
  {
    id: 4,
    link: "/admin-dashboard/users",
    title: "همکاران",
    icon: <AccountCircleIcon color="primary" />,
  },
  {
    id: 5,
    link: "/admin-dashboard/customRoles",
    title: "نقش ها",
    icon: <BeachAccessIcon color="primary" />,
  },
  {
    id: 6,
    title: "تنظیمات",
    icon: <SettingsIcon color="primary" />,
    items: [
      {
        title: "تنظیمات ",
        link: "/admin-dashboard/settings",
      },
      {
        title: "سئو و بهینه سازی",
        link: "/admin-dashboard/ceo",
      },
    ],
  },

  {
    id: 7,
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
