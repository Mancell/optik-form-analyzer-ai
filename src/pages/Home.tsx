
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AnswerKeyInput from "@/components/AnswerKeyInput";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Optik Form Analiz</h1>
        <p className="text-muted-foreground max-w-2xl">
          Önce cevap anahtarını girin, sonra öğrenci formunun fotoğrafını çekerek analiz sonuçlarını görüntüleyin.
        </p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Cevap Anahtarı</CardTitle>
          </CardHeader>
          <CardContent>
            <AnswerKeyInput />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate("/scan")} 
              size="lg" 
              className="w-full sm:w-auto"
            >
              <Camera className="mr-2 h-4 w-4" /> Form Taramaya Başla
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Cevap Anahtarı</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              4 ders (Türkçe, Sosyal, Matematik ve Fen) için doğru cevapları girin.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Form Tarama</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Öğrencinin doldurduğu optik formun fotoğrafını çekin veya yükleyin.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Sonuçlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Doğru, yanlış ve boş sayılarını görüntüleyin ve performans analizine ulaşın.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
