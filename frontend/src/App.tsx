
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage"; // ajuste o caminho se estiver em outra pasta


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BudgetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/budgets" element={<BudgetsList />} />
              <Route path="/budgets/new" element={<CreateBudget />} />
              <Route path="/budgets/edit/:id" element={<EditBudget />} />
              <Route path="/events" element={<Events />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </BudgetProvider>
  </QueryClientProvider>
);

export default App;
