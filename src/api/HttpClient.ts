import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(configs: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      // Використовуємо зміну оточення, або дефолтний URL
      baseURL: import.meta.env.VITE_API_URL || "https://localhost:7190/api", 
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
            // Витягуємо ID користувача (підтримка різних форматів токена)
            const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || 
                           decoded.userid || decoded.nameid || decoded.sub;
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
          // Якщо ми не на сторінці входу, редиректимо
          if (!window.location.pathname.includes("/signin")) {
            window.location.href = "/signin";
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

  public async put<T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T, any, D>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

const api = new HttpClient({});
export default api;