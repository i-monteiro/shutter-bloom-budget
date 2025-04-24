import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Fotessence</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              A solução completa para fotógrafos administrarem seus 
              negócios com eficiência, organização e praticidade.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <Button
                  key={idx}
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-purple-600/20 text-gray-300 hover:text-purple-400"
                >
                  <Icon size={20} />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { label: 'Recursos', id: 'recursos' },
                { label: 'Dashboard', id: 'dashboard' },
                { label: 'Agenda', id: 'agenda' },
                { label: 'FAQ', id: 'faq' },
              ].map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <a href="mailto:contato@fotogestao.com.br" className="hover:text-purple-400 transition-colors">
                  fotessence@automacaomachine.com.br
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone size={16} className="mr-2" />
                <a href="tel:+551199999999" className="hover:text-purple-400 transition-colors">
                  (19) 99152-8229
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Button
                onClick={() => scrollToSection('contato')}
                className="bg-purple-600 text-white hover:bg-purple-700 w-full"
              >
                Comece Agora
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div>
            © {new Date().getFullYear()} Fotessence. Todos os direitos reservados.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Política de Privacidade', 'Termos de Uso', 'Cookies'].map((text, idx) => (
              <a key={idx} href="#" className="hover:text-purple-400 transition-colors">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
