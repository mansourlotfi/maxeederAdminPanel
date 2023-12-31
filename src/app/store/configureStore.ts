import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";
import { basketSlice } from "../../features/basket/basketSlice";
import { categorySlice } from "../../features/admin/category/categorySlice";
import { brandSlice } from "../../features/admin/brands/brandSlice";
import { brokerSlice } from "../../features/admin/broker/brokerSlice";
import { usersSlice } from "../../features/admin/users/usersSlice";
import { customRolesSlice } from "../../features/admin/customRoles/customRolesSlice";
import { socialNetworkSlice } from "../../features/admin/socialNetworks/socialnetworksSlice";
import { mainMenuSlice } from "../../features/admin/mainMenu/mainMenuSlice";
import { QuickAccessMenulice } from "../../features/admin/quickAccessMenu/quickAccessMenuSlice";
import { PartnersSlice } from "../../features/admin/partners/partnersSlice";
import { departmentsSlice } from "../../features/admin/departments/departmentsSlice";
import { messagesSlice } from "../../features/admin/messages/messagesSlice";
import { logoSlice } from "../../features/admin/logo/logosSlice";
import { artistsSlice } from "../../features/admin/artists/artistsSlice";
import { slidesSlice } from "../../features/admin/slides/slidesSlice";
import { pageItemsSlice } from "../../features/admin/pageItems/pageItemsSlice";
import { productFeaturesSlice } from "../../features/admin/productFeatures/productFeaturesSlice";
import { mediaManagmentsSlice } from "../../features/admin/mediaManagment/mediaSlice";
import { articlesSlice } from "../../features/admin/articles/articlesSlice";
import { sizesSlice } from "../../features/admin/Sizes/sizesSlice";
import { usagesSlice } from "../../features/admin/usage/usageSlice";
import { seoOptItemsSlice } from "../../features/admin/seoOptimization/seoOptSlice";
import { catalogSlice } from "../../features/admin/inventory/catalogSlice";
import { subCategorySlice } from "../../features/admin/subCategory/subCategorySlice";
import { commentsSlice } from "../../features/admin/comments/comentsSlice";

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
    departments: departmentsSlice.reducer,
    messages: messagesSlice.reducer,
    logo: logoSlice.reducer,
    artists: artistsSlice.reducer,
    slides: slidesSlice.reducer,
    pageItems: pageItemsSlice.reducer,
    productFeature: productFeaturesSlice.reducer,
    media: mediaManagmentsSlice.reducer,
    article: articlesSlice.reducer,
    sizes: sizesSlice.reducer,
    usages: usagesSlice.reducer,
    seoOptItems: seoOptItemsSlice.reducer,
    subCategory: subCategorySlice.reducer,
    comments: commentsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
