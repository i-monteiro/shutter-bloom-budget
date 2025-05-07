
import { z } from "zod";

// Schema usado para validar os dados do formulário de lead
export const insertLeadSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").max(15, "Telefone muito longo"),
});

// Tipo para usar no React Hook Form e em outras validações
export type InsertLead = z.infer<typeof insertLeadSchema>;
