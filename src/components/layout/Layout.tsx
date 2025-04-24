import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './Topbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Função para alternar a visibilidade da sidebar em dispositivos móveis
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Área principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior */}
        <TopBar toggleSidebar={toggleSidebar} />
        
        {/* Conteúdo principal com rolagem */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;