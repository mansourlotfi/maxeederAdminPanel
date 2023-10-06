import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";
import { router } from "../router/Routes";
import { store } from "../store/configureStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

// axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

axios.defaults.baseURL = "http://localhost:5000/api/";

axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep();
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
  //category
  createCategory: (category: any) =>
    requests.postForm("Categories", createFormData(category)),
  updateCategory: (Category: any) =>
    requests.putForm("Categories", createFormData(Category)),
  deleteCategory: (id: number) => requests.delete(`Categories/${id}`),
  //brand
  createBrand: (Brands: any) =>
    requests.postForm("Brands", createFormData(Brands)),
  deleteBrand: (id: number) => requests.delete(`Brands/${id}`),
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
  //MainMenu
  MainMenuList: (params: URLSearchParams) => requests.get("MainMenu", params),
  createMainMenu: (network: any) =>
    requests.postForm("MainMenu", createFormData(network)),
  updateMainMenu: (SocialNetwork: any) =>
    requests.putForm("MainMenu", createFormData(SocialNetwork)),
  deleteMainMenu: (id: number) => requests.delete(`MainMenu/${id}`),
  //QuickAccessMenu
  quickAccessList: (params: URLSearchParams) =>
    requests.get("QuickAccess", params),
  createQuickAccess: (network: any) =>
    requests.postForm("QuickAccess", createFormData(network)),
  updateQuickAccess: (SocialNetwork: any) =>
    requests.putForm("QuickAccess", createFormData(SocialNetwork)),
  deleteQuickAccess: (id: number) => requests.delete(`QuickAccess/${id}`),
  //Partners
  partnersList: (params: URLSearchParams) => requests.get("Partners", params),
  createPartner: (partner: any) =>
    requests.postForm("Partners", createFormData(partner)),
  updatePartner: (partner: any) =>
    requests.putForm("Partners", createFormData(partner)),
  deletePartner: (id: number) => requests.delete(`Partners/${id}`),
  //Department
  departmentList: () => requests.get("Departments"),
  createDepartment: (Department: any) =>
    requests.postForm("Departments", createFormData(Department)),
  deleteDepartment: (id: number) => requests.delete(`Departments/${id}`),
  //Messages
  messageList: (params: URLSearchParams) => requests.get("Messages", params),
  createMessage: (message: any) =>
    requests.postForm("Messages", createFormData(message)),
  deleteMessage: (id: number) => requests.delete(`Messages/${id}`),
  //logos
  logoList: (params: URLSearchParams) => requests.get("Logo", params),
  createLogo: (network: any) =>
    requests.postForm("Logo", createFormData(network)),
  updateLogo: (Logo: any) => requests.putForm("Logo", createFormData(Logo)),
  deleteLogo: (id: number) => requests.delete(`Logo/${id}`),
  //Artists
  artistList: (params: URLSearchParams) => requests.get("Artists", params),
  createArtist: (artist: any) =>
    requests.postForm("Artists", createFormData(artist)),
  updateArtist: (artist: any) =>
    requests.putForm("Artists", createFormData(artist)),
  deleteArtist: (id: number) => requests.delete(`Artists/${id}`),
  //ُSlides
  slideList: (params: URLSearchParams) => requests.get("Slides", params),
  createSlide: (slide: any) =>
    requests.postForm("Slides", createFormData(slide)),
  updateSlide: (artist: any) =>
    requests.putForm("Slides", createFormData(artist)),
  deleteSlide: (id: number) => requests.delete(`Slides/${id}`),
  //PageItems
  pageItemList: (params: URLSearchParams) => requests.get("PageItems", params),
  createPageItem: (PageItem: any) =>
    requests.postForm("PageItems", createFormData(PageItem)),
  updatePageItem: (artist: any) =>
    requests.putForm("PageItems", createFormData(artist)),
  deletePageItem: (id: number) => requests.delete(`PageItems/${id}`),
  //ProductFeatures
  productFeatureList: () => requests.get("ProductFeatures"),
  createProductFeature: (productFeature: any) =>
    requests.postForm("ProductFeatures", createFormData(productFeature)),
  updateProductFeature: (ProductFeature: any) =>
    requests.putForm("ProductFeatures", createFormData(ProductFeature)),
  deleteProductFeature: (id: number) =>
    requests.delete(`ProductFeatures/${id}`),
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
