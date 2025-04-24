import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana Clara",
      role: "Fotógrafa de Casamentos",
      avatar: "AC",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "Antes do FotoGestão, eu perdia horas com planilhas e calendários. Agora tenho tudo organizado em um só lugar. Minha produtividade aumentou e consigo focar no que realmente importa: fazer fotos incríveis!"
    },
    {
      name: "Ricardo Oliveira",
      role: "Fotógrafo de Produtos",
      avatar: "RO",
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "O controle financeiro me ajudou a entender quais tipos de sessões são mais rentáveis. Em apenas 3 meses, aumentei meu faturamento em 35% focando nos serviços certos."
    },
    {
      name: "Fernanda Santos",
      role: "Fotógrafa de Retratos",
      avatar: "FS",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "O sistema de agendamento online reduziu drasticamente o vai-e-vem de mensagens para marcação de sessões. Meus clientes adoram a praticidade e eu economizo um tempo precioso."
    }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold text-[#2B3A67] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            O Que Dizem Nossos Clientes
          </motion.h2>
          <motion.p 
            className="text-xl text-[#4A4A4A]/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Centenas de fotógrafos já transformaram seus negócios com nossa plataforma.
            Veja o que eles têm a dizer.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-[#496A81]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4 border-2 border-[#FFC857]">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-[#FFC857]/20 text-[#FFC857]">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-[#2B3A67]">{testimonial.name}</h4>
                      <p className="text-sm text-[#4A4A4A]/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFC857" className="inline-block mr-1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#4A4A4A]/80 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;