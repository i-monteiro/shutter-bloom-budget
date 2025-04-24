import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/types/budget";
import { format, getMonth, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MonthlyEventsProps {
  budgets: Budget[];
}

export function MonthlyEvents({ budgets }: MonthlyEventsProps) {
  const chartData = useMemo(() => {
    const currentYear = getYear(new Date());
    const accepted = budgets.filter(
      b => b.status === "accepted" && getYear(b.eventDate) === currentYear
    );

    const data = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(currentYear, i, 1), "MMM", { locale: ptBR }),
      events: 0,
    }));

    accepted.forEach(b => {
      data[getMonth(b.eventDate)].events += 1;
    });

    return data;
  }, [budgets]);

  return (
    <Card className="h-full border-gray-800 bg-gray-900/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">Eventos por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: 8,
              }}
              formatter={v => [`${v} eventos`, "Eventos"]}
              labelFormatter={l => `Mês: ${l}`}
            />
            <Bar
              dataKey="events"
              fill="#a855f7"           /* purple-500 */
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
