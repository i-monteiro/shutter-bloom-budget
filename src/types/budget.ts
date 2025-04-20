
export type BudgetStatus = 'pending' | 'sent' | 'accepted' | 'rejected';

export interface Budget {
  id: string;
  clientName: string;
  phone: string;
  budgetDate: Date;
  eventDate: Date;
  amount: number;
  installments: boolean;
  installmentsCount: number;
  firstPaymentDate: Date;
  status: BudgetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetFormData {
  clientName: string;
  phone: string;
  budgetDate: Date;
  eventDate: Date;
  amount: number;
  installments: boolean;
  installmentsCount: number;
  firstPaymentDate: Date;
}
