import axios from "axios";

/** Same path the ASP.NET app uses (MapControllers + [Route("api/...")]). */
const DEFAULT_API_BASE = "http://localhost:5000/api";

function resolveApiBaseUrl() {
  const raw = (
    import.meta.env.VITE_API_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    ""
  ).trim();

  if (!raw) {
    return DEFAULT_API_BASE;
  }

  const noTrailingSlash = raw.replace(/\/+$/, "");
  if (noTrailingSlash.endsWith("/api")) {
    return noTrailingSlash;
  }
  return `${noTrailingSlash}/api`;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
