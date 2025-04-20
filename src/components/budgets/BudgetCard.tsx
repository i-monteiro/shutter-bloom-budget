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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const navigate = useNavigate();
  const { updateStatus, deleteBudget } = useBudgets();
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'sent' | 'accepted' | 'rejected'>('pending');

  // Format currency
  const formattedAmount = budget.amount ? new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(budget.amount) : 'Não definido';

  // Handle status change
  const handleStatusSelect = (newStatus: "pending" | "sent" | "accepted" | "rejected") => {
    setSelectedStatus(newStatus);
    setStatusDialogOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: "pending" | "sent" | "accepted" | "rejected", data: any) => {
    updateStatus(id, newStatus, data);
  };

  // Handle edit
  const handleEdit = () => {
    navigate(`/budgets/edit/${budget.id}`);
  };

  // Handle delete
  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    deleteBudget(budget.id);
    setIsDeleting(false);
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">{budget.clientName}</h3>
          <BudgetStatusBadge status={budget.status} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>Evento: {format(budget.eventDate, "PPP", { locale: ptBR })}</span>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium text-base">{formattedAmount}</span>
            {budget.installments && (
              <span className="ml-2 text-xs text-muted-foreground">
                {budget.installmentsCount}x de {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(budget.amount / budget.installmentsCount)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Mudar Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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

        <StatusChangeDialog
          budget={budget}
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          onStatusChange={handleStatusChange}
          selectedStatus={selectedStatus}
        />
        
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="outline" className="text-destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir orçamento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o orçamento para {budget.clientName}? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
