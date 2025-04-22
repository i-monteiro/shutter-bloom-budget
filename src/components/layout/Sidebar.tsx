
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  CalendarDays, 
  Home, 
  Menu, 
  Receipt, 
  Settings, 
  X,
  LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  userName: string;
}

const Sidebar = ({ userName }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Home, text: "Dashboard", path: "/" },
    { icon: Receipt, text: "Orçamentos", path: "/budgets" },
    { icon: CalendarDays, text: "Eventos", path: "/events" },
    { icon: Settings, text: "Configurações", path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="fixed z-50 top-4 left-4 p-2 rounded-full bg-white shadow-md lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out bg-white shadow-lg",
          "lg:translate-x-0 lg:w-64",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-primary">Fotessence</h1>
            <p className="text-sm text-gray-500">Gestão de Orçamentos</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center w-full px-4 py-3 rounded-lg transition-colors",
                  "hover:bg-primary-light/20",
                  location.pathname === item.path 
                    ? "bg-primary text-white" 
                    : "text-gray-700"
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-3")} />
                <span>{item.text}</span>
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{userName}</p>
              <button 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              © 2025 ShutterBloom
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
