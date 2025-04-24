import React, { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  ToolbarProps,
  Formats,
} from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useBudgets } from "@/context/BudgetContext";
import { Budget } from "@/types/budget";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/* ---------- Localização ---------- */
moment.locale("pt-br");
const localizer = momentLocalizer(moment);

/* ---------- Cores por tipo ---------- */
const eventTypeColors = {
  casamento: "#805AD5",
  aniversario: "#3182CE",
  corporativo: "#38A169",
  ensaio: "#D69E2E",
  formatura: "#DD6B20",
  outro: "#718096",
} as const;

const eventTypeLabels = {
  casamento: "Casamento",
  aniversario: "Aniversário",
  corporativo: "Corporativo",
  ensaio: "Ensaio",
  formatura: "Formatura",
  outro: "Outro",
} as const;

/* ---------- Toolbar custom ---------- */
function ViewOnlyToolbar<T extends object>(toolbar: ToolbarProps<T>) {
  const viewNames: Views[] = ["month"];
  const labels = { month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda" };

  return (
    <div className="flex gap-2 p-3 bg-gray-900 border-b border-gray-800">
      {viewNames.map((name) => (
        <Button
          key={name}
          size="sm"
          variant={toolbar.view === name ? "default" : "outline"}
          onClick={() => toolbar.onView(name)}
          className={
            toolbar.view === name
              ? "bg-purple-600 hover:bg-purple-700"
              : "border-gray-700 text-gray-300"
          }
        >
          {labels[name]}
        </Button>
      ))}
    </div>
  );
}

/* ---------- Formatos personalizados ---------- */
const formats: Partial<Formats> = {
  weekdayFormat: (date, culture, loc) => loc.format(date, "ddd", culture), // dom, seg, ter...
  dayFormat: (date, culture, loc) => loc.format(date, "dd", culture),      // 01, 02…
  agendaDateFormat: (date, culture, loc) => loc.format(date, "PPP", culture),
  agendaTimeFormat: (date, culture, loc) => loc.format(date, "p", culture),
};

/* ---------- Componente ---------- */
export default function Events() {
  const { budgets } = useBudgets();
  const [selectedEvent, setSelectedEvent] = useState<Budget | null>(null);
  const [open, setOpen] = useState(false);

  /* Orçamentos ➜ eventos */
  const events = budgets
    .filter((b) => b.status === "accepted")
    .map((b) => {
      const start = new Date(b.eventDate);
      return {
        id: b.id,
        title: b.clientName,
        start,
        end: new Date(start.getTime() + 3 * 60 * 60 * 1000),
        resource: b,
        color:
          eventTypeColors[
            b.eventType as keyof typeof eventTypeColors
          ] ?? eventTypeColors.outro,
      };
    });

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: "4px",
      border: 0,
      color: "#fff",
      opacity: 0.9,
    },
  });

  const fmt = (d: Date) => format(new Date(d), "PPP", { locale: ptBR });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Agenda de eventos</h1>
          <p className="text-gray-400 mt-1">
            Visualize e gerencie seus eventos agendados
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex gap-2 items-center">
          <Plus className="h-4 w-4" />
          Agendar evento
        </Button>
      </div>

      <Separator className="bg-gray-800" />

      {/* Legenda */}
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
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white">Calendário</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Calendar
            localizer={localizer}
            culture="pt-br"
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            formats={formats}
            components={{ toolbar: ViewOnlyToolbar }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(e) => {
              setSelectedEvent(e.resource);
              setOpen(true);
            }}
            messages={{ noEventsInRange: "Não há eventos neste período." }}
            views={["month", "week", "day", "agenda"]}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do evento</DialogTitle>
            <DialogDescription className="text-gray-400">
              Informações completas sobre o evento selecionado
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Cliente</p>
                  <p className="text-white font-medium">{selectedEvent.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Contato</p>
                  <p className="text-white">{selectedEvent.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Tipo de evento</p>
                  <p className="text-white">
                    {
                      eventTypeLabels[
                        selectedEvent.eventType as keyof typeof eventTypeLabels
                      ]
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Data</p>
                  <p className="text-white">{fmt(selectedEvent.eventDate)}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400">Valor</p>
                <p className="text-white font-medium">
                  {selectedEvent.amount
                    ? `R$ ${selectedEvent.amount.toFixed(2).replace(".", ",")}`
                    : "Não definido"}
                </p>
              </div>

              {selectedEvent.installments && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Parcelamento</p>
                    <p className="text-white">
                      {selectedEvent.installmentsCount}x
                    </p>
                  </div>
                  {selectedEvent.firstPaymentDate && (
                    <div>
                      <p className="text-gray-400">Primeiro pagamento</p>
                      <p className="text-white">
                        {fmt(selectedEvent.firstPaymentDate)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-gray-800 hover:bg-gray-700"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Estilo refinado */}
      <style>{`
        .rbc-calendar{background:#0f172a;color:#e4e4e7;font-size:.85rem}
        .rbc-toolbar{background:#0f172a;border-bottom:1px solid #1e293b;padding:.75rem}
        .rbc-month-view{border:1px solid #1e293b}
        .rbc-month-header{background:#1e293b}
        .rbc-header{border-bottom:1px solid #1e293b;padding:.4rem;font-weight:500;color:#cbd5e1}
        .rbc-day-bg{background:#0f172a;border-right:1px solid #1e293b;border-bottom:1px solid #1e293b}
        .rbc-day-bg.rbc-off-range-bg{opacity:.25}
        .rbc-day-bg.rbc-today{background:rgba(168,85,247,.09)}
        .rbc-date-cell{text-align:right;padding:.25rem .5rem;color:#cbd5e1}
        .rbc-date-cell.rbc-now{font-weight:600;color:#a855f7}
        .rbc-time-content{border-top:1px solid #1e293b}
        .rbc-time-header-content{border-left:1px solid #1e293b}
        .rbc-time-slot{color:#64748b}
        .rbc-time-gutter{color:#cbd5e1}
        .rbc-timeslot-group{border-bottom:1px solid #1e293b}
        .rbc-event{border-radius:4px;padding:2px 4px;font-size:.75rem}
      `}</style>
    </div>
  );
}
