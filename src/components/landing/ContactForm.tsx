// ContactForm.tsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertLeadSchema, type InsertLead } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";
import { createLead } from "@/utils/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const ContactForm = () => {
  const { toast } = useToast();

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  /** 1º arg: objeto com mutationFn  + callbacks  */
  const mutation = useMutation({
    mutationFn: (values: InsertLead) => createLead(values),
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Confira seu WhatsApp em instantes.",
        duration: 5000,
      });
      form.reset();
    },
    onError: () =>
      toast({
        title: "Erro",
        description: "Falha ao enviar dados. Tente novamente.",
        variant: "destructive",
      }),
  });

  /** wrapper para casar com o tipo SubmitHandler */
  const onSubmit = (values: InsertLead) => mutation.mutate(values);

  return (
    <section id="contato" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* gradientes decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-40 w-60 h-60 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* COLUNA FORM */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/50 p-10 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm"
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-600/20 p-3 rounded-full mr-4">
                <Camera className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Experimente Grátis</h3>
            </div>
            <p className="text-gray-300 mb-8">
              Teste todas as funcionalidades do Fotessence por 14 dias, sem
              compromisso e sem necessidade de cartão de crédito.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seu nome completo"
                          className="bg-gray-900/50 border-gray-700 focus-visible:ring-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Telefone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Telefone</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className="bg-gray-900/50 border-gray-700 focus-visible:ring-purple-500 text-white pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="seu@email.com"
                          className="bg-gray-900/50 border-gray-700 focus-visible:ring-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botão enviar */}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg group glow-animation"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Enviando…" : "Começar Teste Gratuito"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </Form>

            {/* texto login / termos – igual ao seu código */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Já possui uma conta?</p>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 w-full"
                >
                  Entrar na sua conta
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Ao se cadastrar, você concorda com nossos <br />
              <a
                href="#"
                className="text-purple-400 underline hover:text-purple-300"
              >
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="#"
                className="text-purple-400 underline hover:text-purple-300"
              >
                Política de Privacidade
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Por Que Escolher o Fotessence?</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <p className="text-gray-300">
                  <span className="font-semibold text-purple-400">Feito especificamente para fotógrafos</span> - Desenvolvido por fotógrafos que entendem as necessidades do seu negócio
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <p className="text-gray-300">
                  <span className="font-semibold text-purple-400">Tudo integrado em uma única plataforma</span> - Agenda, finanças, clientes e documentos em um só lugar
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <p className="text-gray-300">
                  <span className="font-semibold text-purple-400">Economize tempo com automações</span> - Emails automáticos, lembretes e fluxos de trabalho personalizados
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  4
                </div>
                <p className="text-gray-300">
                  <span className="font-semibold text-purple-400">Aumente sua lucratividade</span> - Insights financeiros para tomar melhores decisões de negócio
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  5
                </div>
                <p className="text-gray-300">
                  <span className="font-semibold text-purple-400">Suporte especializado</span> - Nossa equipe está sempre disponível para ajudar você a ter sucesso
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-800/40 rounded-lg border border-gray-700">
              <h4 className="font-medium text-purple-400 mb-2">Venha transformar seus negócios</h4>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-gray-900/60 rounded-full text-sm text-gray-300">Fotografia de Casamento</div>
                <div className="px-3 py-1 bg-gray-900/60 rounded-full text-sm text-gray-300">Retratos</div>
                <div className="px-3 py-1 bg-gray-900/60 rounded-full text-sm text-gray-300">Newborn</div>
                <div className="px-3 py-1 bg-gray-900/60 rounded-full text-sm text-gray-300">Produtos</div>
                <div className="px-3 py-1 bg-gray-900/60 rounded-full text-sm text-gray-300">Eventos</div>
                <div className="px-3 py-1 bg-gray-900/60 rounded-full text-sm text-gray-300">Arquitetura</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;