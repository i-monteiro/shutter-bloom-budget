import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon,
  Clock,
  Bell,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const CalendarSection = () => {
  return (
    <section id="agenda" className="py-20 bg-[#F4EBD9]/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold text-[#2B3A67] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Sistema de Agenda Integrado
          </motion.h2>
          <motion.p 
            className="text-xl text-[#4A4A4A]/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Gerencie seus agendamentos e clientes em um sistema completo
            que se integra com suas ferramentas favoritas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-[#496A81]/20 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Sistema de agenda para fotógrafos" 
                className="w-full h-auto rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg"></div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-[#2B3A67] mb-6">Controle Total da Sua Agenda</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Agendamento Simplificado</h4>
                  <p className="text-[#4A4A4A]/80">Permita que clientes marquem sessões diretamente pelo seu site, com confirmação automática e controle de disponibilidade.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Organização de Horários</h4>
                  <p className="text-[#4A4A4A]/80">Defina sua disponibilidade, bloqueie horários para produção e evite conflitos de agendamentos.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <Bell className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Lembretes Automáticos</h4>
                  <p className="text-[#4A4A4A]/80">Envie lembretes por e-mail e SMS para você e seus clientes, reduzindo cancelamentos e no-shows.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#FFC857]/10 p-2 rounded-full">
                  <MessageSquare className="h-6 w-6 text-[#FFC857]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-[#2B3A67] mb-1">Comunicação Integrada</h4>
                  <p className="text-[#4A4A4A]/80">Mantenha toda a comunicação com o cliente organizada em um só lugar, desde o primeiro contato até a entrega final.</p>
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
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;