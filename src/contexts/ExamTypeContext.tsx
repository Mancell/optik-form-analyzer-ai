
import React, { createContext, useState, useContext, ReactNode } from "react";

export type ExamType = "TYT" | "AYT";

interface ExamTypeContextProps {
  examType: ExamType;
  setExamType: React.Dispatch<React.SetStateAction<ExamType>>;
}

const ExamTypeContext = createContext<ExamTypeContextProps | undefined>(undefined);

export const useExamType = () => {
  const context = useContext(ExamTypeContext);
  if (!context) {
    throw new Error("useExamType must be used within an ExamTypeProvider");
  }
  return context;
};

export const ExamTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [examType, setExamType] = useState<ExamType>("TYT");

  return (
    <ExamTypeContext.Provider value={{ examType, setExamType }}>
      {children}
    </ExamTypeContext.Provider>
  );
};
