import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Request will timeout if it takes more than 10 seconds
  headers: {
    "Content-Type": "application/json", // Data sent will be in JSON format.
    Accept: "application/json", /// Expect responses in JSON format.
  },
});

// Interceptors are functions that run automatically before a request is sent or after a response is received in Axios.
// They allow you to modify requests and responses globally without changing every API call in your app.
///request Interceptor
///Before each request, this interceptor runs automatically. the request interceptor runs before the request is sent to the server
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//This runs after each response
// A response interceptor runs after the server responds to your request. It allows you to handle responses (like errors, authentication issues, or formatting responses) before they reach your code.

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === "401") {
        window.location.href = "/login";
      } else if (error.response.status === "500") {
        console.error("Server erro. Please try again later");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout. Please  try again");
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
