
import { useNavigate } from "react-router-dom";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { useBudgets } from "@/context/BudgetContext";
import { BudgetFormData } from "@/types/budget";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateBudget = () => {
  const navigate = useNavigate();
  const { addBudget } = useBudgets();

  const handleSubmit = (data: BudgetFormData) => {
    addBudget(data);
    navigate("/budgets");
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Novo Orçamento</h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados para criar um novo orçamento.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <BudgetForm onSubmit={handleSubmit} buttonText="Criar Orçamento" />
      </div>
    </div>
  );
};

export default CreateBudget;
