
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CameraComponent from "@/components/Camera";
import { ArrowLeft } from "lucide-react";

const Scan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 px-4 mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
      </Button>
      
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Form Tarama</h1>
        <p className="text-muted-foreground max-w-2xl mb-6">
          Öğrenci formunu kamera ile tarayın veya galeriden bir fotoğraf yükleyin.
        </p>
        
        <div className="w-full max-w-lg">
          <CameraComponent />
        </div>
        
        <Card className="mt-8 w-full max-w-lg">
          <CardHeader>
            <CardTitle>Optik Form Tarama İpuçları</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Formu düz bir yüzeye yerleştirin</li>
              <li>İyi aydınlatılmış bir ortamda çekim yapın</li>
              <li>Formun tamamı kare içinde olsun</li>
              <li>Mümkün olduğunca dik açıyla çekim yapın</li>
              <li>Gölge ve parlama olmamasına dikkat edin</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scan;
