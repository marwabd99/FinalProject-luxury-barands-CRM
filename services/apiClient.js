import axios from "axios";
const BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  } catch (e) {}
  return config;
});

export default apiClient;
