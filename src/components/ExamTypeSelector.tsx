
import React from "react";
import { useExamType } from "@/contexts/ExamTypeContext";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const ExamTypeSelector: React.FC = () => {
  const { examType, setExamType } = useExamType();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Sınav Türünü Seçin</h3>
            <p className="text-sm text-muted-foreground">
              Cevap anahtarı hazırlamak istediğiniz sınavı seçin.
            </p>
          </div>
          
          <RadioGroup 
            value={examType}
            onValueChange={(value) => setExamType(value as "TYT" | "AYT")}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="TYT" id="exam-tyt" />
              <Label htmlFor="exam-tyt" className="cursor-pointer font-medium">TYT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AYT" id="exam-ayt" />
              <Label htmlFor="exam-ayt" className="cursor-pointer font-medium">AYT</Label>
            </div>
          </RadioGroup>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {examType === "TYT" ? (
              <p>Temel Yeterlilik Testi: Türkçe (40), Sosyal Bilimler (20), Matematik (40), Fen Bilimleri (20)</p>
            ) : (
              <p>Alan Yeterlilik Testi: Türk Dili ve Edebiyatı-Sosyal I (40), Matematik (40), Fen Bilimleri (40), Sosyal II (40)</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExamTypeSelector;
