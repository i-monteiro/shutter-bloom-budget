import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-white font-bold text-2xl">Fotessence</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { label: 'Recursos', id: 'recursos' },
            { label: 'Dashboard', id: 'dashboard' },
            { label: 'Agenda', id: 'agenda' },
            { label: 'Depoimentos', id: 'depoimentos' },
            { label: 'FAQ', id: 'faq' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {label}
            </button>
          ))}

          <Button
            onClick={() => scrollToSection('contato')}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Acessar
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-purple-500/10"
          >
            <div className="flex flex-col py-4 px-6 space-y-4 text-white">
              {[
                { label: 'Recursos', id: 'recursos' },
                { label: 'Dashboard', id: 'dashboard' },
                { label: 'Agenda', id: 'agenda' },
                { label: 'Depoimentos', id: 'depoimentos' },
                { label: 'FAQ', id: 'faq' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="py-2 px-4 rounded hover:bg-purple-600/10 transition-colors text-left"
                >
                  {label}
                </button>
              ))}

              <Button
                onClick={() => scrollToSection('contato')}
                className="bg-purple-600 text-white w-full hover:bg-purple-700"
              >
                Teste Grátis
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
