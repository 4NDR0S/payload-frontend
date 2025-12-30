// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://payload-backend-z890.onrender.com/api", // URL del backend Payload
//   withCredentials: true, // necesario para cookies de sesión
// });

// export default api;



// -------------------------

import axios from "axios";

const api = axios.create({
  baseURL: "https://payload-backend-z890.onrender.com/api",
});

// Interceptor para enviar JWT
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("payload-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
