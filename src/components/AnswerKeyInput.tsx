
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card>
      <CardHeader>
        <CardTitle>{subjectLabel} Cevap Anahtarı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(3)].map((_, groupIndex) => {
            const startQuestion = groupIndex * 10;
            return (
              <div key={groupIndex}>
                <h3 className="mb-2 font-medium">Sorular {startQuestion + 1}-{startQuestion + 10}</h3>
                <div className="answer-grid">
                  {[...Array(10)].map((_, questionIndex) => {
                    const absoluteIndex = startQuestion + questionIndex;
                    return (
                      <div key={absoluteIndex} className="flex flex-col items-center">
                        <span className="text-sm mb-1">{absoluteIndex + 1}</span>
                        <div className="flex space-x-1">
                          {['A', 'B', 'C', 'D', 'E'].map((option) => (
                            <button
                              key={option}
                              onClick={() => handleAnswerChange(absoluteIndex, option as Option)}
                              className={cn(
                                "answer-button",
                                colorClass,
                                subjectAnswers[absoluteIndex] === option && "selected"
                              )}
                              aria-label={`Question ${absoluteIndex + 1}, Option ${option}`}
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
