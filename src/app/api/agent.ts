import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { router } from "../router/Routes";
import { store } from "../store/configureStore";

// const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

// axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

//axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.baseURL = "https://maxeeder-api.darkube.app/api/";

axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    // if (process.env.NODE_ENV === "development") await sleep();
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error("You are not allowed to do that!");
        break;
      case 404:
        toast.error("Not Found!");
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }

    return Promise.reject(error.response);
  }
);

function createFormData(item: any) {
  let formData = new FormData();
  for (const key in item) {
    if (key === "features") {
      item.features.map((f: number) => formData.append(key, f.toString()));
    } else {
      formData.append(key, item[key]);
    }
  }
  return formData;
}

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get("products", params),
  featuredist: () => requests.get("products/GetFeaturedProducts"),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get("products/filters"),
};

const Category = {
  list: () => requests.get("Categories"),
  details: (id: number) => requests.get(`Categories/${id}`),
};

const Brand = {
  list: () => requests.get("Brands"),
  details: (id: number) => requests.get(`Brands/${id}`),
};
const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorised"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  otpRegister: (values: any) => requests.post("Otp/register", values),
  currentUser: () => requests.get("account/currentUser"),
  fetchAddress: () => requests.get("account/savedAddress"),
};

const Orders = {
  list: () => requests.get("orders"),
  fetch: (id: number) => requests.get(`orders/${id}`),
  create: (values: any) => requests.post("orders", values),
};

export interface ICreatePaymentIntent {
  api_key: string;
  order_id: string;
  amount: number;
  callback_uri: string;
  currency?: "IRR" | "IRT";
  customer_phone?: number;
  custom_json_fields?: object;
  payer_name?: string;
  payer_desc?: string;
  auto_verify?: "yes";
  allowed_card?: string;
}

const Admin = {
  //product
  createProduct: (product: any) =>
    requests.postForm("products", createFormData(product)),
  updateProduct: (product: any) =>
    requests.putForm("products", createFormData(product)),
  deleteProduct: (id: number) => requests.delete(`products/${id}`),
  ProductsEditMultipleItems: (values: number[]) =>
    requests.put("Products/UpdateMultipleItems", values),
  ProductsDeleteMultipleItems: (values: number[]) =>
    requests.post("Products/DeleteMultipleItems", values),
  //category
  createCategory: (category: any) =>
    requests.postForm("Categories", createFormData(category)),
  updateCategory: (Category: any) =>
    requests.putForm("Categories", createFormData(Category)),
  deleteCategory: (id: number) => requests.delete(`Categories/${id}`),
  categoriesEditMultipleItems: (values: number[]) =>
    requests.put("Categories/UpdateMultipleItems", values),
  categoriesDeleteMultipleItems: (values: number[]) =>
    requests.post("Categories/DeleteMultipleItems", values),
  //brand
  createBrand: (Brands: any) =>
    requests.postForm("Brands", createFormData(Brands)),
  deleteBrand: (id: number) => requests.delete(`Brands/${id}`),
  BrandsEditMultipleItems: (values: number[]) =>
    requests.put("Brands/UpdateMultipleItems", values),
  BrandsDeleteMultipleItems: (values: number[]) =>
    requests.post("Brands/DeleteMultipleItems", values),
  //broker
  BrokerList: () => requests.get("Brokers"),
  createBroker: (Brokers: any) =>
    requests.postForm("Brokers", createFormData(Brokers)),
  deleteBroker: (id: number) => requests.delete(`Brokers/${id}`),
  brokerDetails: (id: number) => requests.get(`Brokers/${id}`),
  //settings
  getSettingsData: () => requests.get("Settings"),
  postSettingsData: (settings: any) =>
    requests.postForm("Settings", createFormData(settings)),
  //Ceo Optimization
  getCeoOptimizationsData: () => requests.get("CeoOptimization"),
  postCeoOptimizationData: (values: any) =>
    requests.postForm("CeoOptimization", createFormData(values)),
  //Users
  userList: (params: URLSearchParams) =>
    requests.get("Account/GetAllUsers", params),
  deleteUser: (id: number) => requests.delete(`Account/${id}`),
  //CustomUserRoles
  customRoleList: () => requests.get("CustomUserRoles"),
  createCustomRole: (role: any) =>
    requests.postForm("CustomUserRoles", createFormData(role)),
  deleteCustomRole: (id: number) => requests.delete(`CustomUserRoles/${id}`),
  //SocialNetworks
  socialNetworksList: (params: URLSearchParams) =>
    requests.get("SocialNetwork", params),
  createSocialNetwork: (network: any) =>
    requests.postForm("SocialNetwork", createFormData(network)),
  updateSocialNetwork: (SocialNetwork: any) =>
    requests.putForm("SocialNetwork", createFormData(SocialNetwork)),
  deleteSocialNetwork: (id: number) => requests.delete(`SocialNetwork/${id}`),
  SocialNetworkEditMultipleItems: (values: number[]) =>
    requests.put("SocialNetwork/UpdateMultipleItems", values),
  SocialNetworkDeleteMultipleItems: (values: number[]) =>
    requests.post("SocialNetwork/DeleteMultipleItems", values),
  //MainMenu
  MainMenuList: (params: URLSearchParams) => requests.get("MainMenu", params),
  createMainMenu: (network: any) =>
    requests.postForm("MainMenu", createFormData(network)),
  updateMainMenu: (SocialNetwork: any) =>
    requests.putForm("MainMenu", createFormData(SocialNetwork)),
  deleteMainMenu: (id: number) => requests.delete(`MainMenu/${id}`),
  mainMenuEditMultipleItems: (values: number[]) =>
    requests.put("MainMenu/UpdateMultipleItems", values),
  mainMenuDeleteMultipleItems: (values: number[]) =>
    requests.post("MainMenu/DeleteMultipleItems", values),
  //QuickAccessMenu
  quickAccessList: (params: URLSearchParams) =>
    requests.get("QuickAccess", params),
  createQuickAccess: (network: any) =>
    requests.postForm("QuickAccess", createFormData(network)),
  updateQuickAccess: (SocialNetwork: any) =>
    requests.putForm("QuickAccess", createFormData(SocialNetwork)),
  deleteQuickAccess: (id: number) => requests.delete(`QuickAccess/${id}`),
  quickAccessEditMultipleItems: (values: number[]) =>
    requests.put("QuickAccess/UpdateMultipleItems", values),
  quickAccessDeleteMultipleItems: (values: number[]) =>
    requests.post("QuickAccess/DeleteMultipleItems", values),
  //Partners
  partnersList: (params: URLSearchParams) => requests.get("Partners", params),
  createPartner: (partner: any) =>
    requests.postForm("Partners", createFormData(partner)),
  updatePartner: (partner: any) =>
    requests.putForm("Partners", createFormData(partner)),
  deletePartner: (id: number) => requests.delete(`Partners/${id}`),
  partnersEditMultipleItems: (values: number[]) =>
    requests.put("Partners/UpdateMultipleItems", values),
  partnersDeleteMultipleItems: (values: number[]) =>
    requests.post("Partners/DeleteMultipleItems", values),
  //Department
  departmentList: () => requests.get("Departments"),
  createDepartment: (Department: any) =>
    requests.postForm("Departments", createFormData(Department)),
  deleteDepartment: (id: number) => requests.delete(`Departments/${id}`),
  departmentsEditMultipleItems: (values: number[]) =>
    requests.put("Departments/UpdateMultipleItems", values),
  departmentsDeleteMultipleItems: (values: number[]) =>
    requests.post("Departments/DeleteMultipleItems", values),
  //Messages
  messageList: (params: URLSearchParams) => requests.get("Messages", params),
  createMessage: (message: any) =>
    requests.postForm("Messages", createFormData(message)),
  deleteMessage: (id: number) => requests.delete(`Messages/${id}`),
  MessagesEditMultipleItems: (values: number[]) =>
    requests.put("Messages/UpdateMultipleItems", values),
  MessagesDeleteMultipleItems: (values: number[]) =>
    requests.post("Messages/DeleteMultipleItems", values),
  //logos
  logoList: (params: URLSearchParams) => requests.get("Logo", params),
  createLogo: (network: any) =>
    requests.postForm("Logo", createFormData(network)),
  updateLogo: (Logo: any) => requests.putForm("Logo", createFormData(Logo)),
  deleteLogo: (id: number) => requests.delete(`Logo/${id}`),
  logoEditMultipleItems: (values: number[]) =>
    requests.put("Logo/UpdateMultipleItems", values),
  logoDeleteMultipleItems: (values: number[]) =>
    requests.post("Logo/DeleteMultipleItems", values),
  //Artists
  artistList: (params: URLSearchParams) => requests.get("Artists", params),
  createArtist: (artist: any) =>
    requests.postForm("Artists", createFormData(artist)),
  updateArtist: (artist: any) =>
    requests.putForm("Artists", createFormData(artist)),
  deleteArtist: (id: number) => requests.delete(`Artists/${id}`),
  artistsEditMultipleItems: (values: number[]) =>
    requests.put("Artists/UpdateMultipleItems", values),
  artistsDeleteMultipleItems: (values: number[]) =>
    requests.post("Artists/DeleteMultipleItems", values),
  //ُSlides
  slideList: (params: URLSearchParams) => requests.get("Slides", params),
  createSlide: (slide: any) =>
    requests.postForm("Slides", createFormData(slide)),
  updateSlide: (artist: any) =>
    requests.putForm("Slides", createFormData(artist)),
  deleteSlide: (id: number) => requests.delete(`Slides/${id}`),
  slidesEditMultipleItems: (values: number[]) =>
    requests.put("Slides/UpdateMultipleItems", values),
  slidesDeleteMultipleItems: (values: number[]) =>
    requests.post("Slides/DeleteMultipleItems", values),
  //PageItems
  pageItemList: (params: URLSearchParams) => requests.get("PageItems", params),
  createPageItem: (PageItem: any) =>
    requests.postForm("PageItems", createFormData(PageItem)),
  updatePageItem: (artist: any) =>
    requests.putForm("PageItems", createFormData(artist)),
  deletePageItem: (id: number) => requests.delete(`PageItems/${id}`),
  pageItemsEditMultipleItems: (values: number[]) =>
    requests.put("PageItems/UpdateMultipleItems", values),
  pageItemsDeleteMultipleItems: (values: number[]) =>
    requests.post("PageItems/DeleteMultipleItems", values),
  //ProductFeatures
  productFeatureList: () => requests.get("ProductFeatures"),
  createProductFeature: (productFeature: any) =>
    requests.postForm("ProductFeatures", createFormData(productFeature)),
  updateProductFeature: (ProductFeature: any) =>
    requests.putForm("ProductFeatures", createFormData(ProductFeature)),
  deleteProductFeature: (id: number) =>
    requests.delete(`ProductFeatures/${id}`),
  productFeaturesEditMultipleItems: (values: number[]) =>
    requests.put("ProductFeatures/UpdateMultipleItems", values),
  productFeaturesDeleteMultipleItems: (values: number[]) =>
    requests.post("ProductFeatures/DeleteMultipleItems", values),
  //FilesManagment
  MediaList: () => requests.get("FilesManagment"),
  postMedia: (media: any) =>
    requests.postForm("FilesManagment", createFormData(media)),
  deleteMedia: (name: string) => requests.delete(`FilesManagment/${name}`),
  //Articles
  articleList: (params: URLSearchParams) => requests.get("Articles", params),
  createarticle: (article: any) =>
    requests.postForm("Articles", createFormData(article)),
  updatearticle: (artist: any) =>
    requests.putForm("Articles", createFormData(artist)),
  deletearticle: (id: number) => requests.delete(`Articles/${id}`),
  ArticlesEditMultipleItems: (values: number[]) =>
    requests.put("Articles/UpdateMultipleItems", values),
  ArticlesDeleteMultipleItems: (values: number[]) =>
    requests.post("Articles/DeleteMultipleItems", values),
  //Size
  SizeList: () => requests.get("Size"),
  createSize: (Size: any) => requests.postForm("Size", createFormData(Size)),
  deleteSize: (id: number) => requests.delete(`Size/${id}`),
  SizesEditMultipleItems: (values: number[]) =>
    requests.put("Size/UpdateMultipleItems", values),
  SizesDeleteMultipleItems: (values: number[]) =>
    requests.post("Size/DeleteMultipleItems", values),
  //Usage
  UsageList: () => requests.get("Usage"),
  createUsage: (Usage: any) =>
    requests.postForm("Usage", createFormData(Usage)),
  deleteUsage: (id: number) => requests.delete(`Usage/${id}`),
  UsagesEditMultipleItems: (values: number[]) =>
    requests.put("Usage/UpdateMultipleItems", values),
  UsagesDeleteMultipleItems: (values: number[]) =>
    requests.post("Usage/DeleteMultipleItems", values),
};

const agent = {
  Catalog,
  Category,
  Brand,
  TestErrors,
  Basket,
  Account,
  Orders,
  Admin,
};

export default agent;
