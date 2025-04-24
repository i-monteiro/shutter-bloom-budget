import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  FileText,
  Calendar,
  Users,
  CreditCard,
} from "lucide-react";

import { useBudgets } from "@/context/BudgetContext";
import { useAuth } from "@/hooks/useAuth";
import { BudgetStatusBadge } from "@/components/ui/budget-status-badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Gráficos
import { MonthlyEvents } from "@/components/dashboard/MonthlyEvents";
import { MonthlyRevenue } from "@/components/dashboard/MonthlyRevenue";

/* ----------------- UI helpers ----------------- */
interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}

const StatsCard = ({ title, value, description, icon: Icon }: StatsCardProps) => (
  <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="bg-gray-800/50 p-2 rounded-full">
          <Icon className="h-4 w-4 text-purple-400" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <span className="text-xs text-gray-400">{description}</span>
    </CardContent>
  </Card>
);

interface ActionButtonProps {
  to: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

const ActionButton = ({ to, icon: Icon, label, description }: ActionButtonProps) => (
  <Link to={to} className="block">
    <div className="flex items-center gap-4 p-4 bg-gray-800/40 border border-gray-800 rounded-lg hover:bg-gray-800/60 transition-colors">
      <div className="bg-purple-600/20 p-3 rounded-full">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium">{label}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400" />
    </div>
  </Link>
);

/* ----------------- Dashboard ----------------- */
const Dashboard = () => {
  const { budgets, isLoading } = useBudgets();
  const { userName } = useAuth();

  // KPIs
  const stats = useMemo(() => {
    const totalBudgets = budgets.length;
    const sentProposals = budgets.filter(b => b.status === "sent").length;
    const acceptedProposals = budgets.filter(b => b.status === "accepted").length;

    const totalRevenue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(
      budgets
        .filter(b => b.status === "accepted")
        .reduce((sum, b) => sum + (b.amount || 0), 0)
    );

    return { totalBudgets, sentProposals, acceptedProposals, totalRevenue };
  }, [budgets]);

  // listas
  const recentBudgets = [...budgets]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  const upcomingEvents = budgets
    .filter(b => b.status === "accepted" && b.eventDate)
    .sort((a, b) => +new Date(a.eventDate) - +new Date(b.eventDate))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Olá, {userName || "Fotógrafo"}
          </h1>
          <p className="text-gray-400 mt-1">Bem-vindo ao seu painel de controle</p>
        </div>
        <Link to="/app/budgets/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Novo orçamento
          </Button>
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Orçamentos"
          value={stats.totalBudgets}
          description="Todos os tempos"
          icon={FileText}
        />
        <StatsCard
          title="Propostas Enviadas"
          value={stats.sentProposals}
          description="Últimos 30 dias"
          icon={Calendar}
        />
        <StatsCard
          title="Sessões Confirmadas"
          value={stats.acceptedProposals}
          description="Este mês"
          icon={Users}
        />
        <StatsCard
          title="Receita Gerada"
          value={stats.totalRevenue}
          description="Total confirmado"
          icon={CreditCard}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyEvents budgets={budgets} />
        <MonthlyRevenue budgets={budgets} />
      </div>

      {/* Ações rápidas */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionButton
            to="/app/budgets/new"
            icon={FileText}
            label="Criar novo orçamento"
            description="Adicione um novo orçamento para seus clientes"
          />
          <ActionButton
            to="/app/events"
            icon={Calendar}
            label="Gerenciar agenda"
            description="Visualize e organize seus eventos"
          />
        </div>
      </div>

      {/* Orçamentos recentes & próximos eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orçamentos recentes */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Orçamentos recentes</CardTitle>
              <Link to="/app/budgets">
                <Button variant="link" className="text-purple-400 p-0">
                  Ver todos
                </Button>
              </Link>
            </div>
            <CardDescription>Últimas alterações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBudgets.map(b => (
                <div
                  key={b.id}
                  className="bg-gray-800/40 rounded-lg p-4 border border-gray-800/60"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{b.clientName}</h3>
                      <p className="text-gray-400 text-sm">
                        {b.eventType} - {new Date(b.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <BudgetStatusBadge status={b.status} />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(b.amount || 0)}
                    </span>
                    <Link to={`/app/budgets/edit/${b.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-purple-400"
                      >
                        Visualizar
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Próximos eventos</CardTitle>
              <Link to="/app/events">
                <Button variant="link" className="text-purple-400 p-0">
                  Ver agenda
                </Button>
              </Link>
            </div>
            <CardDescription>Seus eventos agendados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map(e => {
                const dateObj = new Date(e.eventDate);
                const month = dateObj
                  .toLocaleString("pt-BR", { month: "short" })
                  .toUpperCase();
                const day = dateObj.getDate();
                return (
                  <div
                    key={e.id}
                    className="bg-gray-800/40 rounded-lg p-4 border border-gray-800/60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-700 rounded-lg text-center p-2 w-14">
                        <span className="text-gray-400 text-xs block">{month}</span>
                        <span className="text-xl font-bold text-white">{day}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{e.eventType}</h3>
                        <p className="text-gray-400 text-sm">
                          {e.clientName} -{" "}
                          {dateObj.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="mt-2">
                          <span className="inline-block bg-purple-500/20 text-purple-400 text-xs font-medium px-2 py-1 rounded-full border border-purple-500/20">
                            Confirmado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
