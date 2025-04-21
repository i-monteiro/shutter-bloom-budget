
import { getToken } from './auth';

const API_URL = 'http://localhost:8000/api';

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
    const requestBody = fetchOptions.body ? 
      typeof fetchOptions.body === 'string' ? JSON.parse(fetchOptions.body) : fetchOptions.body : null;
      
    console.log(`Enviando requisição para ${url}`, { 
      método: fetchOptions.method || 'GET',
      corpo: requestBody
    });
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include'
    });
    
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        // Format error message to include backend details
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(d => {
              if (d.msg && d.loc) {
                return `${d.loc[1]}: ${d.msg}`;
              }
              return d.msg || JSON.stringify(d);
            }).join(', ');
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        }
      } catch (e) {
        console.error('Erro ao processar resposta de erro:', e);
      }
      
      throw new Error(errorMessage);
    }
    
    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
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

export const updateEvent = (id: number, eventData: any) => {
  console.log(`Atualizando evento ${id} com dados:`, eventData);
  return fetchApi(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(eventData)
  });
};

export const deleteEvent = (id: number) => 
  fetchApi(`/events/${id}`, {
    method: 'DELETE'
  });
