import React from 'react';
import { Bell, Menu, Search, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const { userName } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Menu para dispositivos móveis */}
        <Button variant="ghost" size="icon" className="md:hidden text-gray-300 hover:bg-gray-800 hover:text-purple-400">
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* Título da página - visível apenas em dispositivos móveis */}
        <div className="md:hidden">
          <Link to="/app/dashboard" className="text-purple-400 font-bold text-lg flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Fotessence
          </Link>
        </div>
        
        {/* Campo de busca */}
        <div className="hidden md:flex items-center w-96 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 py-2 pr-4 rounded-md border border-gray-700 bg-gray-800/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
            />
          </div>
        </div>
        
        {/* Ações do usuário */}
        <div className="flex items-center space-x-3">
          {/* Notificações */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-300 hover:bg-gray-800 hover:text-purple-400"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </Button>
          
          {/* Perfil do usuário */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 hover:text-purple-400"
            >
              <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-medium">
                {userName?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
              </div>
              <span className="hidden md:inline-block">
                {userName || 'Usuário'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;