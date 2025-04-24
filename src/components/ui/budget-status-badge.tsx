import { BudgetStatus } from "@/types/budget";
import { cn } from "@/lib/utils";

interface BudgetStatusBadgeProps {
  status: BudgetStatus;
  className?: string;
}

export function BudgetStatusBadge({ status, className }: BudgetStatusBadgeProps) {
  const style = {
    pending:  "border-yellow-600/30 bg-yellow-500/10  text-yellow-500",
    sent:     "border-blue-600/30   bg-blue-500/10   text-blue-500",
    accepted: "border-green-600/30  bg-green-500/10  text-green-500",
    rejected: "border-red-600/30    bg-red-500/10    text-red-500",
  }[status];

  const label = {
    pending: "Pendente",
    sent: "Enviado",
    accepted: "Aceito",
    rejected: "Recusado",
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-md px-2 py-0.5 text-xs font-semibold",
        "border backdrop-blur-sm", // vidro fosco
        style,
        className
      )}
      style={{ minHeight: "20px" }} // garante altura mínima agradável
    >
      {label}
    </span>
  );
}
