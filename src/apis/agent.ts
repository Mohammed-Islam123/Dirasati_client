import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { RefreshToken } from "../types/types";

// Helper function to extract response data
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Create axios instance with base URL
const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
// Store pending requests to retry after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

// Process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.config.headers!.Authorization = `Bearer ${token}`;
      request.resolve(agent(request.config));
    }
  });

  failedQueue = [];
};

// Request interceptor for adding tokens, headers etc.
agent.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dirasati_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling responses and errors
agent.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const { data, status } = error.response || {};
    console.log("Let s see");
    // Handle token refresh for 401 errors (but avoid refresh loops)
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest.headers["X-Retry"]
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request to retry later
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      console.log("Requesting new RefreshToken");
      isRefreshing = true;
      originalRequest.headers["X-Retry"] = true;
      console.log(error);
      try {
        await requestNewToken();
        // Update the authorization header with the new token
        const newToken = localStorage.getItem("dirasati_token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process any queued requests
        processQueue(null, newToken);

        // Retry the original request with the new token
        return agent(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        processQueue(refreshError as Error);
        console.log("Nahhh bro");
        localStorage.removeItem("dirasati_token");
        localStorage.removeItem("dirasati_refreshtoken");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other error handling
    switch (status) {
      case 400:
        console.error("Bad request", data);
        break;
      case 401:
        console.error("Unauthorized", data);
        break;
      case 404:
        console.error("Not found", data);
        break;
      case 500:
        console.error("Server error", data);
        break;
      default:
        console.error("Unknown error", data);
    }
    return Promise.reject(error);
  }
);

const requestNewToken = async () => {
  try {
    const responce = await requests.post<RefreshToken>(
      `/api/auth/refresh-token`,
      {
        refreshToken: localStorage.getItem("dirasati_refreshtoken"),
      }
    );
    console.log(responce);
    localStorage.setItem("dirasati_token", responce.accessToken);
    localStorage.setItem("dirasati_refreshtoken", responce.refreshToken);
    return responce;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status == 401) {
      console.log("Nahhh bro");
      localStorage.removeItem("dirasati_token");
      localStorage.removeItem("dirasati_refreshtoken");
      window.location.href = "/login";
    }
    throw error;
  }
};

// Object containing request methods
const requests = {
  get: <T>(url: string, params?: URLSearchParams) =>
    agent.get<T>(url, { params }).then(responseBody),
  post: <T>(url: string, body: object) =>
    agent.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) =>
    agent.put<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: object) =>
    agent.patch<T>(url, body).then(responseBody),
  delete: <T>(url: string) => agent.delete<T>(url).then(responseBody),
  postForm: <T>(url: string, data: FormData) =>
    agent
      .post<T>(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(responseBody),
};

export default requests;
