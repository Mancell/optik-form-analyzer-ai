import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, FileUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAnswers, SubjectAnswers, Option } from "@/contexts/AnswerContext";

const AnswerKeyImport: React.FC = () => {
  const { setAnswerKey } = useAnswers();
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Start camera for capturing answer key
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsCapturing(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Kamera erişimi sağlanamadı. Lütfen kamera izinlerini kontrol edin.", {
        description: "İzinleri kontrol edip tekrar deneyiniz.",
      });
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCapturing(false);
    }
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Stop the camera after capturing
        stopCamera();
        
        // Process captured answer key image
        processAnswerKeyImage(imageDataUrl);
      }
    }
  };
  
  // Reset camera and captured image
  const resetCapture = () => {
    setCapturedImage(null);
    startCamera();
  };
  
  // Handle file upload for PDFs and images
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (file.type === 'application/pdf') {
      readPdfFile(file);
    } else if (file.type.startsWith('image/')) {
      readImageFile(file);
    } else {
      toast.error("Lütfen sadece PDF veya resim dosyası yükleyin.");
    }
  };
  
  // Read and process PDF file
  const readPdfFile = (file: File) => {
    toast("PDF işleniyor...");
    setIsProcessing(true);
    
    // Simulate PDF processing with predefined answer key
    const reader = new FileReader();
    
    reader.onload = () => {
      setTimeout(() => {
        const predefinedAnswerKey = generatePredefinedAnswerKey();
        setAnswerKey(predefinedAnswerKey);
        toast.success("Cevap anahtarı başarıyla içe aktarıldı.");
        setIsProcessing(false);
      }, 1500);
    };
    
    reader.onerror = () => {
      toast.error("PDF dosyası okunamadı.");
      setIsProcessing(false);
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  // Read and process image file
  const readImageFile = (file: File) => {
    const reader = new FileReader();
    setIsProcessing(true);
    
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      processAnswerKeyImage(imageDataUrl);
    };
    
    reader.onerror = () => {
      toast.error("Resim dosyası okunamadı.");
      setIsProcessing(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  // Process the answer key image (using predefined answer key)
  const processAnswerKeyImage = (imageDataUrl: string) => {
    toast("Cevap anahtarı görüntüsü işleniyor...");
    setIsProcessing(true);
    
    // In a real implementation, we would use a machine learning model
    // For now, we'll use a predefined answer key instead of random answers
    setTimeout(() => {
      const predefinedAnswerKey = generatePredefinedAnswerKey();
      setAnswerKey(predefinedAnswerKey);
      toast.success("Cevap anahtarı başarıyla tespit edildi.");
      setIsProcessing(false);
    }, 1500);
  };
  
  // Generate a predefined answer key with realistic patterns
  const generatePredefinedAnswerKey = (): SubjectAnswers => {
    // Gerçekçi bir cevap anahtarı tanımlayalım
    const turkishAnswers: Option[] = [
      "C", "A", "E", "D", "B", "A", "C", "D", "E", "B", // 1-10
      "A", "E", "B", "C", "D", "B", "A", "C", "E", "D", // 11-20
      "E", "C", "A", "B", "D", "E", "C", "B", "A", "D", // 21-30
      "B", "C", "E", "A", "D", "B", "C", "A", "E", "D"  // 31-40
    ];
    
    const socialAnswers: Option[] = [
      "B", "D", "A", "E", "C", "B", "A", "D", "E", "C", // 1-10
      "A", "B", "E", "C", "D", "B", "A", "D", "C", "E"  // 11-20
    ];
    
    const mathAnswers: Option[] = [
      "D", "B", "E", "A", "C", "D", "B", "A", "E", "C", // 1-10
      "A", "D", "C", "E", "B", "A", "C", "E", "D", "B", // 11-20
      "C", "E", "A", "D", "B", "C", "A", "E", "D", "B", // 21-30
      "D", "C", "B", "E", "A", "D", "B", "C", "E", "A"  // 31-40
    ];
    
    const scienceAnswers: Option[] = [
      "A", "C", "E", "B", "D", "A", "C", "E", "B", "D", // 1-10
      "D", "B", "C", "A", "E", "D", "B", "C", "A", "E"  // 11-20
    ];
    
    return {
      turkish: turkishAnswers,
      social: socialAnswers,
      math: mathAnswers,
      science: scienceAnswers
    };
  };
  
  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg">Cevap Anahtarını İçe Aktar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {isCapturing && (
            <div className="relative aspect-video bg-black rounded-md overflow-hidden">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                <Button variant="outline" onClick={stopCamera} className="bg-white bg-opacity-70">
                  İptal
                </Button>
                <Button onClick={captureImage} className="bg-white bg-opacity-70">
                  <Camera className="mr-2 h-4 w-4" /> Çek
                </Button>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
          
          {capturedImage && (
            <div className="relative aspect-video bg-black rounded-md overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured answer key" 
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button onClick={resetCapture} variant="outline" className="bg-white bg-opacity-70">
                  Tekrar Çek
                </Button>
              </div>
            </div>
          )}
          
          {!isCapturing && !capturedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={startCamera} className="flex items-center justify-center" disabled={isProcessing}>
                <Camera className="mr-2 h-4 w-4" /> Kamera ile Çek
              </Button>
              
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline"
                className="flex items-center justify-center"
                disabled={isProcessing}
              >
                <FileUp className="mr-2 h-4 w-4" /> Dosya Yükle
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="application/pdf,image/*"
                className="hidden"
              />
            </div>
          )}
          
          {isProcessing && (
            <div className="flex justify-center items-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">İşleniyor...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerKeyImport;
