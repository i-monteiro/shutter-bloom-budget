import { useNavigate, useParams } from "react-router-dom";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { useBudgets } from "@/context/BudgetContext";
import { BudgetFormData } from "@/types/budget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const EditBudget = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBudget, updateBudget } = useBudgets();
  const [budgetData, setBudgetData] = useState<BudgetFormData | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<'pending' | 'sent' | 'accepted' | 'rejected'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const budget = getBudget(id);
      if (budget) {
        const normalizeDate = (date: Date | undefined): Date => {
          if (!date) return new Date();
          const normalizedDate = new Date(date);
          normalizedDate.setHours(12, 0, 0, 0);
          return normalizedDate;
        };

        const { clientName, phone, budgetDate, eventDate, eventType, amount, installments, installmentsCount, firstPaymentDate, status } = budget;

        setBudgetData({
          clientName,
          phone,
          budgetDate: normalizeDate(budgetDate),
          eventDate: normalizeDate(eventDate),
          eventType,
          amount,
          installments,
          installmentsCount,
          firstPaymentDate: firstPaymentDate ? normalizeDate(firstPaymentDate) : undefined,
        });
        setBudgetStatus(status);
      } else {
        toast.error("Orçamento não encontrado");
        navigate("/budgets");
      }
    }
  }, [id, getBudget, navigate]);

  const handleSubmit = async (data: BudgetFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateBudget(id, data);
      toast.success("Orçamento atualizado com sucesso");
      navigate("/budgets");
    } catch (error) {
      toast.error("Erro ao atualizar orçamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!budgetData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          <p className="text-gray-400">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
      </div>

      <Separator className="bg-gray-800" />

      <Card className="border-gray-800 bg-gray-900/50 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Informações do orçamento
          </CardTitle>
          <CardDescription>
            Edite os dados do cliente e do evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm
            onSubmit={handleSubmit}
            initialData={budgetData}
            buttonText={isSubmitting ? "Salvando..." : "Atualizar Orçamento"}
            budgetStatus={budgetStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBudget;