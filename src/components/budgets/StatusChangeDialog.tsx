
import { useState } from "react";
import { Budget, BudgetStatus } from "@/types/budget";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusChangeDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, newStatus: BudgetStatus, data: any) => void;
  selectedStatus: BudgetStatus;
}

interface StatusFormData {
  amount?: number;
  installments?: boolean;
  installmentsCount?: number;
  firstPaymentDate?: Date;
}

export function StatusChangeDialog({
  budget,
  open,
  onOpenChange,
  onStatusChange,
  selectedStatus
}: StatusChangeDialogProps) {
  const [showInstallments, setShowInstallments] = useState(false);
  
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
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Orçamento</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        step="0.01" 
                        min="0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {selectedStatus === 'accepted' && (
              <>
                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setShowInstallments(!!checked);
                          }} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Parcelado</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {showInstallments && (
                  <div className="space-y-4 animate-fade-in">
                    <FormField
                      control={form.control}
                      name="installmentsCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Parcelas</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              min="1" 
                              max="36"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstPaymentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data do 1º Pagamento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Selecione a data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={ptBR}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </>
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
