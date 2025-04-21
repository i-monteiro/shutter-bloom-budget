
export interface StatusFormData {
  amount: number | undefined;
  installments: boolean;
  installmentsCount: number | undefined;
  firstPaymentDate: Date | undefined;
  rejectionReason: string;
}
