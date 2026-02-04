import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(configs: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL: configs.baseURL || "https://localhost:7190/api", 
      timeout: configs.timeout || 15000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...configs.headers,
      },
    });
    this.initInterceptors();
  }

  private initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
          try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.userid || decoded.nameid || decoded.sub;
            if (userId) {
              config.headers["X-User-Id"] = userId;
            }
          } catch (e) {
            console.warn("Token decode failed");
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("token");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T, any, D>(url, data, config);
    return response.data;
  }

  // ДОДАНО МЕТОД PUT
  public async put<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T, any, D>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

const api = new HttpClient({
  baseURL: "https://localhost:7190/api",
});

export default api;