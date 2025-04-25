import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Settings, 
  Camera,
  Users,
  BarChart4,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
    { title: 'Orçamentos', icon: FileText, path: '/app/budgets' },
    { title: 'Agenda', icon: Calendar, path: '/app/events' },
    // { title: 'Clientes', icon: Users, path: '/app/clients' },
    // { title: 'Relatórios', icon: BarChart4, path: '/app/reports' },
    // { title: 'Mensagens', icon: MessageSquare, path: '/app/messages' },
    // { title: 'Suporte', icon: HelpCircle, path: '/app/support' },
    { title: 'Configurações', icon: Settings, path: '/app/settings' },
  ];
  
  return (
    <>
      {/* Overlay para dispositivos móveis - fechar ao clicar fora da sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-full bg-gray-900/95 backdrop-blur border-r border-gray-800 
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Botão de fechar para dispositivos móveis */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <div className="bg-purple-600/20 p-2 rounded-full">
            <Camera className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Fotessence</h2>
            <p className="text-xs text-gray-400">Gerenciamento profissional</p>
          </div>
        </div>
        
        {/* Menu de navegação */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-gray-800/70 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;