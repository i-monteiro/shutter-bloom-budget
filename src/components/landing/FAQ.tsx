import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona o período de teste gratuito?",
      answer: "Você tem acesso a todas as funcionalidades da plataforma por 14 dias, sem necessidade de cartão de crédito. Após esse período, você pode escolher um de nossos planos para continuar utilizando o sistema."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura quando desejar. Não há contratos de longo prazo ou taxas de cancelamento."
    },
    {
      question: "O sistema funciona em dispositivos móveis?",
      answer: "Sim, nossa plataforma é totalmente responsiva e pode ser acessada de qualquer dispositivo: computadores, tablets e smartphones."
    },
    {
      question: "Preciso instalar algum software no meu computador?",
      answer: "Não, o Fotoessence é uma aplicação web que funciona diretamente no navegador. Não é necessário instalar nenhum software adicional."
    },
    {
      question: "Meus dados estão seguros na plataforma?",
      answer: "Sim, utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da informação para proteger todos os seus dados."
    },
    {
      question: "O sistema permite integração com outros aplicativos?",
      answer: "Sim, oferecemos integração com Google Calendar, Microsoft Outlook, QuickBooks, sistemas de e-mail marketing e várias outras ferramentas populares."
    },
    {
      question: "Existe um limite de clientes ou projetos que posso gerenciar?",
      answer: "Não há limites. Nossos planos são baseados em usuários, não no volume de dados, então você pode gerenciar quantos clientes e projetos precisar."
    },
    {
      question: "Vocês oferecem suporte técnico?",
      answer: "Sim, oferecemos suporte por e-mail, chat e telefone em todos os planos. Além disso, temos uma extensa base de conhecimento e tutoriais em vídeo."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Partículas roxas no fundo */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute top-60 -left-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-20 w-40 h-40 bg-indigo-700/20 rounded-full blur-3xl z-0"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Perguntas Frequentes
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Tire suas dúvidas sobre o Fotoessence e descubra como nossa plataforma pode ajudar seu negócio de fotografia.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="bg-gray-800 border border-purple-500/20 rounded-lg shadow-xl">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-purple-500/10 last:border-none">
                <AccordionTrigger className="px-6 py-4 text-purple-400 font-medium text-left hover:bg-purple-500/10 hover:no-underline transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-1 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
