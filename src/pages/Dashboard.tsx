import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  FileText, 
  Users, 
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: string;
  className?: string;
}

const StatsCard = ({ title, value, description, icon: Icon, trend, className }: StatsCardProps) => {
  const isTrendUp = trend.startsWith('+');
  
  return (
    <Card className={`border-gray-800 bg-gray-900/40 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
          <div className="bg-gray-800/50 p-2 rounded-full">
            <Icon className="h-4 w-4 text-purple-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center mt-1">
          <span className={`text-xs font-medium flex items-center ${isTrendUp ? 'text-green-500' : 'text-red-500'}`}>
            {isTrendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trend}
          </span>
          <span className="text-xs text-gray-400 ml-2">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActionButtonProps {
  to: string;
  icon: React.ElementType;
  label: string;
  description: string;
}

const ActionButton = ({ to, icon: Icon, label, description }: ActionButtonProps) => (
  <Link to={to} className="block">
    <div className="flex items-center gap-4 p-4 bg-gray-800/40 border border-gray-800 rounded-lg hover:bg-gray-800/60 transition-colors">
      <div className="bg-purple-600/20 p-3 rounded-full">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium">{label}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400" />
    </div>
  </Link>
);

const Dashboard = () => {
  // Dados fictícios para os cards de estatísticas
  const stats = [
    {
      title: 'Orçamentos pendentes',
      value: '12',
      description: 'vs. mês passado',
      icon: FileText,
      trend: '+4.5%',
    },
    {
      title: 'Eventos agendados',
      value: '8',
      description: 'próximos 30 dias',
      icon: Calendar,
      trend: '+12.3%',
    },
    {
      title: 'Novos clientes',
      value: '5',
      description: 'este mês',
      icon: Users,
      trend: '-2.3%',
    },
    {
      title: 'Receita mensal',
      value: 'R$ 8.650',
      description: 'maio 2023',
      icon: CreditCard,
      trend: '+18.2%',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Bem-vindo ao seu painel de controle</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/budgets/new">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Novo orçamento
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Ações rápidas */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionButton
            to="/app/budgets/new"
            icon={FileText}
            label="Criar novo orçamento"
            description="Adicione um novo orçamento para seus clientes"
          />
          <ActionButton
            to="/app/events"
            icon={Calendar}
            label="Gerenciar agenda"
            description="Visualize e organize seus eventos"
          />
        </div>
      </div>
      
      {/* Orçamentos recentes e próximos eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orçamentos recentes */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Orçamentos recentes</CardTitle>
              <Link to="/app/budgets">
                <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
                  Ver todos
                </Button>
              </Link>
            </div>
            <CardDescription>
              Últimos orçamentos criados ou atualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Item de orçamento */}
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-800/60">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">João Silva</h3>
                    <p className="text-gray-400 text-sm">Casamento - 20/08/2023</p>
                  </div>
                  <div className="bg-yellow-500/20 text-yellow-500 text-xs font-medium px-2 py-1 rounded-full border border-yellow-500/20">
                    Pendente
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-300 font-medium">R$ 3.500,00</span>
                  <Link to="/app/budgets/edit/1">
                    <Button size="sm" variant="outline" className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-purple-400">
                      Visualizar
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Item de orçamento */}
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-800/60">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">Maria Souza</h3>
                    <p className="text-gray-400 text-sm">Aniversário - 05/09/2023</p>
                  </div>
                  <div className="bg-blue-500/20 text-blue-500 text-xs font-medium px-2 py-1 rounded-full border border-blue-500/20">
                    Enviado
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-300 font-medium">R$ 1.800,00</span>
                  <Link to="/app/budgets/edit/2">
                    <Button size="sm" variant="outline" className="h-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-purple-400">
                      Visualizar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Próximos eventos */}
        <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Próximos eventos</CardTitle>
              <Link to="/app/events">
                <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
                  Ver agenda
                </Button>
              </Link>
            </div>
            <CardDescription>
              Seus eventos agendados para os próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Item de evento */}
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-800/60">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-700 rounded-lg text-center p-2 w-14">
                    <span className="text-gray-400 text-xs block">JUL</span>
                    <span className="text-xl font-bold text-white">15</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">Evento Corporativo</h3>
                    <p className="text-gray-400 text-sm">Empresa XYZ - 14:00</p>
                    <div className="mt-2">
                      <span className="inline-block bg-purple-500/20 text-purple-400 text-xs font-medium px-2 py-1 rounded-full border border-purple-500/20">
                        Confirmado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Item de evento */}
              <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-800/60">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-700 rounded-lg text-center p-2 w-14">
                    <span className="text-gray-400 text-xs block">JUL</span>
                    <span className="text-xl font-bold text-white">20</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">Casamento João e Ana</h3>
                    <p className="text-gray-400 text-sm">Buffet Central - 16:30</p>
                    <div className="mt-2">
                      <span className="inline-block bg-yellow-500/20 text-yellow-500 text-xs font-medium px-2 py-1 rounded-full border border-yellow-500/20">
                        Aguardando confirmação
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;