// axios instance for API calls
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7147/api/",
  // You can add headers or interceptors here if needed
});

export default api;
