import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import AdminDashboard from "../../features/admin/AdminDashboard";
import AdminCategory from "../../features/admin/category/Category";
import AdminBrands from "../../features/admin/brands/Brands";
import AdminSettings from "../../features/admin/settings/Settings";
import AdminSeoOptimazation from "../../features/admin/seoOptimization/seoOptimization";
import AdminUserList from "../../features/admin/users/Users";
import AdminCustomRoles from "../../features/admin/customRoles/CustomRoles";
import AdminReports from "../../features/admin/reports/Reports";
import AdminSocialNetworks from "../../features/admin/socialNetworks/SocialNetworks";
import AdminMainMenu from "../../features/admin/mainMenu/MainMenu";
import AdminQuickAccessMenu from "../../features/admin/quickAccessMenu/QuickAccessMenu";
import AdminPartners from "../../features/admin/partners/Partners";
import AdminMessages from "../../features/admin/messages/Messages";
import AdminLogos from "../../features/admin/logo/Logos";
import AdminArtists from "../../features/admin/artists/Artists";
import AdminSlides from "../../features/admin/slides/Slides";
import AdminPageItems from "../../features/admin/pageItems/PageItems";
import AdminProductFeatures from "../../features/admin/productFeatures/ProductFeatures";
import AdminInventory from "../../features/admin/inventory/Inventory";
import AdminFileManager from "../../features/admin/mediaManagment/MediaManagment";
import AdminDepartments from "../../features/admin/departments/Departments";
import AdminArticlesPage from "../../features/admin/articles/Articles";
import AdminSizes from "../../features/admin/Sizes/Sizes";
import AdminUsagePage from "../../features/admin/usage/Usage";
import AdminSubCategory from "../../features/admin/subCategory/SubCategory";
import AdminComments from "../../features/admin/comments/Comments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // authenticated routes
      // admin routes
      {
        element: <RequireAuth roles={["Admin"]} />,
        children: [
          {
            path: "admin-dashboard",
            element: <AdminDashboard />,
            children: [
              {
                path: "inventory",
                element: <AdminInventory />,
              },
              {
                path: "category",
                element: <AdminCategory />,
              },
              {
                path: "brands",
                element: <AdminBrands />,
              },
              {
                path: "users",
                element: <AdminUserList />,
              },
              {
                path: "settings",
                element: <AdminSettings />,
              },
              {
                path: "seo",
                element: <AdminSeoOptimazation />,
              },
              {
                path: "customRoles",
                element: <AdminCustomRoles />,
              },
              {
                path: "reports",
                element: <AdminReports />,
              },
              {
                path: "socialNetworks",
                element: <AdminSocialNetworks />,
              },
              {
                path: "mainMenu",
                element: <AdminMainMenu />,
              },
              {
                path: "qickAccessMenu",
                element: <AdminQuickAccessMenu />,
              },
              {
                path: "partners",
                element: <AdminPartners />,
              },
              {
                path: "departments",
                element: <AdminDepartments />,
              },
              {
                path: "messages",
                element: <AdminMessages />,
              },
              {
                path: "logo",
                element: <AdminLogos />,
              },
              {
                path: "artists",
                element: <AdminArtists />,
              },
              {
                path: "slides",
                element: <AdminSlides />,
              },
              {
                path: "pageItems",
                element: <AdminPageItems />,
              },
              {
                path: "features",
                element: <AdminProductFeatures />,
              },
              {
                path: "fileManager",
                element: <AdminFileManager />,
              },
              {
                path: "articles",
                element: <AdminArticlesPage />,
              },
              {
                path: "size",
                element: <AdminSizes />,
              },
              {
                path: "usage",
                element: <AdminUsagePage />,
              },
              {
                path: "subCategory",
                element: <AdminSubCategory />,
              },
              {
                path: "comments",
                element: <AdminComments />,
              },
            ],
          },
        ],
      },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
