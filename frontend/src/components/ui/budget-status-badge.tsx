
import { BudgetStatus } from "@/types/budget";
import { cn } from "@/lib/utils";

interface BudgetStatusBadgeProps {
  status: BudgetStatus;
  className?: string;
}

export function BudgetStatusBadge({ status, className }: BudgetStatusBadgeProps) {
  const statusMap = {
    pending: {
      label: "Pendente",
      className: "status-pending"
    },
    sent: {
      label: "Enviado",
      className: "status-sent"
    },
    accepted: {
      label: "Aceito",
      className: "status-accepted"
    },
    rejected: {
      label: "Recusado",
      className: "status-rejected"
    }
  };

  const { label, className: statusClassName } = statusMap[status];

  return (
    <span className={cn(statusClassName, className)}>
      {label}
    </span>
  );
}
