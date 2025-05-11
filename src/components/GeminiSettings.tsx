
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Key, Check, Sparkles } from "lucide-react";

const DEFAULT_API_KEY = "AIzaSyAw7CDaiZuQKn60ISltYTnzi18HvX2OQ3I";

const GeminiSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  // Load saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("geminiApiKey");
    if (savedKey) {
      setApiKey(savedKey);
      setSaved(true);
    } else {
      // Pre-fill with the default key if no saved key is found
      setApiKey(DEFAULT_API_KEY);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Lütfen geçerli bir API anahtarı girin");
      return;
    }

    localStorage.setItem("geminiApiKey", apiKey);
    setSaved(true);
    toast.success("Gemini API anahtarı kaydedildi");
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("geminiApiKey");
    setApiKey("");
    setSaved(false);
    toast.success("Gemini API anahtarı kaldırıldı");
  };

  const handleUseDefaultKey = () => {
    setApiKey(DEFAULT_API_KEY);
    localStorage.setItem("geminiApiKey", DEFAULT_API_KEY);
    setSaved(true);
    toast.success("Varsayılan Gemini API anahtarı kaydedildi");
  };

  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg flex items-center justify-center">
          <Sparkles className="mr-2 h-4 w-4 text-purple-500" /> Gemini AI Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          PDF ve görüntü işleme için Gemini API anahtarını girin. API anahtarı tarayıcınızda yerel olarak saklanır.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Gemini API Anahtarı"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleSaveKey} variant="outline">
              Kaydet
            </Button>
          </div>
          
          <div className="flex justify-between mt-2">
            <Button 
              onClick={handleUseDefaultKey} 
              variant="ghost" 
              size="sm"
              className="text-purple-500 hover:text-purple-700 hover:bg-purple-50"
            >
              Varsayılan Anahtarı Kullan
            </Button>
            
            {saved && (
              <Button 
                onClick={handleRemoveKey} 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Anahtarı Kaldır
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-xs text-muted-foreground">
          {saved ? (
            <p className="text-green-500 flex items-center">
              <Check className="h-3 w-3 mr-1" /> API anahtarı kaydedildi - Gemini AI özellikleri kullanılabilir
            </p>
          ) : (
            <p>API anahtarı sağlanmadı. Şu anda geliştirilmiş yapay zeka özellikleri kullanılamıyor.</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeminiSettings;
