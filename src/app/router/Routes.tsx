import { createBrowserRouter, Navigate } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import BasketPage from "../../features/basket/BasketPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import ContactPage from "../../features/contact/ContactPage";
import Orders from "../../features/orders/Orders";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import AdminDashboard from "../../features/admin/AdminDashboard";
import TestPage from "../../features/about/TestPage";
import AdminCategory from "../../features/admin/category/Category";
import AdminBrands from "../../features/admin/brands/Brands";
import AdminSettings from "../../features/admin/settings/Settings";
import AdminCeoOptimazation from "../../features/admin/seoOptimization/seoOptimization";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // authenticated routes
      {
        element: <RequireAuth />,
        children: [
          { path: "checkout", element: <CheckoutWrapper /> },
          { path: "orders", element: <Orders /> },
        ],
      },
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
                path: "ceo",
                element: <AdminCeoOptimazation />,
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
            ],
          },
          { path: "test", element: <TestPage /> },
        ],
      },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "basket", element: <BasketPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <>profile</> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
