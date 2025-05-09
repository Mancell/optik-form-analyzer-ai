
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Option, SubjectAnswers, useAnswers } from "@/contexts/AnswerContext";
import { cn } from "@/lib/utils";

interface AnswerSectionProps {
  subject: keyof SubjectAnswers;
  subjectLabel: string;
  colorClass: string;
}

const AnswerKeyInput: React.FC = () => {
  const { answerKey, setAnswerKey } = useAnswers();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="turkish" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="turkish" className="text-turkish">
            Türkçe
          </TabsTrigger>
          <TabsTrigger value="social" className="text-social">
            Sosyal
          </TabsTrigger>
          <TabsTrigger value="math" className="text-math">
            Matematik
          </TabsTrigger>
          <TabsTrigger value="science" className="text-science">
            Fen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="turkish">
          <AnswerSection subject="turkish" subjectLabel="Türkçe" colorClass="subject-turkish" />
        </TabsContent>
        
        <TabsContent value="social">
          <AnswerSection subject="social" subjectLabel="Sosyal" colorClass="subject-social" />
        </TabsContent>
        
        <TabsContent value="math">
          <AnswerSection subject="math" subjectLabel="Matematik" colorClass="subject-math" />
        </TabsContent>
        
        <TabsContent value="science">
          <AnswerSection subject="science" subjectLabel="Fen" colorClass="subject-science" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AnswerSection: React.FC<AnswerSectionProps> = ({ subject, subjectLabel, colorClass }) => {
  const { answerKey, setAnswerKey } = useAnswers();
  const subjectAnswers = answerKey[subject];

  const handleAnswerChange = (questionIndex: number, option: Option) => {
    setAnswerKey((prev) => {
      const newAnswers = { ...prev };
      const answers = [...newAnswers[subject]];
      answers[questionIndex] = option;
      newAnswers[subject] = answers;
      return newAnswers;
    });
  };

  return (
    <Card className="border-t-4" style={{ borderTopColor: `var(--${colorClass.split('-')[1]})` }}>
      <CardHeader>
        <CardTitle>{subjectLabel} Cevap Anahtarı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(3)].map((_, groupIndex) => {
            const startQuestion = groupIndex * 10;
            return (
              <div key={groupIndex}>
                <h3 className="mb-3 font-medium">{startQuestion + 1}-{startQuestion + 10}. Sorular</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, questionIndex) => {
                    const absoluteIndex = startQuestion + questionIndex;
                    return (
                      <div key={absoluteIndex} className="flex flex-col items-center">
                        <span className="text-sm font-medium mb-1">{absoluteIndex + 1}</span>
                        <div className="flex gap-1">
                          {['A', 'B', 'C', 'D', 'E'].map((option) => (
                            <button
                              key={option}
                              onClick={() => handleAnswerChange(absoluteIndex, option as Option)}
                              className={cn(
                                "w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium transition-all",
                                colorClass,
                                subjectAnswers[absoluteIndex] === option 
                                  ? "selected shadow-md" 
                                  : "hover:bg-opacity-10 hover:bg-gray-100"
                              )}
                              aria-label={`Soru ${absoluteIndex + 1}, Şık ${option}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerKeyInput;
