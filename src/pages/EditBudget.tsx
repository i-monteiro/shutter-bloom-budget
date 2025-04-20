
import { useNavigate, useParams } from "react-router-dom";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { useBudgets } from "@/context/BudgetContext";
import { BudgetFormData } from "@/types/budget";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditBudget = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBudget, updateBudget } = useBudgets();
  const [budgetData, setBudgetData] = useState<BudgetFormData | null>(null);

  useEffect(() => {
    if (id) {
      const budget = getBudget(id);
      if (budget) {
        const { clientName, phone, budgetDate, eventDate, amount, installments, installmentsCount, firstPaymentDate } = budget;
        setBudgetData({
          clientName,
          phone,
          budgetDate,
          eventDate,
          amount,
          installments,
          installmentsCount,
          firstPaymentDate
        });
      } else {
        toast.error("Orçamento não encontrado");
        navigate("/budgets");
      }
    }
  }, [id, getBudget, navigate]);

  const handleSubmit = (data: BudgetFormData) => {
    if (id) {
      updateBudget(id, data);
      navigate("/budgets");
    }
  };

  if (!budgetData) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/budgets")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Orçamento</h1>
          <p className="text-muted-foreground mt-1">
            Atualize os dados do orçamento.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <BudgetForm onSubmit={handleSubmit} initialData={budgetData} buttonText="Atualizar Orçamento" />
      </div>
    </div>
  );
};

export default EditBudget;
