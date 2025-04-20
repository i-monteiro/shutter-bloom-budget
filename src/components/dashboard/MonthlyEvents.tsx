
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
    const acceptedBudgets = budgets.filter(
      (budget) => budget.status === "accepted" && getYear(budget.eventDate) === currentYear
    );

    // Initialize data for all 12 months
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(currentYear, i, 1), "MMM", { locale: ptBR }),
      events: 0,
    }));

    // Count events per month
    acceptedBudgets.forEach((budget) => {
      const month = getMonth(budget.eventDate);
      monthlyData[month].events += 1;
    });

    return monthlyData;
  }, [budgets]);

  return (
    <Card className="h-full card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Eventos por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="month" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #eaeaea', 
                borderRadius: '8px' 
              }}
              formatter={(value) => [`${value} eventos`, 'Eventos']}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Bar 
              dataKey="events" 
              fill="#67be9b" 
              radius={[4, 4, 0, 0]} 
              barSize={40} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
