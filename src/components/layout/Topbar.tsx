import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  toggleSidebar?: () => void;
  userName?: string | null;
}

const TopBar = ({ toggleSidebar, userName }: TopBarProps) => {
  const navigate = useNavigate();
  const { userName: authUserName, logout } = useAuth();
  
  // Use o nome de usuário passado como prop ou pegue do contexto de autenticação
  const displayName = userName || authUserName || 'Usuário';
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-800 py-4 px-4 md:px-6">
      <div className="flex items-center justify-between">
        {/* Botão do menu (visível apenas em dispositivos móveis) */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        
        {/* Área de busca */}
        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        {/* Área direita - notificações e perfil */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Perfil do usuário */}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
              <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden md:inline-block text-sm font-medium">{displayName}</span>
              <ChevronDown size={16} className="hidden md:block" />
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
              <a 
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => navigate('/app/settings')}
              >
                Meu perfil
              </a>
              <a
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;