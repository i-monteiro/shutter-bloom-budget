import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contato');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      
      {/* Efeitos de partículas */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-indigo-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge lançamento */}
          <div className="mb-6 inline-block">
            <div className="flex items-center px-3 py-1 text-xs font-medium border border-purple-500/30 rounded-full bg-purple-500/10 text-purple-400 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
              Lançamento Beta 2024
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Simplifique a gestão do seu negócio de <span className="gradient-text">fotografia</span>
          </h1>
          <p className="text-xl text-gray-300/90 mb-8 md:pr-12">
            A plataforma completa para fotógrafos profissionais gerenciarem finanças, agenda e clientes em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={scrollToContactForm}
              size="lg" 
              className="bg-purple-600 text-white hover:bg-purple-700 text-lg group"
            >
              Experimente Grátis por 14 Dias
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 text-lg"
              onClick={() => document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conheça os Recursos
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Sem necessidade de cartão de crédito • Cancele quando quiser
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-xl overflow-hidden shadow-2xl border border-purple-500/20 backdrop-blur-sm">
            <img 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Fotógrafo profissional trabalhando com cliente" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-xl"></div>
          </div>

          {/* Card flutuante */}
          <motion.div 
            className="absolute -bottom-6 -left-6 bg-gray-900/90 p-4 rounded-lg shadow-lg border border-purple-500/30 backdrop-blur-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" className="text-purple-400">
                  <path d="M12 20v-6M6 20V10M18 20V4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Tenha mais controle</p>
                <p className="text-xl font-bold text-purple-400">da sua receita</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
