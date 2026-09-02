import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://apna-ashiyana-app.vercel.app/api/v1",
  withCredentials: true, // Crucial for sending JWT cookies across domains
});

export default API;