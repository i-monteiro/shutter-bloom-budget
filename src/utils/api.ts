import { getToken, isAuthenticated } from './auth';
import type { InsertLead } from '@/shared/schema';

export const API_URL = 'https://api-backend.fumwn4.easypanel.host/api';


interface RequestOptions extends RequestInit {
  authenticated?: boolean;
  retry?: boolean;
}

/**
 * Função de utilidade para fazer requisições à API com tratamento de erros
 * e autenticação automática
 */
export const fetchApi = async (endpoint: string, options: RequestOptions = {}) => {
  const { authenticated = true, retry = true, ...fetchOptions } = options;
  const url = `${API_URL}${endpoint}`;
  
  const headers = new Headers(fetchOptions.headers);
  
  // Configurar Content-Type automaticamente
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Adicionar X-Requested-With para prevenir CSRF
  headers.set('X-Requested-With', 'XMLHttpRequest');
  
  // Adicionar token de autenticação se necessário
  if (authenticated) {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }
    
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  try {
    // Sanitizar logs para não exibir dados sensíveis
    let requestBodyForLog = null;
    if (fetchOptions.body) {
      if (typeof fetchOptions.body === 'string') {
        try {
          const parsedBody = JSON.parse(fetchOptions.body);
          // Remover campos sensíveis
          const sanitizedBody = { ...parsedBody };
          if (sanitizedBody.password) sanitizedBody.password = '***';
          if (sanitizedBody.token) sanitizedBody.token = '***';
          requestBodyForLog = sanitizedBody;
        } catch (e) {
          requestBodyForLog = '[Corpo não JSON]';
        }
      } else if (fetchOptions.body instanceof FormData) {
        requestBodyForLog = '[FormData]';
      } else {
        requestBodyForLog = '[Objeto não serializado]';
      }
    }
    
    console.log(`Enviando requisição para ${url}`, { 
      método: fetchOptions.method || 'GET',
      corpo: requestBodyForLog
    });
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include',  // Importante para cookies de refresh token
      mode: 'cors'  // Garantir que o modo CORS esteja ativado
    });
    
    // Se o token expirou (401) e não estamos em uma requisição de retry
    if (response.status === 401 && retry && authenticated) {
      try {
        // Tentar obter um novo token
        const refreshed = await refreshTokenAsync();
        if (refreshed) {
          // Tentar novamente com o novo token
          return fetchApi(endpoint, { ...options, retry: false });
        }
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }
    
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

// Função de refresh token para renovação automática que está realmente exportada
export const refreshTokenAsync = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        import('./auth').then(auth => {
          auth.setToken(data.access_token);
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    return false;
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

export const logout = () => 
  fetchApi('/logout', {
    method: 'POST'
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
  // Não fazer log dos dados sensíveis do evento
  console.log(`Atualizando evento ${id}`);
  return fetchApi(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(eventData)
  });
};

export const deleteEvent = (id: number) => 
  fetchApi(`/events/${id}`, {
    method: 'DELETE'
  });


/** o backend devolve { status: 'queued', lead_id: number } */
export interface LeadResponse {
  status: string;
  lead_id: number;
}

export const createLead = async (data: InsertLead) => {
  return fetch(`${API_URL}/leads/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Erro ao enviar os dados');
    }
    return res.json();
  });
};