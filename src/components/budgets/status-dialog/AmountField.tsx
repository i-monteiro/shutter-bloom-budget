
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StatusFormData } from "./types";

interface AmountFieldProps {
  form: UseFormReturn<StatusFormData>;
}

export function AmountField({ form }: AmountFieldProps) {
  return (
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
  );
}
