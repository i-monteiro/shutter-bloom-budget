import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/layout/Layout";
import { BudgetProvider } from "./context/BudgetContext";

// Pages
import Dashboard from "./pages/Dashboard";
import BudgetsList from "./pages/BudgetsList";
import CreateBudget from "./pages/CreateBudget";
import EditBudget from "./pages/EditBudget";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/auth/PrivateRoute";

// Componente de redirecionamento para rotas com parâmetros
const RedirectWithParams = () => {
  const location = useLocation();
  const newPath = location.pathname.replace(/^\//, '/app/');
  return <Navigate to={newPath} replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <BudgetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Página inicial - Landing page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Rotas de autenticação */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rotas da aplicação com o novo prefixo */}
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/app/dashboard" element={<Dashboard />} />
                <Route path="/app/budgets" element={<BudgetsList />} />
                <Route path="/app/budgets/new" element={<CreateBudget />} />
                <Route path="/app/budgets/edit/:id" element={<EditBudget />} />
                <Route path="/app/events" element={<Events />} />
                <Route path="/app/settings" element={<Settings />} />
                <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
              </Route>
              
              {/* Redirecionamentos das rotas antigas para as novas rotas com prefixo */}
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/budgets" element={<Navigate to="/app/budgets" replace />} />
              <Route path="/budgets/new" element={<Navigate to="/app/budgets/new" replace />} />
              <Route path="/budgets/edit/:id" element={<RedirectWithParams />} />
              <Route path="/events" element={<Navigate to="/app/events" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
              
              {/* Página 404 para rotas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BudgetProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;