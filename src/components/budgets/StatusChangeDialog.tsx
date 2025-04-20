
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
  const form = useForm<StatusFormData>({
    defaultValues: {
      amount: budget.amount,
      installments: budget.installments || false,
      installmentsCount: budget.installmentsCount,
      firstPaymentDate: budget.firstPaymentDate,
    }
  });

  // Reinicializar o formulário quando o diálogo abrir ou quando o orçamento/status mudar
  useEffect(() => {
    if (open) {
      form.reset({
        amount: budget.amount,
        installments: budget.installments || false,
        installmentsCount: budget.installmentsCount,
        firstPaymentDate: budget.firstPaymentDate,
      });
    }
  }, [open, budget, form]);

  // Resetar o formulário quando o diálogo fechar
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Aguarda o diálogo fechar antes de resetar o formulário
      setTimeout(() => {
        form.reset();
      }, 100);
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
