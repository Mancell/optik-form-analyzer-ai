
import React from "react";
import { useAnswers } from "@/contexts/AnswerContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPie, ChartBar, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

const COLORS = {
  turkish: "#3B82F6",
  social: "#10B981",
  math: "#8B5CF6",
  science: "#F59E0B",
  total: "#6366F1",
};

const ExamHistory: React.FC = () => {
  const { studentInfo } = useAnswers();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("table");

  if (!studentInfo) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Öğrenci bilgisi bulunamadı.</p>
      </Card>
    );
  }

  // Create sample exam history if none exists
  const exams = studentInfo.examHistory || [];
  
  if (exams.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Henüz kaydedilmiş sınav bulunmamaktadır.</p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Mevcut sınav sonuçlarını kaydetmek için "Sınavı Kaydet" butonunu kullanabilirsiniz.
        </p>
      </Card>
    );
  }

  // Calculate net scores for each exam
  const examResults = exams.map(exam => {
    const results = exam.results;
    if (!results) return null;

    const turkishNet = results.turkish.correct - results.turkish.incorrect / 4;
    const socialNet = results.social.correct - results.social.incorrect / 4;
    const mathNet = results.math.correct - results.math.incorrect / 4;
    const scienceNet = results.science.correct - results.science.incorrect / 4;
    const totalNet = turkishNet + socialNet + mathNet + scienceNet;

    return {
      id: exam.id,
      date: exam.date,
      name: exam.name,
      turkishNet: parseFloat(turkishNet.toFixed(2)),
      socialNet: parseFloat(socialNet.toFixed(2)),
      mathNet: parseFloat(mathNet.toFixed(2)),
      scienceNet: parseFloat(scienceNet.toFixed(2)),
      totalNet: parseFloat(totalNet.toFixed(2)),
    };
  }).filter(Boolean);

  // Sort exams by date (newest first)
  const sortedExams = [...examResults].sort((a, b) => 
    new Date(b!.date).getTime() - new Date(a!.date).getTime()
  );

  // Prepare data for charts (reversed to show progress chronologically)
  const chartData = [...sortedExams].reverse().map(exam => ({
    name: format(parseISO(exam!.date), "dd MMM", { locale: tr }),
    turkish: exam!.turkishNet,
    social: exam!.socialNet,
    math: exam!.mathNet,
    science: exam!.scienceNet,
    total: exam!.totalNet,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sınav Geçmişi</CardTitle>
          <CardDescription>
            {studentInfo.name} isimli öğrencinin sınav geçmişi ve gelişim grafiği
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="table" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> 
                <span>Sınav Tablosu</span>
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-1">
                <ChartBar className="h-4 w-4" />
                <span>Gelişim Grafiği</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Sıra</TableHead>
                      <TableHead>Sınav</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-center">TÜR</TableHead>
                      <TableHead className="text-center">SOS</TableHead>
                      <TableHead className="text-center">MAT</TableHead>
                      <TableHead className="text-center">FEN</TableHead>
                      <TableHead className="text-center">Toplam</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedExams.map((exam, index) => (
                      <TableRow key={exam!.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{exam!.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(parseISO(exam!.date), "dd MMMM yyyy", { locale: tr })}
                        </TableCell>
                        <TableCell className="text-center">
                          <span style={{ color: COLORS.turkish }}>{exam!.turkishNet}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span style={{ color: COLORS.social }}>{exam!.socialNet}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span style={{ color: COLORS.math }}>{exam!.mathNet}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span style={{ color: COLORS.science }}>{exam!.scienceNet}</span>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{exam!.totalNet}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="chart" className="mt-0">
              <div className="h-[400px]">
                <ChartContainer 
                  config={{
                    turkish: { color: COLORS.turkish },
                    social: { color: COLORS.social },
                    math: { color: COLORS.math },
                    science: { color: COLORS.science },
                    total: { color: COLORS.total },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip 
                        content={props => <ChartTooltipContent {...props} />}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="turkish"
                        name="Türkçe"
                        stroke={COLORS.turkish}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="social"
                        name="Sosyal"
                        stroke={COLORS.social}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="math"
                        name="Matematik"
                        stroke={COLORS.math}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="science"
                        name="Fen"
                        stroke={COLORS.science}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Toplam"
                        stroke={COLORS.total}
                        strokeWidth={2}
                        activeDot={{ r: 10 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Gelişim Özeti</h3>
                {chartData.length >= 2 && (
                  <p className="text-sm text-muted-foreground">
                    Öğrenci {studentInfo.name}'nin ilk sınavdan son sınava kadar olan gelişimi:
                    {" "}
                    {chartData[0].total < chartData[chartData.length - 1].total ? (
                      <span className="text-green-500 font-medium">
                        +{(chartData[chartData.length - 1].total - chartData[0].total).toFixed(2)} net artış
                      </span>
                    ) : chartData[0].total > chartData[chartData.length - 1].total ? (
                      <span className="text-red-500 font-medium">
                        {(chartData[chartData.length - 1].total - chartData[0].total).toFixed(2)} net azalış
                      </span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Değişim yok</span>
                    )}
                  </p>
                )}
                
                {chartData.length < 2 && (
                  <p className="text-sm text-muted-foreground">
                    Gelişim analizi için en az 2 sınav sonucu gereklidir.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Dersler Arası Karşılaştırma</CardTitle>
          <CardDescription>
            {studentInfo.name} isimli öğrencinin dersler arasındaki başarı karşılaştırması
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-4 text-center">En Başarılı Ders</h3>
              {sortedExams.length > 0 && (() => {
                const latest = sortedExams[0]!;
                const scores = [
                  { name: "Türkçe", score: latest.turkishNet, color: COLORS.turkish },
                  { name: "Sosyal", score: latest.socialNet, color: COLORS.social },
                  { name: "Matematik", score: latest.mathNet, color: COLORS.math },
                  { name: "Fen", score: latest.scienceNet, color: COLORS.science }
                ];
                
                const bestSubject = scores.reduce((prev, current) => 
                  (prev.score > current.score) ? prev : current
                );
                
                return (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-2" 
                      style={{ backgroundColor: `${bestSubject.color}20`, color: bestSubject.color }}
                    >
                      <ChartPie className="h-8 w-8" />
                    </div>
                    <span className="text-lg font-bold" style={{ color: bestSubject.color }}>
                      {bestSubject.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {bestSubject.score} net
                    </span>
                  </div>
                );
              })()}
            </Card>
            
            <Card className="p-4">
              <h3 className="text-sm font-medium mb-4 text-center">En Çok Gelişen Ders</h3>
              {chartData.length >= 2 && (() => {
                const first = chartData[0];
                const last = chartData[chartData.length - 1];
                
                const improvements = [
                  { name: "Türkçe", improvement: last.turkish - first.turkish, color: COLORS.turkish },
                  { name: "Sosyal", improvement: last.social - first.social, color: COLORS.social },
                  { name: "Matematik", improvement: last.math - first.math, color: COLORS.math },
                  { name: "Fen", improvement: last.science - first.science, color: COLORS.science }
                ];
                
                const mostImproved = improvements.reduce((prev, current) => 
                  (prev.improvement > current.improvement) ? prev : current
                );
                
                return (
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-2" 
                      style={{ backgroundColor: `${mostImproved.color}20`, color: mostImproved.color }}
                    >
                      <ChartBar className="h-8 w-8" />
                    </div>
                    <span className="text-lg font-bold" style={{ color: mostImproved.color }}>
                      {mostImproved.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {mostImproved.improvement > 0 ? '+' : ''}{mostImproved.improvement.toFixed(2)} net
                    </span>
                  </div>
                );
              })()}
              
              {chartData.length < 2 && (
                <p className="text-center text-sm text-muted-foreground">
                  Gelişim analizi için en az 2 sınav sonucu gereklidir.
                </p>
              )}
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamHistory;
