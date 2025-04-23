
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BudgetFormData, EventType } from "@/types/budget";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// Define schema dinâmico para o formulário
const createBudgetFormSchema = (showAmount: boolean, showInstallments: boolean) => {
  const baseSchema = {
    clientName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    phone: z.string().min(8, "Telefone inválido"),
    budgetDate: z.date(),
    eventDate: z.date(),
    eventType: z.enum(['casamento', 'aniversario', 'corporativo', 'ensaio', 'formatura', 'outro'] as const),
  };

  const amountSchema = showAmount ? {
    amount: z.coerce.number().positive("Valor deve ser positivo")
  } : {};

  const installmentsSchema = showInstallments ? {
    installments: z.boolean().default(false),
    installmentsCount: z.coerce.number().int().min(1).max(36).optional(),
    firstPaymentDate: z.date().optional()
  } : {};

  return z.object({
    ...baseSchema,
    ...amountSchema,
    ...installmentsSchema
  });
};

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  initialData?: BudgetFormData;
  buttonText?: string;
  budgetStatus?: 'pending' | 'sent' | 'accepted' | 'rejected';
}

export function BudgetForm({ 
  onSubmit, 
  initialData, 
  buttonText = "Salvar Orçamento",
  budgetStatus = 'pending'
}: BudgetFormProps) {
  const showAmount = budgetStatus === 'sent' || budgetStatus === 'accepted';
  const showInstallments = budgetStatus === 'accepted';
  const [showInstallmentsFields, setShowInstallmentsFields] = useState(initialData?.installments || false);

  // Normalizar as datas iniciais para evitar problemas de fuso horário
  const normalizeDate = (date: Date | undefined): Date => {
    if (!date) return new Date();
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0); // Meio-dia para evitar problemas de timezone
    return normalizedDate;
  };

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(createBudgetFormSchema(showAmount, showInstallments)),
    defaultValues: {
      clientName: initialData?.clientName || "",
      phone: initialData?.phone || "",
      budgetDate: normalizeDate(initialData?.budgetDate),
      eventDate: normalizeDate(initialData?.eventDate),
      eventType: initialData?.eventType || "casamento",
      amount: initialData?.amount || 0,
      installments: initialData?.installments || false,
      installmentsCount: initialData?.installmentsCount || 1,
      firstPaymentDate: normalizeDate(initialData?.firstPaymentDate),
    },
  });

  function handleSubmit(data: BudgetFormData) {
    // Normalizar todas as datas antes de enviar
    const normalizedData = {
      ...data,
      budgetDate: normalizeDate(data.budgetDate),
      eventDate: normalizeDate(data.eventDate),
      firstPaymentDate: data.firstPaymentDate ? normalizeDate(data.firstPaymentDate) : undefined,
    };
    onSubmit(normalizedData);
  }

  // Função para lidar com a seleção de data preservando o dia correto
  const handleDateSelect = (field: any, date: Date | undefined) => {
    if (!date) return;
    
    // Garantir que a data selecionada mantenha o dia correto
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0);
    field.onChange(normalizedDate);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="casamento">Casamento</option>
                  <option value="aniversario">Aniversário</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="ensaio">Ensaio</option>
                  <option value="formatura">Formatura</option>
                  <option value="outro">Outro</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <FormField
            control={form.control}
            name="budgetDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Orçamento</FormLabel>
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
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                      onSelect={(date) => handleDateSelect(field, date)}
                      locale={ptBR}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Evento</FormLabel>
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
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                      onSelect={(date) => handleDateSelect(field, date)}
                      locale={ptBR}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showAmount && (
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
                <FormDescription>Valor total em Reais (R$)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showInstallments && (
          <>
            <FormField
              control={form.control}
              name="firstPaymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Pagamento</FormLabel>
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
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                        onSelect={(date) => handleDateSelect(field, date)}
                        locale={ptBR}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        setShowInstallmentsFields(!!checked);
                        if (!checked) {
                          form.setValue('installmentsCount', 1);
                        }
                      }} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Parcelado</FormLabel>
                    <FormDescription>
                      Marque se o valor será parcelado
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {showInstallmentsFields && (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary">
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
