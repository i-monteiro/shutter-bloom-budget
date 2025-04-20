import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Budget, BudgetFormData, BudgetStatus } from "@/types/budget";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface BudgetContextType {
  budgets: Budget[];
  addBudget: (budgetData: BudgetFormData) => void;
  updateBudget: (id: string, budgetData: BudgetFormData) => void;
  deleteBudget: (id: string) => void;
  updateStatus: (id: string, newStatus: BudgetStatus) => void;
  getBudget: (id: string) => Budget | undefined;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
};

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem("budgets");
    if (savedBudgets) {
      try {
        // Parse and convert string dates to Date objects
        return JSON.parse(savedBudgets, (key, value) => {
          const dateKeys = ["budgetDate", "eventDate", "firstPaymentDate", "createdAt", "updatedAt"];
          if (dateKeys.includes(key) && value) {
            return new Date(value);
          }
          return value;
        });
      } catch (error) {
        console.error("Error parsing budgets from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addBudget = (budgetData: BudgetFormData) => {
    const now = new Date();
    const newBudget: Budget = {
      id: uuidv4(),
      ...budgetData,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    toast.success("Orçamento criado com sucesso!");
  };

  const updateBudget = (id: string, budgetData: BudgetFormData) => {
    setBudgets((prevBudgets) => 
      prevBudgets.map((budget) => 
        budget.id === id 
          ? { ...budget, ...budgetData, updatedAt: new Date() }
          : budget
      )
    );
    toast.success("Orçamento atualizado com sucesso!");
  };

  const deleteBudget = (id: string) => {
    setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== id));
    toast.success("Orçamento excluído com sucesso!");
  };

  const updateStatus = (id: string, newStatus: BudgetStatus) => {
    setBudgets((prevBudgets) => 
      prevBudgets.map((budget) => 
        budget.id === id 
          ? { ...budget, status: newStatus, updatedAt: new Date() }
          : budget
      )
    );
    
    const statusMessages = {
      pending: "Orçamento definido como pendente",
      sent: "Proposta marcada como enviada",
      accepted: "Proposta aceita pelo cliente!",
      rejected: "Proposta recusada pelo cliente"
    };
    
    toast.success(statusMessages[newStatus]);
  };

  const getBudget = (id: string) => {
    return budgets.find((budget) => budget.id === id);
  };

  return (
    <BudgetContext.Provider value={{ 
      budgets, 
      addBudget, 
      updateBudget, 
      deleteBudget,
      updateStatus,
      getBudget 
    }}>
      {children}
    </BudgetContext.Provider>
  );
};
