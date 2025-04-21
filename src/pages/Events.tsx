
import { useMemo, useState } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Filter accepted events for the calendar
  const acceptedEvents = useMemo(() => {
    return budgets.filter(
      (budget) => budget.status === "accepted" || budget.status === "sent"
    );
  }, [budgets]);

  // Generate calendar highlights
  const eventDates = useMemo(() => {
    const dates: Record<string, "accepted" | "sent"> = {};

    acceptedEvents.forEach((event) => {
      const dateString = format(event.eventDate, "yyyy-MM-dd");
      // Prioritize accepted over sent if there are both on the same day
      if (event.status === "accepted" || !dates[dateString]) {
        dates[dateString] = event.status as "accepted" | "sent";
      }
    });

    return dates;
  }, [acceptedEvents]);

  // Filter events for the selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    
    return acceptedEvents.filter((event) => 
      isSameDay(event.eventDate, selectedDate)
    );
  }, [acceptedEvents, selectedDate]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
        <p className="text-muted-foreground mt-1">
          Visualize os eventos agendados no calendário.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Calendário de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="pointer-events-auto"
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
                accepted: "bg-primary text-primary-foreground rounded",
                sent: "bg-primary-light text-primary-foreground rounded",
              }}
            />
            <div className="mt-4 flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-primary mr-2"></div>
                <span>Proposta aceita</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-primary-light mr-2"></div>
                <span>Proposta enviada</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
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
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">{event.clientName}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        <span>
                          {format(event.eventDate, "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <BudgetStatusBadge status={event.status} />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/budgets/edit/${event.id}`)}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum evento programado para esta data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;
