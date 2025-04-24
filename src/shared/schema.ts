import { z } from "zod";

// Schema usado para validar os dados do formulário de lead
export const insertLeadSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
});

// Tipo para usar no React Hook Form e em outras validações
export type InsertLead = z.infer<typeof insertLeadSchema>;
