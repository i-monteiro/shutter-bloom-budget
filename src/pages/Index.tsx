import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <div className="text-center max-w-3xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(153,47%,56%)]">
          ShutterBloom
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
          Gerencie seus orçamentos fotográficos com facilidade e elegância
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/budgets')}
            className="bg-[hsl(153,47%,56%)] hover:bg-[hsl(153,47%,70%)] text-white px-8 py-6 text-lg rounded-xl"
          >
            Ver Orçamentos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-[hsl(153,47%,56%)] text-[hsl(153,47%,56%)] hover:bg-[hsl(60,89%,90%)] px-8 py-6 text-lg rounded-xl"
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
