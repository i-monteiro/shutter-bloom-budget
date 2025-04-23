
import { BudgetFormData, BudgetStatus } from "@/types/budget";

export const prepareEventPayload = (
  status: BudgetStatus,
  data: BudgetFormData & { rejectionReason?: string }
): Record<string, any> => {
  // Função auxiliar para formatação correta de datas
  const formatDate = (date: Date): string => {
    if (!date) return null;
    
    // Normaliza a data para evitar problemas de timezone
    const d = new Date(date);
    d.setHours(12, 0, 0, 0); // Meio-dia para evitar problemas de timezone
    
    // Obtém ano, mês e dia utilizando getters locais para evitar problemas de UTC
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const payload: Record<string, any> = {
    nomeCliente: data.clientName,
    tipoEvento: data.eventType,
    dataOrcamento: formatDate(data.budgetDate),
    dataEvento: formatDate(data.eventDate),
    status:
      status === "pending"
        ? "orcamento_recebido"
        : status === "sent"
        ? "proposta_enviada"
        : status === "accepted"
        ? "proposta_aceita"
        : "proposta_recusada",
    valorEvento: data.amount ?? 0,
    iraParcelar: data.installments ?? false,
    quantParcelas: data.installmentsCount ?? 1,
    dataPrimeiroPagamento: data.firstPaymentDate
      ? formatDate(data.firstPaymentDate)
      : null,
    contatoCliente: data.phone ?? "",
  };

  // 💥 Evita o erro: só adiciona motivoRecusa se for necessário
  if (status === "rejected") {
    payload.motivoRecusa = data.rejectionReason ?? "Motivo não informado";
  }

  return payload;
};
