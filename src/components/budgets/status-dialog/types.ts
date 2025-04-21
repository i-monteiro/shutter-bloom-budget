export interface StatusFormData {
  amount?: number;
  installments?: boolean;
  installmentsCount?: number;
  firstPaymentDate?: string;
  rejectionReason?: string;
  quantParcelas?: number; // ✅ adicione essa
  iraParcelar?: boolean;  // ✅ e essa se estiver usando
}
