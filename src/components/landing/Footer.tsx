import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <footer className="bg-[#2B3A67] text-white pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#FFC857] mb-4">FotoGestão</h3>
            <p className="text-white/80 mb-6 max-w-md">
              A solução completa para fotógrafos administrarem seus 
              negócios com eficiência, organização e praticidade.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-[#FFC857]">
                <Facebook size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-[#FFC857]">
                <Instagram size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-[#FFC857]">
                <Twitter size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 hover:text-[#FFC857]">
                <Linkedin size={20} />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('recursos')}
                  className="text-white/80 hover:text-[#FFC857] transition-colors"
                >
                  Recursos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('dashboard')}
                  className="text-white/80 hover:text-[#FFC857] transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('agenda')}
                  className="text-white/80 hover:text-[#FFC857] transition-colors"
                >
                  Agenda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-white/80 hover:text-[#FFC857] transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-white/80">
                <Mail size={16} className="mr-2" />
                <a href="mailto:contato@fotogestao.com.br" className="hover:text-[#FFC857] transition-colors">
                  contato@fotogestao.com.br
                </a>
              </li>
              <li className="flex items-center text-white/80">
                <Phone size={16} className="mr-2" />
                <a href="tel:+551199999999" className="hover:text-[#FFC857] transition-colors">
                  (11) 9999-9999
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Button
                onClick={() => scrollToSection('contato')}
                className="bg-[#FFC857] text-[#2B3A67] hover:bg-[#FFC857]/90 w-full"
              >
                Comece Agora
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="bg-white/20" />
        
        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <div>
            © {new Date().getFullYear()} FotoGestão. Todos os direitos reservados.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#FFC857] transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-[#FFC857] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#FFC857] transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;