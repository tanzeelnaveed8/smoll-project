import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "http://localhost:3000";

const mainInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: `${BASE_URL}`,
});

export default mainInstance;

// Add interceptors for request/response if needed
mainInstance.interceptors.request.use(
  (config) => {
    // Add authorization headers or any custom config
    // const token = await getToken();
    const token = "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function getApi(routeGroup = "") {
  return <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    let { url, ...restConfig } = config;
    let updatedUrl = url;
    if (routeGroup) {
      updatedUrl = `/${routeGroup}/${url}`.replaceAll("//", "/");
    }
    return mainInstance({
      url: updatedUrl,
      ...restConfig,
    });
  };
}
