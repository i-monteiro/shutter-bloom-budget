import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/types/budget";
import { format, addMonths, getMonth, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MonthlyRevenueProps {
  budgets: Budget[];
}

export function MonthlyRevenue({ budgets }: MonthlyRevenueProps) {
  const chartData = useMemo(() => {
    const currentYear = getYear(new Date());
    const accepted = budgets.filter(b => b.status === "accepted");

    const data = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(currentYear, i, 1), "MMM", { locale: ptBR }),
      revenue: 0,
    }));

    accepted.forEach(b => {
      if (!b.amount) return;

      if (!b.installments) {
        if (!b.firstPaymentDate) return;
        if (getYear(b.firstPaymentDate) === currentYear)
          data[getMonth(b.firstPaymentDate)].revenue += b.amount;
      } else {
        if (!b.installmentsCount || !b.firstPaymentDate) return;
        const parc = b.amount / b.installmentsCount;
        for (let i = 0; i < b.installmentsCount; i++) {
          const d = addMonths(b.firstPaymentDate, i);
          if (getYear(d) === currentYear)
            data[getMonth(d)].revenue += parc;
        }
      }
    });

    return data.map(d => ({ ...d, revenue: Number(d.revenue.toFixed(2)) }));
  }, [budgets]);

  return (
    <Card className="h-full border-gray-800 bg-gray-900/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white">Faturamento Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
              tickFormatter={v => `R$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: 8,
              }}
              formatter={v => [`R$ ${v}`, "Faturamento"]}
              labelFormatter={l => `Mês: ${l}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"         /* purple-500 */
              strokeWidth={2}
              dot={{ r: 4, fill: "#a855f7" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
