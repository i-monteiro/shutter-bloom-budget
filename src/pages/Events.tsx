import { useMemo, useState } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetStatusBadge } from "@/components/ui/budget-status-badge";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const { budgets } = useBudgets();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const acceptedEvents = useMemo(() => {
    return budgets.filter(
      (budget) => budget.status === "accepted" || budget.status === "sent"
    );
  }, [budgets]);

  const eventDates = useMemo(() => {
    const dates: Record<string, "accepted" | "sent"> = {};
    acceptedEvents.forEach((event) => {
      const dateString = format(event.eventDate, "yyyy-MM-dd");
      if (event.status === "accepted" || !dates[dateString]) {
        dates[dateString] = event.status as "accepted" | "sent";
      }
    });
    return dates;
  }, [acceptedEvents]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return acceptedEvents.filter((event) =>
      isSameDay(event.eventDate, selectedDate)
    );
  }, [acceptedEvents, selectedDate]);

  return (
    <div className="space-y-10 pt-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-accent">Agenda de Eventos</h1>
        <p className="text-foreground/70 text-lg mt-2">Veja seus compromissos e mantenha sua agenda organizada</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="bg-fotessence-dark3 border-fotessence-dark2">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md border border-fotessence-dark2 text-white"
              modifiers={{
                accepted: (date) =>
                  Object.entries(eventDates).some(
                    ([dateStr, status]) =>
                      status === "accepted" &&
                      format(date, "yyyy-MM-dd") === dateStr
                  ),
                sent: (date) =>
                  Object.entries(eventDates).some(
                    ([dateStr, status]) =>
                      status === "sent" &&
                      format(date, "yyyy-MM-dd") === dateStr
                  ),
              }}
              modifiersClassNames={{
                today: "bg-purple-300 text-black",
                selected: "bg-purple-700 text-white",
                accepted: "bg-green-600 text-white",
                sent: "bg-yellow-600 text-white",
              }}
            />
            <div className="mt-4 flex flex-col space-y-2 text-sm text-white">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-600 mr-2"></div>
                <span>Proposta aceita</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-yellow-600 mr-2"></div>
                <span>Proposta enviada</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-purple-300 mr-2"></div>
                <span>Hoje</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-purple-700 mr-2"></div>
                <span>Selecionado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-fotessence-dark3 border-fotessence-dark2">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-white">
              {selectedDate
                ? `Eventos para ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                : "Selecione uma data"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border border-fotessence-dark2 bg-fotessence-dark3 hover:bg-fotessence-dark2 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white">{event.clientName}</h3>
                      <div className="flex items-center text-sm text-white/60">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        <span>{format(event.eventDate, "HH:mm", { locale: ptBR })}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <BudgetStatusBadge status={event.status} />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/budgets/edit/${event.id}`)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/60">Nenhum evento programado para esta data.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;