import axios from "axios";

const api = axios.create({
  baseURL: "https://mern-auth-backend-rrkc.onrender.com/api"
});

// Attach access token automatically
api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

api.interceptors.response.use(

  // Success response
  (response) => response,

  // Error response
  async (error) => {

    const originalRequest =
      error.config;

    // Access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry  
    ) {

      originalRequest._retry = true;

      try {

        // Get refresh token
        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        // Request new access token
        const res = await axios.post(
          "https://mern-auth-backend-rrkc.onrender.com/api/auth/refresh-token",
          {
            refreshToken,
          }
        );

        // Store new access token
        localStorage.setItem(
          "token",
          res.data.accessToken
        );

        // Update failed request
        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {

        console.log(
          "Refresh token expired"
        );

        localStorage.clear();

        window.location.href = "/login";

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);
export default api;