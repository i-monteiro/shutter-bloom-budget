import { Budget } from "@/types/budget";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BudgetStatusBadge } from "@/components/ui/budget-status-badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CalendarDays, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBudgets } from "@/context/BudgetContext";
import { StatusChangeDialog } from "./StatusChangeDialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const navigate = useNavigate();
  const { updateStatus, deleteBudget } = useBudgets();

  const [isDeleting, setIsDeleting] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<"pending" | "sent" | "accepted" | "rejected">("pending");

  const dialogKey = statusDialogOpen ? Date.now() : 0;

  /* ---------------- utils ---------------- */
  const formattedAmount = budget.amount
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        budget.amount
      )
    : "Não definido";

  const formatDate = (date: Date) => {
    try {
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      return format(d, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const handleStatusSelect = (
    newStatus: "pending" | "sent" | "accepted" | "rejected"
  ) => {
    setSelectedStatus(newStatus);
    setTimeout(() => setStatusDialogOpen(true), 0);
  };

  const handleStatusChange = (
    id: string,
    newStatus: "pending" | "sent" | "accepted" | "rejected",
    data: any
  ) => {
    updateStatus(id, newStatus, data);
    setStatusDialogOpen(false);
  };

  const eventTypeLabels = {
    wedding: "Casamento",
    birthday: "Aniversário",
    corporate: "Corporativo",
    other: "Outro",
  } as const;

  /* ---------------- card ---------------- */
  return (
    <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-white">{budget.clientName}</h3>
            <span className="text-sm text-gray-400">
              {eventTypeLabels[budget.eventType]}
            </span>
          </div>
          <BudgetStatusBadge status={budget.status} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-300">Evento: {formatDate(budget.eventDate)}</span>
          </div>

          <div className="flex items-center">
            <span className="font-medium text-base text-white">{formattedAmount}</span>
            {budget.installments && (
              <span className="ml-2 text-xs text-gray-400">
                {budget.installmentsCount}x de{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(budget.amount / budget.installmentsCount)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        {/* Dropdown alterar status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Mudar Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <DropdownMenuItem onClick={() => handleStatusSelect("pending")}>
              Pendente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect("sent")}>
              Enviado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect("accepted")}>
              Aceito
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect("rejected")}>
              Recusado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {statusDialogOpen && (
          <StatusChangeDialog
            key={dialogKey}
            budget={budget}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onStatusChange={handleStatusChange}
            selectedStatus={selectedStatus}
          />
        )}

        {/* editar | apagar */}
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => navigate(`/budgets/edit/${budget.id}`)}>
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="outline" className="text-destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Excluir orçamento</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  Tem certeza que deseja excluir o orçamento para {budget.clientName}? Essa
                  ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteBudget(budget.id);
                    setIsDeleting(false);
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
