
import { BudgetFormData, BudgetStatus } from "@/types/budget";

export const prepareEventPayload = (
  status: BudgetStatus,
  data: BudgetFormData & { rejectionReason?: string }
): Record<string, any> => {
  // Função auxiliar para formatação correta de datas
  const formatDate = (date: Date): string => {
    // Ajuste para garantir que a data não seja afetada pelo fuso horário
    const d = new Date(date);
    // Obtém ano, mês e dia utilizando UTC para evitar problemas de fuso horário
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
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
