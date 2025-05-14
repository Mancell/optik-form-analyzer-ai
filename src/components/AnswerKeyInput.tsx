
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Option, useAnswers } from "@/contexts/AnswerContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useExamType } from "@/contexts/ExamTypeContext";

interface AnswerSectionProps {
  subject: string;
  subjectLabel: string;
  colorClass: string;
  questionCount: number;
}

const AnswerKeyInput: React.FC = () => {
  const { examType } = useExamType();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {examType === "TYT" ? <TytAnswerKeyInput /> : <AytAnswerKeyInput />}
    </div>
  );
};

const TytAnswerKeyInput: React.FC = () => {
  return (
    <Tabs defaultValue="turkish" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="turkish" className="text-turkish">
          Türkçe
        </TabsTrigger>
        <TabsTrigger value="social" className="text-social">
          Sosyal Bilimler
        </TabsTrigger>
        <TabsTrigger value="math" className="text-math">
          Matematik
        </TabsTrigger>
        <TabsTrigger value="science" className="text-science">
          Fen Bilimleri
        </TabsTrigger>
      </TabsList>

      <TabsContent value="turkish">
        <AnswerSection subject="turkish" subjectLabel="Türkçe" colorClass="subject-turkish" questionCount={40} examType="TYT" />
      </TabsContent>
      
      <TabsContent value="social">
        <AnswerSection subject="social" subjectLabel="Sosyal Bilimler" colorClass="subject-social" questionCount={20} examType="TYT" />
      </TabsContent>
      
      <TabsContent value="math">
        <AnswerSection subject="math" subjectLabel="Matematik" colorClass="subject-math" questionCount={40} examType="TYT" />
      </TabsContent>
      
      <TabsContent value="science">
        <AnswerSection subject="science" subjectLabel="Fen Bilimleri" colorClass="subject-science" questionCount={20} examType="TYT" />
      </TabsContent>
    </Tabs>
  );
};

const AytAnswerKeyInput: React.FC = () => {
  return (
    <Tabs defaultValue="turkishSocial" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="turkishSocial" className="text-turkish">
          TDE-Sosyal I
        </TabsTrigger>
        <TabsTrigger value="math" className="text-math">
          Matematik
        </TabsTrigger>
        <TabsTrigger value="science" className="text-science">
          Fen Bilimleri
        </TabsTrigger>
        <TabsTrigger value="socialII" className="text-social">
          Sosyal II
        </TabsTrigger>
      </TabsList>

      <TabsContent value="turkishSocial">
        <AnswerSection subject="turkishSocial" subjectLabel="Türk Dili ve Edebiyatı-Sosyal Bilimler I" colorClass="subject-turkish" questionCount={40} examType="AYT" />
      </TabsContent>
      
      <TabsContent value="math">
        <AnswerSection subject="math" subjectLabel="Matematik" colorClass="subject-math" questionCount={40} examType="AYT" />
      </TabsContent>
      
      <TabsContent value="science">
        <AnswerSection subject="science" subjectLabel="Fen Bilimleri" colorClass="subject-science" questionCount={40} examType="AYT" />
      </TabsContent>
      
      <TabsContent value="socialII">
        <AnswerSection subject="socialII" subjectLabel="Sosyal Bilimler II" colorClass="subject-social" questionCount={40} examType="AYT" />
      </TabsContent>
    </Tabs>
  );
};

const AnswerSection: React.FC<AnswerSectionProps & { examType: "TYT" | "AYT" }> = ({ subject, subjectLabel, colorClass, questionCount, examType }) => {
  const { tytAnswerKey, setTytAnswerKey, aytAnswerKey, setAytAnswerKey } = useAnswers();
  
  const subjectAnswers = examType === "TYT" 
    ? tytAnswerKey[subject as keyof typeof tytAnswerKey] 
    : aytAnswerKey[subject as keyof typeof aytAnswerKey];

  const handleAnswerChange = (questionIndex: number, option: Option) => {
    if (examType === "TYT") {
      setTytAnswerKey((prev) => {
        const newAnswers = { ...prev };
        const answers = [...newAnswers[subject as keyof typeof newAnswers]];
        answers[questionIndex] = option;
        newAnswers[subject as keyof typeof newAnswers] = answers;
        return newAnswers;
      });
    } else {
      setAytAnswerKey((prev) => {
        const newAnswers = { ...prev };
        const answers = [...newAnswers[subject as keyof typeof newAnswers]];
        answers[questionIndex] = option;
        newAnswers[subject as keyof typeof newAnswers] = answers;
        return newAnswers;
      });
    }
  };

  // Hesapla kaç grup gösterilmeli
  const groupCount = Math.ceil(questionCount / 10);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="border-t-4" style={{ borderTopColor: `var(--${colorClass.split('-')[1]})` }}>
      <CardHeader>
        <CardTitle>{subjectLabel} Cevap Anahtarı ({questionCount} Soru)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(groupCount)].map((_, groupIndex) => {
            const startQuestion = groupIndex * 10;
            const endQuestion = Math.min(startQuestion + 10, questionCount);
            const questionsInGroup = endQuestion - startQuestion;

            return (
              <div key={groupIndex}>
                <h3 className="mb-3 font-medium">{startQuestion + 1}-{endQuestion}. Sorular</h3>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {[...Array(questionsInGroup)].map((_, questionIndex) => {
                    const absoluteIndex = startQuestion + questionIndex;
                    return (
                      <motion.div 
                        key={absoluteIndex} 
                        className="flex flex-col items-center"
                        variants={itemVariants}
                      >
                        <span className="text-sm font-medium mb-1">{absoluteIndex + 1}</span>
                        <div className="flex gap-1">
                          {['A', 'B', 'C', 'D', 'E'].map((option) => (
                            <motion.button
                              key={option}
                              onClick={() => handleAnswerChange(absoluteIndex, option as Option)}
                              className={cn(
                                "w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium transition-all",
                                colorClass,
                                subjectAnswers[absoluteIndex] === option 
                                  ? "selected shadow-md" 
                                  : "hover:bg-opacity-10 hover:bg-gray-100"
                              )}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label={`Soru ${absoluteIndex + 1}, Şık ${option}`}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerKeyInput;
