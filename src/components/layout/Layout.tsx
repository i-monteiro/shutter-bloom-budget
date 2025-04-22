
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

const Layout = () => {
  const { userName } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar userName={userName || 'Usuário'} />
      
      <main className="flex-1 p-6 lg:ml-64 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
