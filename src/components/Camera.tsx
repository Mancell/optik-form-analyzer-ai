
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAnswers, SubjectAnswers, Option, StudentInfo } from "@/contexts/AnswerContext";
import { useNavigate } from "react-router-dom";

const CameraComponent: React.FC = () => {
  const { answerKey, setStudentInfo } = useAnswers();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Start camera stream
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Kamera Hatası",
        description: "Kamera erişimi sağlanamadı. Lütfen kamera izinlerini kontrol edin.",
        variant: "destructive"
      });
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image as data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        
        // Stop the camera after capturing
        stopCamera();
        
        // In a real application, we would send this image to an AI service for analysis
        // For now, we'll simulate the AI processing
        simulateAIProcessing(imageDataUrl);
      }
    }
  };
  
  // Reset camera state (discard captured image)
  const resetCamera = () => {
    setCapturedImage(null);
    startCamera();
  };
  
  // Simulated AI processing (in a real app, this would call an external AI service)
  const simulateAIProcessing = (imageData: string) => {
    toast({
      title: "Form İşleniyor",
      description: "Optik form analiz ediliyor, lütfen bekleyin...",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate mock student data with random answers
      const mockStudentName = "Ayşe Yılmaz";
      const mockAnswers: SubjectAnswers = {
        turkish: generateRandomAnswers(30),
        social: generateRandomAnswers(30),
        math: generateRandomAnswers(30),
        science: generateRandomAnswers(30)
      };
      
      // Create student info object
      const studentInfo: StudentInfo = {
        name: mockStudentName,
        studentAnswers: mockAnswers
      };
      
      // Update context with student info
      setStudentInfo(studentInfo);
      
      toast({
        title: "İşlem Tamamlandı",
        description: "Form başarıyla analiz edildi.",
      });
      
      // Navigate to results page
      navigate("/results");
    }, 2000);
  };
  
  // Generate random answers for testing
  const generateRandomAnswers = (count: number): Option[] => {
    const options: Option[] = ["A", "B", "C", "D", "E", ""];
    return Array(count).fill("").map(() => {
      // 80% chance to have an answer, 20% chance to be empty
      const randomIndex = Math.random() < 0.8 
        ? Math.floor(Math.random() * 5) // A-E
        : 5; // Empty
      return options[randomIndex];
    });
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-4">
        <div className="relative aspect-[3/4] bg-black rounded-md overflow-hidden">
          {isActive && !capturedImage && (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured form" 
              className="w-full h-full object-contain"
            />
          )}
          
          {!isActive && !capturedImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center px-4">
                Optik form taraması için kamerayı etkinleştirin
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex flex-col mt-4 space-y-2">
          {!isActive && !capturedImage && (
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2 h-4 w-4" /> Kamerayı Başlat
            </Button>
          )}
          
          {isActive && !capturedImage && (
            <div className="flex space-x-2">
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                <X className="mr-2 h-4 w-4" /> İptal
              </Button>
              <Button onClick={captureImage} className="flex-1">
                <Camera className="mr-2 h-4 w-4" /> Fotoğraf Çek
              </Button>
            </div>
          )}
          
          {capturedImage && (
            <div className="flex space-x-2">
              <Button onClick={resetCamera} variant="outline" className="flex-1">
                <X className="mr-2 h-4 w-4" /> Tekrar Çek
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraComponent;
