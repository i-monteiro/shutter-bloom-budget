import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { 
  Camera, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  BarChart3 
} from 'lucide-react';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const problems = [
    {
      icon: <Clock className="h-10 w-10 text-[#496A81]" />,
      title: "Desperdício de Tempo",
      description: "Horas perdidas com tarefas administrativas que poderiam ser dedicadas à fotografia"
    },
    {
      icon: <DollarSign className="h-10 w-10 text-[#496A81]" />,
      title: "Controle Financeiro Caótico",
      description: "Dificuldade em acompanhar pagamentos, despesas e lucratividade dos projetos"
    },
    {
      icon: <Calendar className="h-10 w-10 text-[#496A81]" />,
      title: "Agendamentos Desorganizados",
      description: "Conflitos de horários e dificuldade em gerenciar múltiplas sessões fotográficas"
    },
    {
      icon: <Users className="h-10 w-10 text-[#496A81]" />,
      title: "Relacionamento com Clientes",
      description: "Falhas no acompanhamento e na comunicação com clientes novos e recorrentes"
    }
  ];

  const solutions = [
    {
      icon: <BarChart3 className="h-10 w-10 text-[#FFC857]" />,
      title: "Dashboard Intuitivo",
      description: "Visualize seus dados financeiros e de agendamento em um painel personalizado"
    },
    {
      icon: <Calendar className="h-10 w-10 text-[#FFC857]" />,
      title: "Agenda Integrada",
      description: "Sistema completo de agendamento com lembretes automáticos para você e seus clientes"
    },
    {
      icon: <Receipt className="h-10 w-10 text-[#FFC857]" />,
      title: "Controle Financeiro",
      description: "Gerencie receitas, despesas e gere relatórios detalhados sobre seu negócio"
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-[#FFC857]" />,
      title: "Automatização de Processos",
      description: "Economize tempo com automação de e-mails, contratos e fluxos de trabalho"
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-[#F4EBD9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold text-[#2B3A67] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Transforme a Gestão do Seu Negócio de Fotografia
          </motion.h2>
          <motion.p 
            className="text-xl text-[#4A4A4A]/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Entendemos as dificuldades que os fotógrafos enfrentam ao administrar seus negócios.
            Nossa plataforma foi criada para resolver essas dores.
          </motion.p>
        </div>

        <div className="mb-24">
          <motion.h3 
            className="text-2xl font-semibold text-[#2B3A67] mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            As 4 Principais Dores dos Fotógrafos Profissionais
          </motion.h3>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {problems.map((problem, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-[#496A81]/20">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-[#496A81]/10 rounded-full mb-4">
                      {problem.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-[#2B3A67] mb-2">{problem.title}</h4>
                    <p className="text-[#4A4A4A]/80">{problem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <motion.h3 
            className="text-2xl font-semibold text-[#2B3A67] mb-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Nossas Soluções para Transformar seu Negócio
          </motion.h3>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {solutions.map((solution, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-[#FFC857]/20 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="p-4 bg-[#FFC857]/10 rounded-full mb-4">
                      {solution.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-[#2B3A67] mb-2">{solution.title}</h4>
                    <p className="text-[#4A4A4A]/80">{solution.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;