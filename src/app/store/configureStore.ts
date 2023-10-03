import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { categorySlice } from "../../features/admin/category/categorySlice";
import { brandSlice } from "../../features/admin/brands/brandSlice";
import { brokerSlice } from "../../features/admin/broker/brokerSlice";
import { usersSlice } from "../../features/admin/users/usersSlice";
import { customRolesSlice } from "../../features/admin/customRoles/customRolesSlice";
import { socialNetworkSlice } from "../../features/admin/socialNetworks/socialnetworksSlice";
import { mainMenuSlice } from "../../features/admin/mainMenu/mainMenuSlice";
import { QuickAccessMenulice } from "../../features/admin/quickAccessMenu/quickAccessMenuSlice";
import { PartnersSlice } from "../../features/admin/partners/partnersSlice";

export const store = configureStore({
  reducer: {
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer,
    account: accountSlice.reducer,
    category: categorySlice.reducer,
    brands: brandSlice.reducer,
    brokers: brokerSlice.reducer,
    users: usersSlice.reducer,
    customRoles: customRolesSlice.reducer,
    socialNetworks: socialNetworkSlice.reducer,
    mainMenu: mainMenuSlice.reducer,
    quickAccess: QuickAccessMenulice.reducer,
    partners: PartnersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
