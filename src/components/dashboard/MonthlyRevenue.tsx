
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Budget } from "@/types/budget";
import { format, addMonths, getMonth, getYear, isSameMonth, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MonthlyRevenueProps {
  budgets: Budget[];
}

export function MonthlyRevenue({ budgets }: MonthlyRevenueProps) {
  const chartData = useMemo(() => {
    const currentYear = getYear(new Date());
    const acceptedBudgets = budgets.filter(
      (budget) => budget.status === "accepted"
    );

    // Initialize data for all 12 months
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(currentYear, i, 1), "MMM", { locale: ptBR }),
      revenue: 0,
    }));

    // Calculate revenue per month based on installments
    acceptedBudgets.forEach((budget) => {
      // If not installments, full amount on first payment date
      if (!budget.installments) {
        const paymentMonth = getMonth(budget.firstPaymentDate);
        // Only count this year's revenue
        if (getYear(budget.firstPaymentDate) === currentYear) {
          monthlyData[paymentMonth].revenue += budget.amount;
        }
      } else {
        // Calculate installment amount
        const installmentAmount = budget.amount / budget.installmentsCount;
        
        // Add each installment to the respective month
        for (let i = 0; i < budget.installmentsCount; i++) {
          const installmentDate = addMonths(budget.firstPaymentDate, i);
          const installmentMonth = getMonth(installmentDate);
          
          // Only count this year's revenue
          if (getYear(installmentDate) === currentYear) {
            monthlyData[installmentMonth].revenue += installmentAmount;
          }
        }
      }
    });

    // Format revenue to 2 decimal places
    return monthlyData.map(item => ({
      ...item,
      revenue: Number(item.revenue.toFixed(2))
    }));
  }, [budgets]);

  return (
    <Card className="h-full card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Faturamento Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #eaeaea', 
                borderRadius: '8px' 
              }}
              formatter={(value) => [`R$ ${value}`, 'Faturamento']}
              labelFormatter={(label) => `Mês: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#67be9b" 
              strokeWidth={2} 
              dot={{ r: 4, fill: "#67be9b" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
