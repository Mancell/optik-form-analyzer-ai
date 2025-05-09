
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CameraComponent from "@/components/Camera";
import { ArrowLeft, Info } from "lucide-react";

const Scan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 px-4 mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 hover:bg-muted/50"
      >
        <ArrowLeft className="h-4 w-4" /> Geri Dön
      </Button>
      
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Form Tarama
        </h1>
        <p className="text-muted-foreground max-w-2xl mb-6">
          Öğrenci formunu kamera ile tarayın veya galeriden bir fotoğraf yükleyin.
        </p>
        
        <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-lg border">
          <CameraComponent />
        </div>
        
        <Card className="mt-8 w-full max-w-lg border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-5 w-5 text-amber-500" />
              Optik Form Tarama İpuçları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li className="mb-1">Formu düz bir yüzeye yerleştirin</li>
              <li className="mb-1">İyi aydınlatılmış bir ortamda çekim yapın</li>
              <li className="mb-1">Formun tamamı kare içinde olsun</li>
              <li className="mb-1">Mümkün olduğunca dik açıyla çekim yapın</li>
              <li>Gölge ve parlama olmamasına dikkat edin</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scan;
