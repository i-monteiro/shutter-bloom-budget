
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { userName } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userName={userName || "Fotógrafo"} />
      <main className={cn(
        "transition-all duration-300",
        "lg:ml-64 min-h-screen",
        "p-6 lg:p-8"
      )}>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
