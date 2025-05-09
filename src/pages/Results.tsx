
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useAnswers } from "@/contexts/AnswerContext";
import { ArrowLeft, Download, Users, Table, ChartBar, ChartPie } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentStatistics from "@/components/StudentStatistics";

// Örnek sınıf verisi oluşturmak için yardımcı fonksiyon
const generateClassData = () => {
  // Öğrenci sayısı (5 ila 10 arası rastgele)
  const studentCount = Math.floor(Math.random() * 6) + 5;
  
  // Öğrenci listesi oluştur
  return Array(studentCount).fill(null).map((_, index) => ({
    id: `ST${100 + index}`,
    name: `Öğrenci ${index + 1}`,
    results: {
      turkish: {
        correct: Math.floor(Math.random() * 20) + 5,
        incorrect: Math.floor(Math.random() * 15),
        empty: Math.floor(Math.random() * 10),
        total: 30
      },
      social: {
        correct: Math.floor(Math.random() * 20) + 5,
        incorrect: Math.floor(Math.random() * 15),
        empty: Math.floor(Math.random() * 10),
        total: 30
      },
      math: {
        correct: Math.floor(Math.random() * 20) + 5,
        incorrect: Math.floor(Math.random() * 15),
        empty: Math.floor(Math.random() * 10),
        total: 30
      },
      science: {
        correct: Math.floor(Math.random() * 20) + 5,
        incorrect: Math.floor(Math.random() * 15),
        empty: Math.floor(Math.random() * 10),
        total: 30
      }
    }
  }));
};

const Results: React.FC = () => {
  const { studentInfo } = useAnswers();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("student");
  const [classData, setClassData] = useState<any[]>([]);

  // Sınıf verisi oluştur
  useEffect(() => {
    setClassData(generateClassData());
  }, []);

  // Eğer öğrenci bilgisi yoksa ana sayfaya yönlendir
  useEffect(() => {
    if (!studentInfo) {
      navigate("/");
    }
  }, [studentInfo, navigate]);

  return (
    <div className="container py-6 px-3 md:py-8 md:px-4 mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        size={isMobile ? "sm" : "default"}
        className="mb-4 md:mb-6 flex items-center gap-2 hover:bg-muted/50"
      >
        <ArrowLeft className="h-4 w-4" /> Ana Sayfaya Dön
      </Button>
      
      <div className="flex flex-col items-center justify-center mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Sonuç Analizi
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-2">
          Öğrencinin cevaplarının detaylı analizi ve ders bazlı performans değerlendirmesi.
        </p>
        
        <Button variant="outline" size={isMobile ? "sm" : "default"} className="mt-2 flex items-center gap-1">
          <Download className="h-4 w-4" /> PDF olarak indir
        </Button>
      </div>
      
      <div className="mb-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-auto mx-auto mb-6">
            <TabsTrigger value="student" className="flex items-center gap-1">
              <ChartPie className="h-4 w-4" /> 
              <span className={isMobile ? "hidden" : "inline"}>Öğrenci</span>
            </TabsTrigger>
            <TabsTrigger value="class" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Sınıf</span>
            </TabsTrigger>
            <TabsTrigger value="school" className="flex items-center gap-1">
              <Table className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Okul</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="student" className="mt-0">
            <ResultsDisplay />
          </TabsContent>
          
          <TabsContent value="class" className="mt-0">
            <StudentStatistics 
              title="Sınıf İstatistikleri" 
              students={classData} 
              type="class" 
            />
          </TabsContent>

          <TabsContent value="school" className="mt-0">
            <StudentStatistics 
              title="Okul İstatistikleri" 
              students={[...classData, ...generateClassData()]} 
              type="school" 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;
