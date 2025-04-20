
import { useEffect } from "react";
import { Budget, BudgetStatus } from "@/types/budget";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AmountField } from "./status-dialog/AmountField";
import { InstallmentsSection } from "./status-dialog/InstallmentsSection";
import { StatusFormData } from "./status-dialog/types";

interface StatusChangeDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, newStatus: BudgetStatus, data: any) => void;
  selectedStatus: BudgetStatus;
}

export function StatusChangeDialog({
  budget,
  open,
  onOpenChange,
  onStatusChange,
  selectedStatus
}: StatusChangeDialogProps) {
  // Criamos um novo formulário sempre que o diálogo abrir ou o status mudar
  const form = useForm<StatusFormData>({
    defaultValues: {
      amount: budget.amount,
      installments: budget.installments || false,
      installmentsCount: budget.installmentsCount,
      firstPaymentDate: budget.firstPaymentDate,
    }
  });

  // Reinicializamos o formulário quando o diálogo abrir ou quando o orçamento/status mudar
  useEffect(() => {
    if (open) {
      // Forçamos a reinicialização completa do formulário
      form.reset({
        amount: budget.amount,
        installments: budget.installments || false,
        installmentsCount: budget.installmentsCount,
        firstPaymentDate: budget.firstPaymentDate,
      });
    }
  }, [open, budget, form, selectedStatus]);

  // Função para lidar com a mudança do estado do diálogo
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Limpamos completamente o formulário antes de fechar
      form.reset();
    }
    onOpenChange(newOpen);
  };

  const onSubmit = (data: StatusFormData) => {
    onStatusChange(budget.id, selectedStatus, data);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedStatus === 'sent' ? 'Enviar Orçamento' : 
             selectedStatus === 'accepted' ? 'Aceitar Orçamento' :
             selectedStatus === 'rejected' ? 'Recusar Orçamento' : 
             'Definir como Pendente'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações necessárias para {
              selectedStatus === 'sent' ? 'enviar o orçamento' : 
              selectedStatus === 'accepted' ? 'aceitar o orçamento' :
              selectedStatus === 'rejected' ? 'recusar o orçamento' : 
              'definir como pendente'
            }.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(selectedStatus === 'sent' || selectedStatus === 'accepted') && (
              <AmountField form={form} />
            )}

            {selectedStatus === 'accepted' && (
              <InstallmentsSection form={form} />
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
