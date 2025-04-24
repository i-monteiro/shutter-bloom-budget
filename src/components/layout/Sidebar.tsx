import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Camera,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          isActive
            ? "bg-purple-600/20 text-purple-400"
            : "text-gray-400 hover:bg-gray-800/40 hover:text-purple-300"
        )}
        onClick={isMobile ? toggleSidebar : undefined}
      >
        <Icon className={cn("h-5 w-5", isActive ? "text-purple-400" : "text-gray-500")} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-800 bg-gray-900/90 backdrop-blur-md transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && "relative z-0 translate-x-0"
        )}
      >
        {/* Cabeçalho do Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <div className="bg-purple-600/20 p-1.5 rounded-md">
              <Camera className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-lg font-semibold text-white">Fotessence</span>
          </Link>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-gray-400 hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Links de navegação */}
        <div className="space-y-1 px-3 py-4">
          <NavItem to="/app/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/app/budgets" icon={FileText} label="Orçamentos" />
          <NavItem to="/app/events" icon={Calendar} label="Eventos" />
          <NavItem to="/app/finances" icon={CreditCard} label="Finanças" />
          <NavItem to="/app/settings" icon={Settings} label="Configurações" />
        </div>
        
        {/* Rodapé do Sidebar */}
        <div className="absolute bottom-0 w-full border-t border-gray-800 bg-gray-900/80 p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-medium">
              {/* Exibir primeira letra do nome do usuário */}
              U
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Conectado como:</span>
              <span className="text-sm font-medium text-white truncate max-w-[150px]">Usuário</span>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Botão toggle para mobile */}
      {isMobile && !isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-30 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default Sidebar;