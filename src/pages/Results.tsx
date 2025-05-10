
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useAnswers } from "@/contexts/AnswerContext";
import { ArrowLeft, Download, Users, Table, ChartBar, ChartPie, History } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentStatistics from "@/components/StudentStatistics";
import ExamHistory from "@/components/ExamHistory";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";

// Sample class data generator
const generateClassData = () => {
  // Student count (random between 5 and 10)
  const studentCount = Math.floor(Math.random() * 6) + 5;
  
  // Generate student list
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
    },
    examHistory: Array(Math.floor(Math.random() * 4) + 1).fill(null).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i - 1);
      
      return {
        id: `exam-prev-${i}-${index}`,
        date: date.toISOString(),
        name: `${i + 1}. Deneme Sınavı`,
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
      };
    })
  }));
};

const Results: React.FC = () => {
  const { studentInfo, addExamToHistory } = useAnswers();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("student");
  const [classData, setClassData] = useState<any[]>([]);
  const [saveExamDialogOpen, setSaveExamDialogOpen] = useState(false);
  const [examName, setExamName] = useState(`Deneme Sınavı ${format(new Date(), "dd.MM.yyyy")}`);

  // Generate class data
  useEffect(() => {
    setClassData(generateClassData());
  }, []);

  // Redirect to home page if there's no student info
  useEffect(() => {
    if (!studentInfo) {
      navigate("/");
    }
  }, [studentInfo, navigate]);

  const handleSaveExam = () => {
    if (!examName.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen sınav adı girin.",
        variant: "destructive"
      });
      return;
    }

    addExamToHistory(examName);
    setSaveExamDialogOpen(false);
    
    toast({
      title: "Başarılı",
      description: "Sınav sonuçları kaydedildi.",
    });
  };

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
        
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className="flex items-center gap-1"
            onClick={() => setSaveExamDialogOpen(true)}
          >
            <History className="h-4 w-4" /> Sınavı Kaydet
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center gap-1">
            <Download className="h-4 w-4" /> PDF olarak indir
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto mx-auto mb-6">
            <TabsTrigger value="student" className="flex items-center gap-1">
              <ChartPie className="h-4 w-4" /> 
              <span className={isMobile ? "hidden" : "inline"}>Öğrenci</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Geçmiş</span>
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

          <TabsContent value="history" className="mt-0">
            <ExamHistory />
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

      <Dialog open={saveExamDialogOpen} onOpenChange={setSaveExamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sınavı Kaydet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="examName" className="text-sm font-medium mb-2 block">
              Sınav Adı
            </label>
            <Input
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Sınav adını girin"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveExamDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveExam}>
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;
