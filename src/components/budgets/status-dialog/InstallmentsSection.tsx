
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
import { useState } from "react";

interface InstallmentsSectionProps {
  form: UseFormReturn<StatusFormData>;
}

export function InstallmentsSection({ form }: InstallmentsSectionProps) {
  const [showInstallments, setShowInstallments] = useState(false);

  return (
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
  );
}
