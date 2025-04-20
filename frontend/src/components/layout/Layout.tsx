
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300",
        "lg:ml-64 min-h-screen",
        "p-6 lg:p-8"
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
