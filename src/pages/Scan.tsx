
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CameraComponent from "@/components/Camera";
import { ArrowLeft, Info, Upload, FileUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnswers, StudentInfo, Option } from "@/contexts/AnswerContext";
import { toast } from "@/components/ui/use-toast";

interface FormData {
  id: string;
  name: string;
  file: File;
  processed: boolean;
  error?: string;
}

const MAX_FORMS = 150;

const Scan: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setStudentInfo } = useAnswers();
  const [isProcessing, setIsProcessing] = useState(false);
  const [forms, setForms] = useState<FormData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    processSingleForm(file);
  };
  
  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these files would exceed the maximum
    if (forms.length + files.length > MAX_FORMS) {
      toast({
        title: "Maksimum Form Sayısı Aşıldı",
        description: `En fazla ${MAX_FORMS} form yükleyebilirsiniz. Şu anda ${forms.length} form mevcut.`,
        variant: "destructive"
      });
      return;
    }
    
    // Convert FileList to array and process each file
    const filesArray = Array.from(files);
    
    // Add files to the forms array
    const newForms = filesArray.map(file => ({
      id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: extractStudentName(file.name) || "İsimsiz Öğrenci",
      file,
      processed: false
    }));
    
    setForms(prev => [...prev, ...newForms]);
    
    toast({
      title: "Formlar Eklendi",
      description: `${filesArray.length} form başarıyla eklendi. İşlemek için 'Formları İşle' butonuna tıklayın.`,
    });
    
    // Reset the input
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.value = "";
    }
  };

  const extractStudentName = (filename: string): string => {
    // Try to extract student name from filename
    // This is a placeholder - in real implementation this could:
    // 1. Use a naming convention like "Form_StudentName.jpg"
    // 2. Or later use OCR to extract name from the form itself
    
    // Remove extension and common prefixes
    const withoutExtension = filename.split('.').slice(0, -1).join('.');
    const nameParts = withoutExtension.split(/[-_\s]/);
    
    // If at least two parts, assume last two are name and surname
    if (nameParts.length >= 2) {
      return nameParts.slice(-2).map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      ).join(' ');
    }
    
    return withoutExtension || "İsimsiz Öğrenci";
  };

  const processSingleForm = (file: File) => {
    setIsProcessing(true);
    toast({
      title: "Form İşleniyor",
      description: "Yüklenen form analiz ediliyor, lütfen bekleyin...",
    });

    // Simulate processing delay
    setTimeout(() => {
      // Generate mock student data with random answers
      const mockStudentName = extractStudentName(file.name) || "Mehmet Yılmaz";
      const mockAnswers = {
        turkish: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
        social: Array(20).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
        math: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
        science: Array(20).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option)
      };

      // Create student info object
      const studentInfo: StudentInfo = {
        name: mockStudentName,
        studentAnswers: mockAnswers
      };

      // Update context with student info
      setStudentInfo(studentInfo);
      setIsProcessing(false);
      
      toast({
        title: "İşlem Tamamlandı",
        description: "Form başarıyla analiz edildi.",
      });

      // Navigate to results page
      navigate("/results");
    }, 2000);
  };
  
  const processAllForms = () => {
    if (forms.length === 0) {
      toast({
        title: "İşlenecek Form Yok",
        description: "Lütfen önce form yükleyin.",
      });
      return;
    }
    
    setIsProcessing(true);
    toast({
      title: "Formlar İşleniyor",
      description: `${forms.length} form işleniyor, bu işlem biraz zaman alabilir...`,
    });
    
    // Process all forms with progress updates
    let processedCount = 0;
    let errorCount = 0;
    const updatedForms = [...forms];
    
    // Simulated batch processing
    const batchProcess = () => {
      const randomSuccess = Math.random() > 0.1; // 90% success rate for demo
      
      // Update current form status
      if (processedCount < forms.length) {
        if (randomSuccess) {
          updatedForms[processedCount].processed = true;
        } else {
          updatedForms[processedCount].processed = true;
          updatedForms[processedCount].error = "Form okunamadı";
          errorCount++;
        }
        
        processedCount++;
        setForms([...updatedForms]);
        
        // Show progress
        if (processedCount % 5 === 0 || processedCount === forms.length) {
          toast({
            title: `İşlem Devam Ediyor: ${processedCount}/${forms.length}`,
            description: `${errorCount} form okunamadı.`,
          });
        }
        
        // Continue processing or finish
        if (processedCount < forms.length) {
          setTimeout(batchProcess, 200); // Process next form after delay
        } else {
          finishProcessing();
        }
      }
    };
    
    // Start batch processing
    setTimeout(batchProcess, 500);
    
    // Finish processing and navigate to results
    const finishProcessing = () => {
      setIsProcessing(false);
      
      // Show final toast with results
      toast({
        title: "İşlem Tamamlandı",
        description: `${forms.length} formdan ${forms.length - errorCount} tanesi başarıyla işlendi. ${errorCount} form okunamadı.`,
      });
      
      // Create mock data for the first successfully processed form
      const successForm = forms.find(form => form.processed && !form.error);
      
      if (successForm) {
        const mockAnswers = {
          turkish: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
          social: Array(20).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
          math: Array(40).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option),
          science: Array(20).fill("").map(() => ["A", "B", "C", "D", "E", ""][Math.floor(Math.random() * 6)] as Option)
        };

        const studentInfo: StudentInfo = {
          name: successForm.name,
          studentAnswers: mockAnswers
        };

        setStudentInfo(studentInfo);
        navigate("/results");
      } else {
        toast({
          title: "Sonuç Gösterilemiyor",
          description: "Hiçbir form başarıyla işlenemedi.",
          variant: "destructive"
        });
      }
    };
  };
  
  const removeForm = (id: string) => {
    setForms(forms.filter(form => form.id !== id));
    toast({
      title: "Form Kaldırıldı",
      description: "Form başarıyla kaldırıldı.",
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleMultipleUploadClick = () => {
    multipleFileInputRef.current?.click();
  };

  return (
    <div className="container py-6 px-3 md:py-8 md:px-4 mx-auto">
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        size={isMobile ? "sm" : "default"}
        className="mb-4 md:mb-6 flex items-center gap-2 hover:bg-muted/50"
      >
        <ArrowLeft className="h-4 w-4" /> Geri Dön
      </Button>
      
      <div className="flex flex-col items-center justify-center mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Form Tarama
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-4 md:mb-6">
          Öğrenci formunu kamera ile tarayın veya galeriden bir fotoğraf yükleyin.
        </p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            variant="default" 
            onClick={() => {}}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            Taramaya Başla
          </Button>

          <Button 
            variant="outline"
            onClick={handleUploadClick}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4" /> Form Yükle
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleMultipleUploadClick}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            <FileUp className="h-4 w-4" /> Çoklu Form
            <input
              ref={multipleFileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMultipleFileUpload}
              disabled={isProcessing}
            />
          </Button>
        </div>
        
        {forms.length > 0 && (
          <div className="w-full max-w-2xl mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2 p-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Yüklenen Formlar ({forms.length}/{MAX_FORMS})</span>
                  <Button 
                    onClick={processAllForms}
                    disabled={isProcessing || forms.length === 0}
                    size="sm"
                    variant="default"
                  >
                    Formları İşle
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-60 overflow-y-auto">
                {isProcessing ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
                    <span className="ml-2 text-sm">İşleniyor...</span>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {forms.map((form) => (
                      <li key={form.id} className="flex items-center justify-between text-sm border-b pb-2">
                        <div className="flex items-center">
                          <span className={form.processed ? (form.error ? "text-red-500" : "text-green-500") : ""}>
                            {form.name}
                          </span>
                          {form.error && (
                            <span className="ml-2 text-xs text-red-500">
                              (Okunamadı)
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeForm(form.id)}
                          className="h-6 w-6 p-0"
                        >
                          ✕
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-lg border">
          <CameraComponent />
        </div>
        
        <Card className="mt-6 md:mt-8 w-full max-w-lg border-l-4 border-l-amber-500">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Info className="h-5 w-5 text-amber-500" />
              Optik Form Tarama İpuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="list-disc list-inside space-y-1 md:space-y-2 text-xs md:text-sm">
              <li className="mb-1">Formu düz bir yüzeye yerleştirin</li>
              <li className="mb-1">İyi aydınlatılmış bir ortamda çekim yapın</li>
              <li className="mb-1">Formun tamamı kare içinde olsun</li>
              <li className="mb-1">Mümkün olduğunca dik açıyla çekim yapın</li>
              <li>Gölge ve parlama olmamasına dikkat edin</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scan;
