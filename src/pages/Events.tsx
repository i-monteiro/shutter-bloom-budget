import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Filter, Plus } from 'lucide-react';
import { useBudgets } from '@/context/BudgetContext';
import { Budget } from '@/types/budget';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Configuração do localizer para português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const eventTypeColors = {
  casamento: '#805AD5', // roxo
  aniversario: '#3182CE', // azul
  corporativo: '#38A169', // verde
  ensaio: '#D69E2E', // amarelo
  formatura: '#DD6B20', // laranja
  outro: '#718096', // cinza
};

// Mapeamento dos tipos de evento
const eventTypeLabels = {
  casamento: 'Casamento',
  aniversario: 'Aniversário',
  corporativo: 'Corporativo',
  ensaio: 'Ensaio',
  formatura: 'Formatura',
  outro: 'Outro',
};

const Events = () => {
  const { budgets } = useBudgets();
  const [selectedEvent, setSelectedEvent] = useState<Budget | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Transformar orçamentos em eventos para o calendário
  const events = budgets
    // Filtrar apenas orçamentos aprovados (status "accepted")
    .filter(budget => budget.status === 'accepted')
    .map(budget => {
      const eventDate = new Date(budget.eventDate);
      return {
        id: budget.id,
        title: budget.clientName,
        start: eventDate,
        end: new Date(eventDate.getTime() + 3 * 60 * 60 * 1000), // +3 horas
        resource: budget,
        // Associar cor ao tipo de evento
        color: eventTypeColors[budget.eventType as keyof typeof eventTypeColors] || eventTypeColors.outro,
      };
    });
  
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
    setIsDetailsOpen(true);
  };
  
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0',
        display: 'block',
      },
    };
  };
  
  const formatEventDate = (date: Date) => {
    return format(new Date(date), 'PPP', { locale: ptBR });
  };
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Agenda de eventos</h1>
          <p className="text-gray-400 mt-1">Visualize e gerencie seus eventos agendados</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white flex gap-2 items-center"
        >
          <Plus className="h-4 w-4" />
          Agendar evento
        </Button>
      </div>
      
      <Separator className="bg-gray-800" />
      
      {/* Legenda de tipos de evento */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(eventTypeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }} 
            />
            <span className="text-sm text-gray-300">
              {eventTypeLabels[type as keyof typeof eventTypeLabels]}
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendário */}
      <Card className="border-gray-800 bg-gray-900/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="custom-calendar-theme">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Não há eventos neste período.",
              }}
              views={['month', 'week', 'day', 'agenda']}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de detalhes do evento */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Detalhes do evento</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações completas sobre o evento selecionado
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Cliente</p>
                  <p className="text-white font-medium">{selectedEvent.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Contato</p>
                  <p className="text-white">{selectedEvent.phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Tipo de evento</p>
                  <p className="text-white">
                    {eventTypeLabels[selectedEvent.eventType as keyof typeof eventTypeLabels]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Data</p>
                  <p className="text-white">{formatEventDate(selectedEvent.eventDate)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Valor</p>
                <p className="text-white font-medium">
                  {selectedEvent.amount 
                    ? `R$ ${selectedEvent.amount.toFixed(2).replace('.', ',')}` 
                    : 'Não definido'}
                </p>
              </div>
              
              {selectedEvent.installments && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Parcelamento</p>
                    <p className="text-white">{selectedEvent.installmentsCount}x</p>
                  </div>
                  {selectedEvent.firstPaymentDate && (
                    <div>
                      <p className="text-sm text-gray-400">Primeiro pagamento</p>
                      <p className="text-white">{formatEventDate(selectedEvent.firstPaymentDate)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button 
              className="w-full bg-gray-800 hover:bg-gray-700 text-white" 
              onClick={() => setIsDetailsOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Estilos personalizados para o calendário */}
      <style>{`
        .custom-calendar-theme {
          /* Estilo geral */
          .rbc-calendar {
            background-color: #111827;
            color: #e4e4e7;
          }
          
          /* Cabeçalho */
          .rbc-toolbar {
            padding: 0.75rem;
            background-color: #111827;
            border-bottom: 1px solid #1f2937;
            color: white;
          }
          
          .rbc-toolbar button {
            color: #d1d5db;
            border: 1px solid #374151;
            background-color: #1f2937;
          }
          
          .rbc-toolbar button:hover {
            background-color: #374151;
            color: white;
          }
          
          .rbc-toolbar button.rbc-active {
            background-color: #6d28d9;
            color: white;
            border-color: #6d28d9;
          }
          
          .rbc-toolbar button.rbc-active:hover {
            background-color: #5b21b6;
            border-color: #5b21b6;
          }
          
          /* Grade do mês */
          .rbc-month-view {
            border: 1px solid #1f2937;
          }
          
          .rbc-month-header {
            background-color: #1f2937;
          }
          
          .rbc-header {
            padding: 0.5rem;
            font-weight: 500;
            border-bottom: 1px solid #374151;
            color: #d1d5db;
          }
          
          .rbc-day-bg {
            background-color: #111827;
            border-right: 1px solid #1f2937;
            border-bottom: 1px solid #1f2937;
          }
          
          .rbc-day-bg.rbc-today {
            background-color: rgba(109, 40, 217, 0.1);
          }
          
          .rbc-date-cell {
            padding: 0.25rem 0.5rem;
            color: #d1d5db;
            text-align: right;
          }
          
          .rbc-date-cell.rbc-now {
            font-weight: bold;
            color: #9f7aea;
          }
          
          /* Semana e dia */
          .rbc-time-content {
            border-top: 1px solid #1f2937;
          }
          
          .rbc-time-header-content {
            border-left: 1px solid #1f2937;
          }
          
          .rbc-time-slot {
            color: #9ca3af;
          }
          
          .rbc-time-gutter {
            color: #d1d5db;
          }
          
          .rbc-time-content > .rbc-time-gutter {
            background-color: #1f2937;
          }
          
          .rbc-timeslot-group {
            border-bottom: 1px solid #1f2937;
          }
        }
      `}</style>
    </div>
  );
};

export default Events;