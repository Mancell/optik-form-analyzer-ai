import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import AnswerKeyInput from "@/components/AnswerKeyInput";
import AnswerKeyImport from "@/components/AnswerKeyImport";
import ExamTypeSelector from "@/components/ExamTypeSelector";
import { useNavigate } from "react-router-dom";
import { Camera, BarChart2, PenLine, Search } from "lucide-react";
import { useAnswers } from "@/contexts/AnswerContext";
import { useExamType } from "@/contexts/ExamTypeContext";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";

const DEFAULT_API_KEY = "AIzaSyAw7CDaiZuQKn60ISltYTnzi18HvX2OQ3I";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { examType } = useExamType();
  const { setStudentInfo } = useAnswers();
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pre-save the Gemini API key when the app loads
  useEffect(() => {
    const savedKey = localStorage.getItem("geminiApiKey");
    if (!savedKey) {
      localStorage.setItem("geminiApiKey", DEFAULT_API_KEY);
      toast.success("Gemini API anahtarı otomatik olarak ayarlandı");
    }
  }, []);

  // Function to create sample student data and navigate to results
  const handleViewSampleResults = () => {
    // Generate sample student answers based on exam type
    let sampleStudentInfo;
    
    if (examType === "TYT") {
      sampleStudentInfo = {
        name: "Örnek Öğrenci",
        studentAnswers: {
          turkish: Array(40).fill("").map(() => ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)] as "A" | "B" | "C" | "D" | "E" | ""),
          social: Array(20).fill("").map(() => ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)] as "A" | "B" | "C" | "D" | "E" | ""),
          math: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as "A" | "B" | "C" | "D" | "E" | ""),
          science: Array(20).fill("").map(() => ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)] as "A" | "B" | "C" | "D" | "E" | ""),
        }
      };
    } else {
      sampleStudentInfo = {
        name: "Örnek Öğrenci",
        studentAnswers: {
          turkishSocial: Array(40).fill("").map(() => ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)] as "A" | "B" | "C" | "D" | "E" | ""),
          math: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as "A" | "B" | "C" | "D" | "E" | ""),
          science: Array(40).fill("").map(() => ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)] as "A" | "B" | "C" | "D" | "E" | ""),
          socialII: Array(40).fill("").map(() => ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)] as "A" | "B" | "C" | "D" | "E" | ""),
        }
      };
    }
    
    // Set student info and navigate to results
    setStudentInfo(sampleStudentInfo);
    toast.success("Örnek sonuçlar hazırlanıyor...");
    navigate("/results");
  };

  // Arama işlemi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success("Öğrenci aranıyor: " + searchQuery);
      navigate("/results");
    } else {
      toast.error("Lütfen bir arama terimi girin");
    }
  };

  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Optik Form Analiz
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Önce cevap anahtarı girin, sonra öğrenci formunun fotoğrafını çekerek analiz sonuçlarını görüntüleyin.
        </motion.p>
        
        {/* Arama çubuğu */}
        <motion.form 
          className="w-full max-w-md mt-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleSearch}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Öğrenci adı veya ID ile ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.form>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mt-3"
        >
          <Button 
            onClick={handleViewSampleResults}
            variant="outline"
            className="bg-gradient-to-r from-primary/20 to-primary/5"
          >
            <BarChart2 className="mr-2 h-4 w-4" /> 
            Örnek {examType} Sonuçlarını Görüntüle
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <ExamTypeSelector />
      </motion.div>

      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Card className={`shadow-lg border-t-4 ${examType === "TYT" ? "border-t-[hsl(var(--tyt-theme))]" : "border-t-[hsl(var(--ayt-theme))]"}`}>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {examType} Cevap Anahtarı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" value={activeTab} onValueChange={(value) => setActiveTab(value as "manual" | "import")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual">Manuel Giriş</TabsTrigger>
                <TabsTrigger value="import">PDF/Kamera ile İçe Aktar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-0">
                <AnswerKeyInput />
              </TabsContent>
              
              <TabsContent value="import" className="mt-0">
                <AnswerKeyImport />
                <AnswerKeyInput />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center pt-4 pb-6">
            <Button 
              onClick={() => navigate("/scan")} 
              variant="particle"
              size="lg" 
              className={`w-full sm:w-auto px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all ${examType === "TYT" ? "bg-[hsl(var(--tyt-theme))]" : "bg-[hsl(var(--ayt-theme))]"} text-white`}
            >
              <Camera className="mr-2 h-5 w-5" /> Form Taramaya Başla
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            color: "turkish",
            icon: <PenLine className="h-5 w-5 text-turkish" />,
            title: "1. Cevap Anahtarı",
            description: `${examType} sınavı için tüm dersler için doğru cevapları girin.`
          },
          {
            color: "math",
            icon: <Camera className="h-5 w-5 text-math" />,
            title: "2. Form Tarama",
            description: "Öğrencinin doldurduğu optik formun fotoğrafını çekin veya yükleyin."
          },
          {
            color: "science",
            icon: <BarChart2 className="h-5 w-5 text-science" />,
            title: "3. Sonuçlar",
            description: "Doğru, yanlış ve boş sayılarını görüntüleyin ve performans analizine ulaşın."
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
          >
            <Card className="overflow-hidden transition-all hover:shadow-md hover:scale-105 duration-300">
              <div className={`h-2 bg-${item.color}`}></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
