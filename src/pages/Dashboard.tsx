
import { useMemo } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { StatCard } from "@/components/ui/stat-card";
import { MonthlyEvents } from "@/components/dashboard/MonthlyEvents";
import { MonthlyRevenue } from "@/components/dashboard/MonthlyRevenue";
import { Receipt, CalendarDays, Check, X } from "lucide-react";

const Dashboard = () => {
  const { budgets } = useBudgets();

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalBudgets = budgets.length;
    const sentProposals = budgets.filter(budget => budget.status === "sent").length;
    const acceptedProposals = budgets.filter(budget => budget.status === "accepted").length;
    const rejectedProposals = budgets.filter(budget => budget.status === "rejected").length;
    
    // Calculate total revenue from accepted proposals
    const totalRevenue = budgets
      .filter(budget => budget.status === "accepted")
      .reduce((total, budget) => total + budget.amount, 0);
    
    return {
      totalBudgets,
      sentProposals,
      acceptedProposals,
      rejectedProposals,
      totalRevenue: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(totalRevenue)
    };
  }, [budgets]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral dos seus orçamentos e faturamento.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total de Orçamentos" 
          value={stats.totalBudgets} 
          icon={<Receipt className="h-5 w-5" />}
        />
        <StatCard 
          title="Propostas Enviadas" 
          value={stats.sentProposals} 
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard 
          title="Propostas Aceitas" 
          value={stats.acceptedProposals}
          icon={<Check className="h-5 w-5" />}
        />
        <StatCard 
          title="Propostas Recusadas" 
          value={stats.rejectedProposals}
          icon={<X className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <MonthlyEvents budgets={budgets} />
        <MonthlyRevenue budgets={budgets} />
      </div>

      <div className="text-center">
        <div className="inline-block bg-primary-light/20 text-primary px-4 py-2 rounded-lg">
          <p className="text-lg font-semibold">Faturamento Total: {stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
