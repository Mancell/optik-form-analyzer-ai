
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useAnswers } from "@/contexts/AnswerContext";
import { ArrowLeft, Download } from "lucide-react";

const Results: React.FC = () => {
  const { studentInfo } = useAnswers();
  const navigate = useNavigate();

  // If no student info, redirect to home
  useEffect(() => {
    if (!studentInfo) {
      navigate("/");
    }
  }, [studentInfo, navigate]);

  return (
    <div className="container py-8 px-4 mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 hover:bg-muted/50"
      >
        <ArrowLeft className="h-4 w-4" /> Ana Sayfaya Dön
      </Button>
      
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Sonuç Analizi
        </h1>
        <p className="text-muted-foreground max-w-2xl mb-2">
          Öğrencinin cevaplarının detaylı analizi ve ders bazlı performans değerlendirmesi.
        </p>
        
        <Button variant="outline" className="mt-2 flex items-center gap-1">
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
