import tokenAtom from "../src/atoms/tokenAtom";
import axios from "axios";
import { useRecoilValue } from "recoil";


// const BASE_URL = "http://localhost:3500/";
const BASE_URL = "https://fundly-6b3s.vercel.app";


 const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to set the Authorization header in axiosInstance
export const setAuthorizationHeader = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : null;
};

// Example of using the token from Recoil value
export const useAxiosInstance = () => {
  const token = useRecoilValue(tokenAtom);

  // Update Authorization header when token changes
  setAuthorizationHeader(token);

  return axiosInstance;
};