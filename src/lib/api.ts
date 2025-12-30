import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // URL de tu backend Payload
  withCredentials: true, // necesario para cookies de sesión
});

export default api;
