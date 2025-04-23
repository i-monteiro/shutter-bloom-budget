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
  
  const dialogKey = statusDialogOpen ? Date.now() : 0;

  const formattedAmount = budget.amount ? new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(budget.amount) : 'Não definido';

  const formatDate = (date: Date) => {
    try {
      const d = new Date(date);
      d.setHours(12, 0, 0, 0);
      return format(d, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const handleStatusSelect = (newStatus: "pending" | "sent" | "accepted" | "rejected") => {
    setSelectedStatus(newStatus);
    setTimeout(() => {
      setStatusDialogOpen(true);
    }, 0);
  };

  const handleStatusChange = (id: string, newStatus: "pending" | "sent" | "accepted" | "rejected", data: any) => {
    updateStatus(id, newStatus, data);
    setStatusDialogOpen(false);
  };

  const handleEdit = () => {
    navigate(`/budgets/edit/${budget.id}`);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    deleteBudget(budget.id);
    setIsDeleting(false);
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setStatusDialogOpen(isOpen);
  };

  const eventTypeLabels = {
    wedding: 'Casamento',
    birthday: 'Aniversário',
    corporate: 'Corporativo',
    other: 'Outro'
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{budget.clientName}</h3>
            <span className="text-sm text-muted-foreground">
              {eventTypeLabels[budget.eventType]}
            </span>
          </div>
          <BudgetStatusBadge status={budget.status} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>Evento: {formatDate(budget.eventDate)}</span>
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

        {statusDialogOpen && (
          <StatusChangeDialog
            key={dialogKey}
            budget={budget}
            open={statusDialogOpen}
            onOpenChange={handleDialogOpenChange}
            onStatusChange={handleStatusChange}
            selectedStatus={selectedStatus}
          />
        )}
        
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
