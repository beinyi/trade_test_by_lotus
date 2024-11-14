import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  validateStatus: (status) => status >= 200 && status <= 302,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(function (config) {
  const token = Cookies.get("jwttoken");
  config.baseURL = "http://localhost:3000/";
  config.headers.Authorization = token ? "Bearer " + token : "";

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Неизвестная ошибка";

    if (error.message === "Network Error") {
      errorMessage = "Ошибка сети. Проверьте подключение к интернету";
    } else if (error.message.includes("timeout")) {
      errorMessage = "Время ожидания запроса истекло";
    } else if (error.response) {
      switch (error.response.status) {
        case 500:
          errorMessage = "Ошибка сервера";
          break;
        case 400:
          errorMessage = "Неверный запрос";
          break;
        case 401:
          errorMessage = "Ошибка авторизации";
          break;
        case 403:
          errorMessage = "Недостаточно прав";
          break;
        case 408:
          errorMessage = "Время ожидания запроса истекло";
          break;
        default:
          errorMessage = error.response.data?.message || "Ошибка запроса";
      }
    }

    return Promise.reject({ ...error, message: errorMessage });
  }
);

export default axiosInstance;
