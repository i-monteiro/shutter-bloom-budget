import { useState } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetStatus } from "@/types/budget";

const BudgetsList = () => {
  const { budgets } = useBudgets();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | "all">("all");

  // Filtra pelo termo e status
  const filteredBudgets = budgets.filter((b) => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Orçamentos</h1>
          <p className="text-gray-400 mt-1">
            Gerencie seus orçamentos e acompanhe o status das propostas.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => navigate("/budgets/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por cliente..."
            className="pl-8 bg-gray-900/40 backdrop-blur-sm border-gray-800 text-white placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as BudgetStatus | "all")}
        >
          <SelectTrigger className="w-[180px] bg-gray-900/40 backdrop-blur-sm border-gray-800 text-white">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="sent">Enviado</SelectItem>
            <SelectItem value="accepted">Aceito</SelectItem>
            <SelectItem value="rejected">Recusado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista */}
      {filteredBudgets.length ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((b) => (
            <div
              key={b.id}
              className="border border-gray-800 bg-gray-900/40 backdrop-blur-sm rounded-xl p-1"
            >
              {/* Reaproveita o cartão interno que você já tinha */}
              <BudgetCard budget={b} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {searchTerm || statusFilter !== "all"
              ? "Nenhum orçamento encontrado com os filtros aplicados."
              : "Nenhum orçamento cadastrado. Crie um novo orçamento para começar!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetsList;
