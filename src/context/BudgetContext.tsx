'use client';

import { prepareEventPayload } from "@/utils/prepareEventPayload";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Budget, BudgetFormData, BudgetStatus } from "@/types/budget";
import { toast } from "sonner";
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchBudgets = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      const formattedBudgets = data.map(apiToBudgetFormat);
      setBudgets(formattedBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setError("Falha ao carregar orçamentos");
      toast.error("Falha ao carregar orçamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
    }
  }, [isAuthenticated]);

  const addBudget = async (budgetData: BudgetFormData) => {
    setIsLoading(true);
    try {
      const apiData = prepareEventPayload("pending", budgetData);
      const response = await createEvent(apiData);
      const newBudget = apiToBudgetFormat(response);
      setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
      toast.success("Orçamento criado com sucesso!");
    } catch (error) {
      console.error("Error adding budget:", error);
      toast.error("Falha ao criar orçamento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBudget = async (id: string, budgetData: BudgetFormData) => {
    setIsLoading(true);
    try {
      const budget = budgets.find(b => b.id === id);
      if (!budget) throw new Error("Orçamento não encontrado");
      const apiData = prepareEventPayload(budget.status, budgetData);
      const response = await updateEvent(parseInt(id), apiData);
      const updatedBudget = apiToBudgetFormat(response);
      setBudgets((prevBudgets) => 
        prevBudgets.map((budget) => 
          budget.id === id ? updatedBudget : budget
        )
      );
      toast.success("Orçamento atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Falha ao atualizar orçamento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBudget = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteEvent(parseInt(id));
      setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== id));
      toast.success("Orçamento excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Falha ao excluir orçamento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: BudgetStatus, data?: any) => {
    setIsLoading(true);
    try {
      const budget = budgets.find(b => b.id === id);
      if (!budget) throw new Error("Orçamento não encontrado");

      const updatedBudgetData: BudgetFormData = {
        clientName: data?.clientName ?? budget.clientName,
        phone: data?.phone ?? budget.phone,
        budgetDate: budget.budgetDate,
        eventDate: budget.eventDate,
        eventType: budget.eventType,
        amount: data?.amount ?? budget.amount ?? 0,
        installments: data?.installments ?? budget.installments ?? false,
        installmentsCount: data?.installmentsCount ?? budget.installmentsCount ?? 1,
        firstPaymentDate: data?.firstPaymentDate ?? budget.firstPaymentDate ?? new Date(),
      };

      const apiData = prepareEventPayload(newStatus, {
        ...updatedBudgetData,
        rejectionReason: data?.rejectionReason
      });

      console.log("Enviando para API:", apiData);

      const response = await updateEvent(parseInt(id), apiData);
      const updatedBudget = apiToBudgetFormat(response);
      setBudgets((prevBudgets) => 
        prevBudgets.map((budget) => 
          budget.id === id ? updatedBudget : budget
        )
      );

      const statusMessages = {
        pending: "Orçamento definido como pendente",
        sent: "Proposta marcada como enviada",
        accepted: "Proposta aceita pelo cliente!",
        rejected: "Proposta recusada pelo cliente"
      };

      toast.success(statusMessages[newStatus]);
    } catch (error) {
      console.error("Error updating budget status:", error);
      toast.error("Falha ao atualizar status do orçamento");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getBudget = (id: string) => budgets.find((budget) => budget.id === id);

  const refreshBudgets = async () => await fetchBudgets();

  return (
    <BudgetContext.Provider value={{ 
      budgets, 
      isLoading,
      error,
      addBudget, 
      updateBudget, 
      deleteBudget,
      updateStatus,
      getBudget,
      refreshBudgets
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

function apiToBudgetFormat(apiData: any): Budget {
  const parseDateWithTimezone = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    // Garante que a data seja interpretada como UTC para evitar problemas de fuso horário
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // Cria uma data usando UTC para garantir que o dia não seja alterado
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Os meses em JS são 0-indexed
      const day = parseInt(parts[2], 10);
      return new Date(Date.UTC(year, month, day));
    }
    
    return new Date(dateString);
  };

  return {
    id: apiData.id.toString(),
    clientName: apiData.nomeCliente,
    phone: apiData.contatoCliente || "",
    budgetDate: parseDateWithTimezone(apiData.dataOrcamento),
    eventDate: parseDateWithTimezone(apiData.dataEvento),
    eventType: apiData.tipoEvento,
    amount: apiData.valorEvento,
    installments: apiData.iraParcelar || false,
    installmentsCount: apiData.quantParcelas || 1,
    firstPaymentDate: apiData.dataPrimeiroPagamento ? parseDateWithTimezone(apiData.dataPrimeiroPagamento) : undefined,
    status: mapApiToStatus(apiData.status),
    createdAt: new Date(apiData.created_at || new Date()),
    updatedAt: new Date(apiData.updated_at || new Date())
  };
}

function mapApiToStatus(apiStatus: string): BudgetStatus {
  const mapping: Record<string, BudgetStatus> = {
    orcamento_recebido: "pending",
    proposta_enviada: "sent",
    proposta_aceita: "accepted",
    proposta_recusada: "rejected"
  };
  return mapping[apiStatus] || "pending";
}

interface BudgetContextType {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  addBudget: (budgetData: BudgetFormData) => Promise<void>;
  updateBudget: (id: string, budgetData: BudgetFormData) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  updateStatus: (id: string, newStatus: BudgetStatus, data?: any) => Promise<void>;
  getBudget: (id: string) => Budget | undefined;
  refreshBudgets: () => Promise<void>;
}
