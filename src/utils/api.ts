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
