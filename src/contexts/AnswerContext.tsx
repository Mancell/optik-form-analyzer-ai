
import React, { createContext, useState, useContext, ReactNode } from "react";

export type Option = "A" | "B" | "C" | "D" | "E" | "";

export interface SubjectAnswers {
  turkish: Option[];
  social: Option[];
  math: Option[];
  science: Option[];
}

export interface SubjectResults {
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

export interface StudentInfo {
  name: string;
  studentAnswers: SubjectAnswers;
  results?: SubjectResults;
}

interface AnswerContextProps {
  answerKey: SubjectAnswers;
  setAnswerKey: React.Dispatch<React.SetStateAction<SubjectAnswers>>;
  studentInfo: StudentInfo | null;
  setStudentInfo: React.Dispatch<React.SetStateAction<StudentInfo | null>>;
  calculateResults: () => void;
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

// Default empty answer key structure
const defaultAnswerKey: SubjectAnswers = {
  turkish: createEmptyAnswerArray(30),
  social: createEmptyAnswerArray(30),
  math: createEmptyAnswerArray(30),
  science: createEmptyAnswerArray(30),
};

export const AnswerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answerKey, setAnswerKey] = useState<SubjectAnswers>(defaultAnswerKey);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // Calculate results by comparing student answers with the answer key
  const calculateResults = () => {
    if (!studentInfo) return;

    const studentAnswers = studentInfo.studentAnswers;
    const results: SubjectResults = {
      turkish: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      social: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      math: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      science: { correct: 0, incorrect: 0, empty: 0, total: 0 },
    };

    // Calculate for each subject
    Object.keys(answerKey).forEach((subject) => {
      const subjectKey = subject as keyof SubjectAnswers;
      const correctAnswers = answerKey[subjectKey];
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
      results,
    });
  };

  const value = {
    answerKey,
    setAnswerKey,
    studentInfo,
    setStudentInfo,
    calculateResults,
  };

  return <AnswerContext.Provider value={value}>{children}</AnswerContext.Provider>;
};
