
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

// Map our internal status to API status
const mapStatusToApi = (status: BudgetStatus) => {
  const mapping = {
    pending: "orcamento_recebido",
    sent: "proposta_enviada",
    accepted: "proposta_aceita",
    rejected: "proposta_recusada"
  };
  return mapping[status];
};

// Map API status to our internal status
const mapApiToStatus = (apiStatus: string): BudgetStatus => {
  const mapping: Record<string, BudgetStatus> = {
    orcamento_recebido: "pending",
    proposta_enviada: "sent",
    proposta_aceita: "accepted",
    proposta_recusada: "rejected"
  };
  return mapping[apiStatus] || "pending";
};

// Convert Budget to API format
const budgetToApiFormat = (budget: BudgetFormData, status: BudgetStatus, rejectionReason?: string) => {
  // Create base object with all required fields
  const apiData: Record<string, any> = {
    nomeCliente: budget.clientName,
    tipoEvento: budget.eventType,
    dataOrcamento: budget.budgetDate.toISOString().split('T')[0],
    dataEvento: budget.eventDate.toISOString().split('T')[0],
    status: mapStatusToApi(status)
  };
  
  // Add optional fields based on status
  if (status === 'sent' || status === 'accepted') {
    // For sent and accepted, valorEvento is required
    apiData.valorEvento = budget.amount !== undefined ? Number(budget.amount) : 0;
  }
  
  if (status === 'accepted') {
    // For accepted status, we need payment details
    apiData.iraParcelar = budget.installments || false;
    apiData.quantParcelas = budget.installmentsCount !== undefined ? Number(budget.installmentsCount) : 1;
    
    if (budget.firstPaymentDate) {
      apiData.dataPrimeiroPagamento = budget.firstPaymentDate.toISOString().split('T')[0];
    }
  }
  
  if (budget.phone) {
    apiData.contatoCliente = budget.phone;
  }
  
  // Add rejection reason if status is rejected
  if (status === "rejected" && rejectionReason) {
    apiData.motivoRecusa = rejectionReason;
  }
  
  return apiData;
};

// Convert API data to Budget format
const apiToBudgetFormat = (apiData: any): Budget => {
  return {
    id: apiData.id.toString(),
    clientName: apiData.nomeCliente,
    phone: apiData.contatoCliente || "",
    budgetDate: new Date(apiData.dataOrcamento),
    eventDate: new Date(apiData.dataEvento),
    eventType: apiData.tipoEvento,
    amount: apiData.valorEvento,
    installments: apiData.iraParcelar || false,
    installmentsCount: apiData.quantParcelas || 1,
    firstPaymentDate: apiData.dataPrimeiroPagamento ? new Date(apiData.dataPrimeiroPagamento) : undefined,
    status: mapApiToStatus(apiData.status),
    createdAt: new Date(apiData.created_at || new Date()),
    updatedAt: new Date(apiData.updated_at || new Date())
  };
};

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
      
      // Convert API data to our Budget format
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

  // Load budgets when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
    }
  }, [isAuthenticated]);

  const addBudget = async (budgetData: BudgetFormData) => {
    setIsLoading(true);
    
    try {
      const apiData = budgetToApiFormat(budgetData, "pending");
      const response = await createEvent(apiData);
      
      // Convert API response back to Budget format
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
      
      const apiData = budgetToApiFormat(budgetData, budget.status);
      const response = await updateEvent(parseInt(id), apiData);
      
      // Convert API response back to Budget format
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
      
      // Create a base budget data object from the existing budget
      const updatedBudgetData: BudgetFormData = {
        clientName: budget.clientName,
        phone: budget.phone,
        budgetDate: budget.budgetDate,
        eventDate: budget.eventDate,
        eventType: budget.eventType,
        amount: budget.amount,
        installments: budget.installments,
        installmentsCount: budget.installmentsCount,
        firstPaymentDate: budget.firstPaymentDate
      };
      
      // Update with new form data if provided
      if (data) {
        if (newStatus === 'sent' || newStatus === 'accepted') {
          updatedBudgetData.amount = data.amount !== undefined ? Number(data.amount) : budget.amount;
        }
        
        if (newStatus === 'accepted') {
          updatedBudgetData.installments = data.installments !== undefined ? Boolean(data.installments) : budget.installments;
          updatedBudgetData.installmentsCount = data.installmentsCount !== undefined ? Number(data.installmentsCount) : budget.installmentsCount;
          updatedBudgetData.firstPaymentDate = data.firstPaymentDate || budget.firstPaymentDate;
        }
      }
      
      // Include the rejection reason for rejected status
      const rejectionReason = newStatus === "rejected" ? data?.rejectionReason || "" : undefined;
      
      // Convert to API format
      const apiData = budgetToApiFormat(updatedBudgetData, newStatus, rejectionReason);
      
      console.log('Enviando para API:', apiData);
      
      const response = await updateEvent(parseInt(id), apiData);
      
      // Convert API response back to Budget format
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

  const getBudget = (id: string) => {
    return budgets.find((budget) => budget.id === id);
  };

  const refreshBudgets = async () => {
    await fetchBudgets();
  };

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
