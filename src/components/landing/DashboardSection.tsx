import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  return (
    <section id="dashboard" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      
      {/* Partículas roxas no fundo */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute top-60 -left-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-20 w-40 h-40 bg-indigo-700/20 rounded-full blur-3xl z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Dashboard Intuitivo para Fotógrafos
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300/80"
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
            <h3 className="text-2xl font-semibold text-white mb-6">Dados Financeiros em Tempo Real</h3>
            <div className="space-y-6 text-gray-300">
              {[
                {
                  icon: <BarChart3 className="h-6 w-6 text-purple-400" />,
                  title: "Análise de Receitas",
                  desc: "Acompanhe suas receitas por tipo de serviço, cliente ou período para identificar suas fontes mais lucrativas.",
                },
                {
                  icon: <PieChart className="h-6 w-6 text-purple-400" />,
                  title: "Visão de Despesas",
                  desc: "Categorize e monitore seus gastos para otimizar seu orçamento e maximizar seus lucros.",
                },
                {
                  icon: <LineChart className="h-6 w-6 text-purple-400" />,
                  title: "Previsão de Fluxo de Caixa",
                  desc: "Planeje seu futuro financeiro com nossa ferramenta de previsão de fluxo de caixa baseada nos seus dados históricos.",
                },
                {
                  icon: <Calendar className="h-6 w-6 text-purple-400" />,
                  title: "Produtividade e Agendamentos",
                  desc: "Visualize sua ocupação e disponibilidade para otimizar seu tempo e aumentar sua produtividade.",
                },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-purple-500/10 p-2 rounded-full">{icon}</div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">{title}</h4>
                    <p className="text-gray-300/80">{desc}</p>
                  </div>
                </div>
              ))}

              <Button 
                className="mt-4 bg-purple-600 text-white hover:bg-purple-700"
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
            <Card className="overflow-hidden border border-purple-500/20 backdrop-blur-sm shadow-2xl rounded-xl">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Dashboard financeiro para fotógrafos" 
                  className="w-full h-auto rounded-t-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-t-xl"></div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
