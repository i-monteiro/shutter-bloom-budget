
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  id: number;
  name: string;
  exp: number;
}

// Token storage key
const TOKEN_KEY = 'token';

// Verifica se está em ambiente de produção
const isProduction = import.meta.env.PROD;

// Funções para manipular tokens de forma segura
export const setToken = (token: string) => {
  try {
    // Em ambiente de produção, verificar token antes de armazenar
    if (isProduction) {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded || !decoded.exp || !decoded.id) {
        console.error("Token inválido");
        return false;
      }
    }
    
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error("Erro ao armazenar token:", error);
    return false;
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao recuperar token:", error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error("Erro ao remover token:", error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Adicionar margem de segurança (30s) para evitar problemas com sincronização de relógio
    const isValid = decoded.exp > (currentTime + 30);
    
    // Se o token estiver próximo da expiração, tenta renovar
    if (isValid && (decoded.exp - currentTime) < 300) {  // 5 minutos
      // Disparar refresh token de forma assíncrona
      refreshTokenAsync().catch(console.error);
    }
    
    return isValid;
  } catch (error) {
    console.error("Token inválido:", error);
    removeToken();
    return false;
  }
};

// Função assíncrona para renovar o token sem bloquear a UI
const refreshTokenAsync = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/refresh-token', {
      method: 'POST',
      credentials: 'include',  // Importante para enviar cookies
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token);
    }
  } catch (error) {
    console.error("Erro ao renovar token:", error);
  }
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
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

// Função para calcular tempo restante do token em minutos
export const getTokenExpiryTime = (): number | null => {
  const decoded = getDecodedToken();
  if (!decoded || !decoded.exp) return null;
  
  const currentTime = Date.now() / 1000;
  const timeRemaining = decoded.exp - currentTime;
  
  // Converte segundos para minutos
  return Math.max(0, Math.floor(timeRemaining / 60));
};
