import axios from "axios";

// Create an instance of Axios for API calls
export const axiosInstance = axios.create();

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the authentication token from local storage
    const authToken = localStorage.getItem("accessToken");

    if (authToken) {
      // If an authentication token exists, add it to the request headers
      config.headers = {
        "x-api-key": authToken, // Set the authentication token
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*", // Allow cross-origin requests
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);
