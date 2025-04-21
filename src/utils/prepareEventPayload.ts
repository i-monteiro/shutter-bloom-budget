import { BudgetFormData, BudgetStatus } from "@/types/budget";

export const prepareEventPayload = (
  status: BudgetStatus,
  data: BudgetFormData & { rejectionReason?: string }
): Record<string, any> => {
  const payload: Record<string, any> = {
    nomeCliente: data.clientName,
    tipoEvento: data.eventType,
    dataOrcamento: data.budgetDate.toISOString().split("T")[0],
    dataEvento: data.eventDate.toISOString().split("T")[0],
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
      ? new Date(data.firstPaymentDate).toISOString().split("T")[0]
      : null,
    contatoCliente: data.phone ?? "",
  };

  // 💥 Evita o erro: só adiciona motivoRecusa se for necessário
  if (status === "rejected") {
    payload.motivoRecusa = data.rejectionReason ?? "Motivo não informado";
  }

  return payload;
};
