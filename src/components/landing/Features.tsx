import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      icon: <Clock className="h-10 w-10 text-purple-400" />,
      title: "Desperdício de Tempo",
      description: "Horas perdidas com tarefas administrativas que poderiam ser dedicadas à fotografia"
    },
    {
      icon: <DollarSign className="h-10 w-10 text-purple-400" />,
      title: "Controle Financeiro Caótico",
      description: "Dificuldade em acompanhar pagamentos, despesas e lucratividade dos projetos"
    },
    {
      icon: <Calendar className="h-10 w-10 text-purple-400" />,
      title: "Agendamentos Desorganizados",
      description: "Conflitos de horários e dificuldade em gerenciar múltiplas sessões fotográficas"
    },
    {
      icon: <Users className="h-10 w-10 text-purple-400" />,
      title: "Relacionamento com Clientes",
      description: "Falhas no acompanhamento e na comunicação com clientes novos e recorrentes"
    }
  ];

  const solutions = [
    {
      icon: <BarChart3 className="h-10 w-10 text-purple-400" />,
      title: "Dashboard Intuitivo",
      description: "Visualize seus dados financeiros e de agendamento em um painel personalizado"
    },
    {
      icon: <Calendar className="h-10 w-10 text-purple-400" />,
      title: "Agenda Integrada",
      description: "Sistema completo de agendamento com lembretes automáticos para você e seus clientes"
    },
    {
      icon: <Receipt className="h-10 w-10 text-purple-400" />,
      title: "Controle Financeiro",
      description: "Gerencie receitas, despesas e gere relatórios detalhados sobre seu negócio"
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-purple-400" />,
      title: "Automatização de Processos",
      description: "Economize tempo com automação de e-mails, contratos e fluxos de trabalho"
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Bolhas visuais */}
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
            Transforme a Gestão do Seu Negócio de Fotografia
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Entendemos as dificuldades que os fotógrafos enfrentam ao administrar seus negócios.
            Nossa plataforma foi criada para resolver essas dores.
          </motion.p>
        </div>

        {/* Dores */}
        <div className="mb-24">
          <motion.h3
            className="text-2xl font-semibold text-white mb-12 text-center"
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
                <Card className="h-full bg-gray-800 border border-purple-500/20 hover:shadow-lg transition-shadow backdrop-blur-sm">
                  <CardContent className="pt-6 flex flex-col items-center text-center text-gray-300">
                    <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                      {problem.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{problem.title}</h4>
                    <p className="text-gray-300/80">{problem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Soluções */}
        <div>
          <motion.h3
            className="text-2xl font-semibold text-white mb-12 text-center"
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
                <Card className="h-full bg-gray-800 border border-purple-500/20 hover:shadow-lg transition-shadow backdrop-blur-sm">
                  <CardContent className="pt-6 flex flex-col items-center text-center text-gray-300">
                    <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                      {solution.icon}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{solution.title}</h4>
                    <p className="text-gray-300/80">{solution.description}</p>
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
