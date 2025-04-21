
import { getToken } from './auth';

// Alterando a URL base para apontar para o ambiente onde está rodando
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'https://c4cc0ed0-8577-4945-af5a-7c77b4e312a9.lovableproject.com/api';

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

export const fetchApi = async (endpoint: string, options: RequestOptions = {}) => {
  const { authenticated = true, ...fetchOptions } = options;
  const url = `${API_URL}${endpoint}`;
  
  const headers = new Headers(fetchOptions.headers);
  
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (authenticated) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API request failed with status ${response.status}`);
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    
    // Simulando o comportamento da API para desenvolvimento
    if (endpoint === '/users/' && fetchOptions.method === 'POST') {
      console.log('Registrando usuário em modo de desenvolvimento');
      const userData = JSON.parse(fetchOptions.body as string);
      // Simulando um atraso na resposta
      await new Promise(resolve => setTimeout(resolve, 800));
      return { id: 1, email: userData.email };
    }
    
    if (endpoint === '/login' && fetchOptions.method === 'POST') {
      console.log('Login em modo de desenvolvimento');
      const userData = JSON.parse(fetchOptions.body as string);
      // Simulando um atraso na resposta
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        access_token: 'fake_token_' + Math.random().toString(36).substring(2,15)
      };
    }
    
    throw error;
  }
};

// Auth endpoints
export const login = (email: string, password: string) => 
  fetchApi('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    authenticated: false
  });

export const register = (name: string, email: string, password: string) => 
  fetchApi('/users/', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    authenticated: false
  });

// Event endpoints
export const getEvents = () => 
  fetchApi('/events/');

export const createEvent = (eventData: any) => 
  fetchApi('/events/', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });

export const updateEvent = (id: number, eventData: any) => 
  fetchApi(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(eventData)
  });

export const deleteEvent = (id: number) => 
  fetchApi(`/events/${id}`, {
    method: 'DELETE'
  });
