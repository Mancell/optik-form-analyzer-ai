
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Key } from "lucide-react";

const GeminiSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  // Load saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("geminiApiKey");
    if (savedKey) {
      setApiKey(savedKey);
      setSaved(true);
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

  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg flex items-center justify-center">
          <Key className="mr-2 h-4 w-4" /> Gemini AI Ayarları
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          PDF ve görüntü işleme için Gemini API anahtarını girin. API anahtarı tarayıcınızda yerel olarak saklanır.
        </p>
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
          {saved && (
            <Button onClick={handleRemoveKey} variant="ghost" className="text-red-500">
              Kaldır
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-xs text-muted-foreground">
          {saved ? (
            <p className="text-green-500">✓ API anahtarı kaydedildi</p>
          ) : (
            <p>API anahtarı sağlanmadı. Şu anda geliştirilmiş yapay zeka özellikleri kullanılamıyor.</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeminiSettings;
