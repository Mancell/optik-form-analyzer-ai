
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BarChart2, Camera, BookOpen, Github, Code, BookOpenCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useExamType } from "@/contexts/ExamTypeContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { examType, setExamType } = useExamType();

  return (
    <div className="container py-8 px-4 mx-auto min-h-screen">
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
          className="text-muted-foreground max-w-2xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Optik formları tarayın, sonuçları analiz edin ve öğrenci performansını takip edin.
        </motion.p>
        
        {/* Exam Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mb-6"
        >
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="font-medium mb-3">Sınav Türünü Seçin</p>
            <RadioGroup 
              value={examType}
              onValueChange={(value) => setExamType(value as "TYT" | "AYT")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TYT" id="tyt" />
                <Label htmlFor="tyt" className="cursor-pointer">TYT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AYT" id="ayt" />
                <Label htmlFor="ayt" className="cursor-pointer">AYT</Label>
              </div>
            </RadioGroup>
          </div>
        </motion.div>
        
        {/* Source Code Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mb-6"
        >
          <Button 
            onClick={() => window.open("https://lovable.dev/projects/701521c8-d263-49c7-8310-de7717e1adbf", "_blank")}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" /> 
            Kaynak Kodu Görüntüle
          </Button>
        </motion.div>
        
        {/* Arama çubuğu */}
        <motion.div 
          className="w-full max-w-md mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Öğrenci adı veya ID ile ara..." 
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  navigate("/results");
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Optik Form Tara",
            description: "Öğrenci cevap kağıdının fotoğrafını çekerek hızlıca sonuçları görüntüleyin.",
            icon: <Camera className="h-5 w-5" />,
            action: () => navigate("/scan")
          },
          {
            title: "Sonuçları Görüntüle",
            description: "Öğrenci performans analizlerini ve sınıf istatistiklerini görüntüleyin.",
            icon: <BarChart2 className="h-5 w-5" />,
            action: () => navigate("/results")
          },
          {
            title: "Cevap Anahtarı Oluştur",
            description: "Yeni bir sınav için cevap anahtarı oluşturun ve kaydedin.",
            icon: <BookOpen className="h-5 w-5" />,
            action: () => navigate("/")
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.2, duration: 0.5 }}
          >
            <Card className="overflow-hidden transition-all hover:shadow-md hover:scale-105 duration-300 cursor-pointer" onClick={item.action}>
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
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">Başla &rarr;</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Form Limits Information */}
      <motion.div 
        className="mt-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-medium mb-2">Form Giriş Bilgileri</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Bu uygulama şu anda şu formları destekler:
        </p>

        {examType === "TYT" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Türkçe</p>
              <p>40 soru</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Sosyal Bilimler</p>
              <p>20 soru</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Matematik</p>
              <p>40 soru</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Fen Bilimleri</p>
              <p>20 soru</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Türk Dili ve Edebiyatı-Sosyal Bilimler I</p>
              <p>40 soru</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Matematik</p>
              <p>40 soru</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Fen Bilimleri</p>
              <p>40 soru</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium mb-1">Sosyal Bilimler II</p>
              <p>40 soru</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
