
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useAnswers } from "@/contexts/AnswerContext";
import { ArrowLeft, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Results: React.FC = () => {
  const { studentInfo } = useAnswers();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // If no student info, redirect to home
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
        <ResultsDisplay />
      </div>
    </div>
  );
};

export default Results;
