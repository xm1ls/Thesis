import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://thesis-ehnk.onrender.com:3000",
    withCredentials: true,
})