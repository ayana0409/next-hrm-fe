import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(async (config) => {
//   const { data: session } = useSession();
//   const token = session?.access_token || "";
//   config.headers.Authorization = token ? `Bearer ${token}` : "";
//   return config;
// });

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);
import { useSession } from "next-auth/react";

export default api;
