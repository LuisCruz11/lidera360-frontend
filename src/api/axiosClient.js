import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://lidera360-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;