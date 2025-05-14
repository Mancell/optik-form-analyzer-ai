
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CameraComponent from "@/components/Camera";
import { ArrowLeft, Info, Upload } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnswers, StudentInfo, Option } from "@/contexts/AnswerContext";
import { toast } from "@/components/ui/use-toast";

const Scan: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setStudentInfo } = useAnswers();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast({
      title: "Form İşleniyor",
      description: "Yüklenen form analiz ediliyor, lütfen bekleyin...",
    });

    // Simulate processing delay
    setTimeout(() => {
      // Generate mock student data with random answers
      const mockStudentName = "Mehmet Yılmaz";
      const mockAnswers = {
        turkish: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
        social: Array(20).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
        math: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
        science: Array(20).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option)
      };

      // Create student info object
      const studentInfo: StudentInfo = {
        name: mockStudentName,
        studentAnswers: mockAnswers
      };

      // Update context with student info
      setStudentInfo(studentInfo);
      setIsProcessing(false);
      
      toast({
        title: "İşlem Tamamlandı",
        description: "Form başarıyla analiz edildi.",
      });

      // Navigate to results page
      navigate("/results");
    }, 2000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container py-6 px-3 md:py-8 md:px-4 mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        size={isMobile ? "sm" : "default"}
        className="mb-4 md:mb-6 flex items-center gap-2 hover:bg-muted/50"
      >
        <ArrowLeft className="h-4 w-4" /> Geri Dön
      </Button>
      
      <div className="flex flex-col items-center justify-center mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Form Tarama
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-4 md:mb-6">
          Öğrenci formunu kamera ile tarayın veya galeriden bir fotoğraf yükleyin.
        </p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            variant="default" 
            onClick={() => {}}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            Taramaya Başla
          </Button>

          <Button 
            variant="outline"
            onClick={handleUploadClick}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4" /> Form Yükle
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </Button>
        </div>
        
        <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-lg border">
          <CameraComponent />
        </div>
        
        <Card className="mt-6 md:mt-8 w-full max-w-lg border-l-4 border-l-amber-500">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Info className="h-5 w-5 text-amber-500" />
              Optik Form Tarama İpuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="list-disc list-inside space-y-1 md:space-y-2 text-xs md:text-sm">
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
