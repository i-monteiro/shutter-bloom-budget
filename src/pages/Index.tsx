
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fcfcd7] to-white">
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#67be9b]">
          ShutterBloom
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-700">
          Gerencie seus orçamentos fotográficos com facilidade e elegância
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/budgets')}
            className="bg-[#67be9b] hover:bg-[#95d0b8] text-white px-8 py-6 text-lg rounded-xl"
          >
            Ver Orçamentos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline" 
              className="border-[#67be9b] text-[#67be9b] hover:bg-[#fcfcd7] px-8 py-6 text-lg rounded-xl"
            >
              Ir para o Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
