
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  id: number;
  name: string;
  exp: number;
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    removeToken();
    return false;
  }
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded?.id;
};

export const getUserName = () => {
  const decoded = getDecodedToken();
  return decoded?.name;
};
