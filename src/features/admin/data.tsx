import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PermDataSettingIcon from "@mui/icons-material/PermDataSetting";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import SummarizeIcon from "@mui/icons-material/Summarize";

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
    id: 3,
    link: "/admin-dashboard/brands",
    title: "برندها",
    icon: <BrandingWatermarkIcon color="primary" />,
  },
  {
    id: 4,
    link: "/admin-dashboard/users",
    title: "کاربران",
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
    link: "/admin-dashboard/settings",
    title: "تنظیمات",
    icon: <SettingsIcon color="primary" />,
  },
  {
    id: 7,
    link: "/admin-dashboard/ceo",
    title: "سئو و بهینه سازی",
    icon: <PermDataSettingIcon color="primary" />,
  },
  {
    id: 7,
    link: "/admin-dashboard/reports",
    title: "گزارشات",
    icon: <SummarizeIcon color="primary" />,
  },
];
