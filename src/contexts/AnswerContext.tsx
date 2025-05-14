
import React, { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { useExamType } from "@/contexts/ExamTypeContext";

export type Option = "A" | "B" | "C" | "D" | "E" | "";

export interface TytSubjectAnswers {
  turkish: Option[];
  social: Option[];
  math: Option[];
  science: Option[];
}

export interface AytSubjectAnswers {
  turkishSocial: Option[]; // Türk Dili ve Edebiyatı-Sosyal Bilimler I
  math: Option[];
  science: Option[];
  socialII: Option[]; // Sosyal Bilimler II
}

export type SubjectAnswers = TytSubjectAnswers | AytSubjectAnswers;

export interface TytSubjectResults {
  turkish: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
  social: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
  math: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
  science: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
}

export interface AytSubjectResults {
  turkishSocial: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
  math: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
  science: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
  socialII: {
    correct: number;
    incorrect: number;
    empty: number;
    total: number;
  };
}

export type SubjectResults = TytSubjectResults | AytSubjectResults;

export interface Exam {
  id: string;
  date: string;
  name: string;
  examType: "TYT" | "AYT";
  studentAnswers: SubjectAnswers;
  results?: SubjectResults;
}

export interface StudentInfo {
  name: string;
  studentAnswers: SubjectAnswers;
  results?: SubjectResults;
  examHistory?: Exam[];
}

interface AnswerContextProps {
  tytAnswerKey: TytSubjectAnswers;
  aytAnswerKey: AytSubjectAnswers;
  setTytAnswerKey: React.Dispatch<React.SetStateAction<TytSubjectAnswers>>;
  setAytAnswerKey: React.Dispatch<React.SetStateAction<AytSubjectAnswers>>;
  studentInfo: StudentInfo | null;
  setStudentInfo: React.Dispatch<React.SetStateAction<StudentInfo | null>>;
  calculateResults: () => void;
  addExamToHistory: (examName: string) => void;
}

const AnswerContext = createContext<AnswerContextProps | undefined>(undefined);

export const useAnswers = () => {
  const context = useContext(AnswerContext);
  if (!context) {
    throw new Error("useAnswers must be used within an AnswerProvider");
  }
  return context;
};

// Helper function to create an array of empty strings
const createEmptyAnswerArray = (length: number): Option[] => {
  return Array(length).fill("");
};

// Default empty answer key structure for TYT
const defaultTytAnswerKey: TytSubjectAnswers = {
  turkish: createEmptyAnswerArray(40),
  social: createEmptyAnswerArray(20),
  math: createEmptyAnswerArray(40),
  science: createEmptyAnswerArray(20),
};

// Default empty answer key structure for AYT
const defaultAytAnswerKey: AytSubjectAnswers = {
  turkishSocial: createEmptyAnswerArray(40),
  math: createEmptyAnswerArray(40),
  science: createEmptyAnswerArray(40),
  socialII: createEmptyAnswerArray(40),
};

export const AnswerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { examType } = useExamType();
  const [tytAnswerKey, setTytAnswerKey] = useState<TytSubjectAnswers>(defaultTytAnswerKey);
  const [aytAnswerKey, setAytAnswerKey] = useState<AytSubjectAnswers>(defaultAytAnswerKey);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // Calculate results by comparing student answers with the answer key
  const calculateResults = () => {
    if (!studentInfo) return;

    if (examType === "TYT") {
      calculateTytResults();
    } else {
      calculateAytResults();
    }
  };

  const calculateTytResults = () => {
    if (!studentInfo || !isTytAnswers(studentInfo.studentAnswers)) return;

    const studentAnswers = studentInfo.studentAnswers;
    const results: TytSubjectResults = {
      turkish: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      social: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      math: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      science: { correct: 0, incorrect: 0, empty: 0, total: 0 },
    };

    // Calculate for each subject
    Object.keys(tytAnswerKey).forEach((subject) => {
      const subjectKey = subject as keyof TytSubjectAnswers;
      const correctAnswers = tytAnswerKey[subjectKey];
      const studentSubjectAnswers = studentAnswers[subjectKey];

      results[subjectKey].total = correctAnswers.length;

      // Compare each answer
      correctAnswers.forEach((answer, index) => {
        const studentAnswer = studentSubjectAnswers[index];
        
        if (studentAnswer === "") {
          results[subjectKey].empty++;
        } else if (studentAnswer === answer) {
          results[subjectKey].correct++;
        } else {
          results[subjectKey].incorrect++;
        }
      });
    });

    // Update student info with results
    setStudentInfo({
      ...studentInfo,
      results: results,
    });
  };

  const calculateAytResults = () => {
    if (!studentInfo || !isAytAnswers(studentInfo.studentAnswers)) return;

    const studentAnswers = studentInfo.studentAnswers;
    const results: AytSubjectResults = {
      turkishSocial: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      math: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      science: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      socialII: { correct: 0, incorrect: 0, empty: 0, total: 0 },
    };

    // Calculate for each subject
    Object.keys(aytAnswerKey).forEach((subject) => {
      const subjectKey = subject as keyof AytSubjectAnswers;
      const correctAnswers = aytAnswerKey[subjectKey];
      const studentSubjectAnswers = studentAnswers[subjectKey];

      results[subjectKey].total = correctAnswers.length;

      // Compare each answer
      correctAnswers.forEach((answer, index) => {
        const studentAnswer = studentSubjectAnswers[index];
        
        if (studentAnswer === "") {
          results[subjectKey].empty++;
        } else if (studentAnswer === answer) {
          results[subjectKey].correct++;
        } else {
          results[subjectKey].incorrect++;
        }
      });
    });

    // Update student info with results
    setStudentInfo({
      ...studentInfo,
      results: results,
    });
  };

  // Type guard functions
  function isTytAnswers(answers: SubjectAnswers): answers is TytSubjectAnswers {
    return 'turkish' in answers && 'social' in answers && !('turkishSocial' in answers);
  }

  function isAytAnswers(answers: SubjectAnswers): answers is AytSubjectAnswers {
    return 'turkishSocial' in answers && 'socialII' in answers;
  }

  // Add the current exam to history
  const addExamToHistory = (examName: string) => {
    if (!studentInfo || !studentInfo.results) return;

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      date: new Date().toISOString(),
      name: examName,
      examType: examType,
      studentAnswers: studentInfo.studentAnswers,
      results: studentInfo.results
    };

    const examHistory = studentInfo.examHistory || [];
    
    setStudentInfo({
      ...studentInfo,
      examHistory: [newExam, ...examHistory]
    });
    
    toast.success("Sınav sonuçları kaydedildi.");
  };

  const value = {
    tytAnswerKey,
    aytAnswerKey,
    setTytAnswerKey,
    setAytAnswerKey,
    studentInfo,
    setStudentInfo,
    calculateResults,
    addExamToHistory
  };

  return <AnswerContext.Provider value={value}>{children}</AnswerContext.Provider>;
};
