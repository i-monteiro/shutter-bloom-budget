
export type BudgetStatus = 'pending' | 'sent' | 'accepted' | 'rejected';

export type EventType = 'casamento' | 'aniversario' | 'corporativo' | 'ensaio' | 'formatura' | 'outro';

export interface Budget {
  id: string;
  clientName: string;
  phone: string;
  budgetDate: Date;
  eventDate: Date;
  eventType: EventType;
  amount?: number;
  installments?: boolean;
  installmentsCount?: number;
  firstPaymentDate?: Date;
  status: BudgetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetFormData {
  clientName: string;
  phone: string;
  budgetDate: Date;
  eventDate: Date;
  eventType: EventType;
  amount?: number;
  installments?: boolean;
  installmentsCount?: number;
  firstPaymentDate?: Date;
}
