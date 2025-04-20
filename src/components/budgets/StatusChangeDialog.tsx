
import { useState } from "react";
import { Budget, BudgetStatus } from "@/types/budget";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      installments: budget.installments,
      installmentsCount: budget.installmentsCount,
      firstPaymentDate: budget.firstPaymentDate,
    }
  });

  const onSubmit = (data: StatusFormData) => {
    onStatusChange(budget.id, selectedStatus, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedStatus === 'sent' ? 'Enviar Orçamento' : 
             selectedStatus === 'accepted' ? 'Aceitar Orçamento' :
             selectedStatus === 'rejected' ? 'Recusar Orçamento' : 
             'Definir como Pendente'}
          </DialogTitle>
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
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
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
