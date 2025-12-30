import axios from "axios";

const api = axios.create({
  baseURL: "https://payload-backend-z890.onrender.com/api", // URL de tu backend Payload
  withCredentials: true, // necesario para cookies de sesión
});

export default api;
