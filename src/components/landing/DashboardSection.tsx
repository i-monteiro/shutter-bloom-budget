import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  ArrowRight
} from 'lucide-react';

const DashboardSection = () => {
  return (
    <section id="dashboard" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold text-[#2B3A67] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Dashboard Intuitivo para Fotógrafos
          </motion.h2>
          <motion.p 
            className="text-xl text-[#4A4A4A]/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Visualize todos os seus dados importantes em um só lugar.
            Um painel completo para tomar decisões baseadas em dados reais.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-2xl font-semibold text-[#2B3A67] mb-6">Dados Financeiros em Tempo Real</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <BarChart3 className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Análise de Receitas</h4>
                  <p className="text-[#4A4A4A]/80">Acompanhe suas receitas por tipo de serviço, cliente ou período para identificar suas fontes mais lucrativas.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <PieChart className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Visão de Despesas</h4>
                  <p className="text-[#4A4A4A]/80">Categorize e monitore seus gastos para otimizar seu orçamento e maximizar seus lucros.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <LineChart className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Previsão de Fluxo de Caixa</h4>
                  <p className="text-[#4A4A4A]/80">Planeje seu futuro financeiro com nossa ferramenta de previsão de fluxo de caixa baseada nos seus dados históricos.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <Calendar className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Produtividade e Agendamentos</h4>
                  <p className="text-[#4A4A4A]/80">Visualize sua ocupação e disponibilidade para otimizar seu tempo e aumentar sua produtividade.</p>
                </div>
              </div>
              
              <Button 
                className="mt-4 bg-[#FFC857] text-[#2B3A67] hover:bg-[#FFC857]/90"
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Experimente Grátis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <Card className="overflow-hidden border-[#496A81]/20 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Dashboard financeiro para fotógrafos" 
                className="w-full h-auto rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg"></div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;