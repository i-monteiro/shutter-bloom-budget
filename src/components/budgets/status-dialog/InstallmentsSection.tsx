
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { StatusFormData } from "./types";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface InstallmentsSectionProps {
  form: UseFormReturn<StatusFormData>;
}

export function InstallmentsSection({ form }: InstallmentsSectionProps) {
  const watchInstallments = form.watch("installments");

  useEffect(() => {
    if (!watchInstallments) {
      form.setValue("installmentsCount", 1);
    }
  }, [watchInstallments, form]);

  return (
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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Parcelado</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {watchInstallments && (
        <FormField
          control={form.control}
          name="installmentsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Parcelas</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  min={1}
                  max={36}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </>
  );
}
