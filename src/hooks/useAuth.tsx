
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { login as apiLogin, register as apiRegister } from '@/utils/api';
import { 
  setToken, 
  removeToken, 
  isAuthenticated as checkAuth, 
  getUserName,
  getUserId
} from '@/utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  userId: number | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthentication = () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setUserName(getUserName());
        setUserId(getUserId());
      }
      
      setIsLoading(false);
    };
    
    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiLogin(email, password);
      setToken(response.access_token);
      setIsAuthenticated(true);
      setUserName(getUserName());
      setUserId(getUserId());
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Falha no login. Verifique suas credenciais.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await apiRegister(name, email, password);
      toast.success('Cadastro realizado com sucesso! Faça o login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Falha no cadastro. Verifique se o email já está em uso.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUserName(null);
    setUserId(null);
    toast.info('Você foi desconectado.');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        userId,
        login,
        register,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
