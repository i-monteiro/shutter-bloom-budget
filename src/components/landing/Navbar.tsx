import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-purple-400 font-bold text-2xl">Fotessence</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('recursos')}
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Recursos
          </button>
          <button 
            onClick={() => scrollToSection('produtos')} // Alterado de 'dashboard' para 'produtos'
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Produtos
          </button>
          <button 
            onClick={() => scrollToSection('agenda')}
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Agenda
          </button>
          <button 
            onClick={() => scrollToSection('depoimentos')}
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Depoimentos
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            FAQ
          </button>
          <Button 
            onClick={() => scrollToSection('contato')}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Teste Grátis
          </Button>
          
          {/* Botão de login para contas existentes */}
          <Link to="/login">
            <Button 
              variant="outline" 
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/login">
            <Button 
              variant="outline" 
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="flex flex-col py-4 px-6 space-y-4">
              <button 
                onClick={() => scrollToSection('recursos')}
                className="text-gray-300 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                Recursos
              </button>
              <button 
                onClick={() => scrollToSection('produtos')} // Alterado de 'dashboard' para 'produtos'
                className="text-gray-300 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                Produtos
              </button>
              <button 
                onClick={() => scrollToSection('agenda')}
                className="text-gray-300 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                Agenda
              </button>
              <button 
                onClick={() => scrollToSection('depoimentos')}
                className="text-gray-300 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                Depoimentos
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-gray-300 py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                FAQ
              </button>
              <Button 
                onClick={() => scrollToSection('contato')}
                className="bg-purple-600 text-white w-full"
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