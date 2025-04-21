
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do sistema.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como você deseja receber as notificações.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">E-mail para novos orçamentos</p>
                <p className="text-sm text-muted-foreground">
                  Receba notificações por e-mail quando um novo orçamento for criado.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Lembretes de eventos</p>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes sobre eventos próximos.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Relatórios semanais</p>
                <p className="text-sm text-muted-foreground">
                  Receba relatórios semanais com métricas importantes.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-primary" onClick={handleSave}>
              Salvar configurações
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup de Dados</CardTitle>
            <CardDescription>
              Gerencie os backups dos seus dados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Backup automático</p>
                <p className="text-sm text-muted-foreground">
                  Realize backups automáticos dos seus dados.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Frequência de backup</p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="bg-primary-light/10">Diário</Button>
                <Button variant="outline">Semanal</Button>
                <Button variant="outline">Mensal</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Exportar Dados</Button>
            <Button className="bg-primary" onClick={handleSave}>
              Salvar configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
