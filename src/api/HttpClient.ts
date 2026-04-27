import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(configs: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
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
    // Інтерцептор запитів: просто додаємо токен
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Інтерцептор відповідей: обробка помилок
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError) {
          // 1. Обробка 401 (Сесія завершилася)
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            if (!window.location.pathname.includes("/signin")) {
              window.location.href = "/signin";
            }
          }

          // 2. Error Mapping: витягуємо повідомлення від вашого ChatErrorHandler
          // Бекенд повертає: { Message: "Текст помилки" }
          const backendMessage = error.response?.data?.Message || error.response?.data?.message;
          
          if (backendMessage) {
            // Замінюємо стандартне "Request failed" на текст із сервера
            error.message = backendMessage;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Методи залишаються без змін, вони у вас працюють добре
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
