
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnswerKeyInput from "@/components/AnswerKeyInput";
import { useNavigate } from "react-router-dom";
import { Camera, BarChart2, PenLine } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Optik Form Analiz
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Önce cevap anahtarını girin, sonra öğrenci formunun fotoğrafını çekerek analiz sonuçlarını görüntüleyin.
        </p>
      </div>

      <div className="mb-12">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Cevap Anahtarı</CardTitle>
          </CardHeader>
          <CardContent>
            <AnswerKeyInput />
          </CardContent>
          <CardFooter className="flex justify-center pt-4 pb-6">
            <Button 
              onClick={() => navigate("/scan")} 
              size="lg" 
              className="w-full sm:w-auto px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
            >
              <Camera className="mr-2 h-5 w-5" /> Form Taramaya Başla
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <div className="h-2 bg-turkish"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-turkish" />
              <span>1. Cevap Anahtarı</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              4 ders (Türkçe, Sosyal, Matematik ve Fen) için doğru cevapları girin.
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <div className="h-2 bg-math"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-math" />
              <span>2. Form Tarama</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Öğrencinin doldurduğu optik formun fotoğrafını çekin veya yükleyin.
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <div className="h-2 bg-science"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-science" />
              <span>3. Sonuçlar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Doğru, yanlış ve boş sayılarını görüntüleyin ve performans analizine ulaşın.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
