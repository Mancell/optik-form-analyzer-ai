
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Search, ChartBar, ChartPie, BarChart3, Activity, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";

interface StudentResult {
  id: string;
  name: string;
  results: {
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
  };
}

interface StudentStatisticsProps {
  title: string;
  students: StudentResult[];
  type: "class" | "school";
}

const COLORS = {
  turkish: "#3B82F6",
  social: "#10B981",
  math: "#8B5CF6",
  science: "#F59E0B",
};

const LESSON_NAMES = {
  turkish: "Türkçe",
  social: "Sosyal",
  math: "Matematik",
  science: "Fen",
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  
  return (
    <div className="bg-background border border-border/50 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name} ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const StudentStatistics: React.FC<StudentStatisticsProps> = ({ title, students, type }) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [chartType, setChartType] = useState("bar");
  
  // Arama sorgusuna göre filtrelenmiş öğrenci listesi
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    
    return students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);
  
  // Sınıf ortalamalarını hesapla
  const averages = useMemo(() => {
    if (filteredStudents.length === 0) return null;
    
    const sums = {
      turkish: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      social: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      math: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      science: { correct: 0, incorrect: 0, empty: 0, total: 0 },
    };
    
    filteredStudents.forEach(student => {
      Object.keys(sums).forEach(subject => {
        const typedSubject = subject as keyof typeof sums;
        sums[typedSubject].correct += student.results[typedSubject].correct;
        sums[typedSubject].incorrect += student.results[typedSubject].incorrect;
        sums[typedSubject].empty += student.results[typedSubject].empty;
        sums[typedSubject].total = student.results[typedSubject].total;
      });
    });
    
    const count = filteredStudents.length;
    return {
      turkish: {
        correct: +(sums.turkish.correct / count).toFixed(1),
        incorrect: +(sums.turkish.incorrect / count).toFixed(1),
        empty: +(sums.turkish.empty / count).toFixed(1),
        net: +((sums.turkish.correct - sums.turkish.incorrect / 4) / count).toFixed(2),
        total: sums.turkish.total
      },
      social: {
        correct: +(sums.social.correct / count).toFixed(1),
        incorrect: +(sums.social.incorrect / count).toFixed(1),
        empty: +(sums.social.empty / count).toFixed(1),
        net: +((sums.social.correct - sums.social.incorrect / 4) / count).toFixed(2),
        total: sums.social.total
      },
      math: {
        correct: +(sums.math.correct / count).toFixed(1),
        incorrect: +(sums.math.incorrect / count).toFixed(1),
        empty: +(sums.math.empty / count).toFixed(1),
        net: +((sums.math.correct - sums.math.incorrect / 4) / count).toFixed(2),
        total: sums.math.total
      },
      science: {
        correct: +(sums.science.correct / count).toFixed(1),
        incorrect: +(sums.science.incorrect / count).toFixed(1),
        empty: +(sums.science.empty / count).toFixed(1),
        net: +((sums.science.correct - sums.science.incorrect / 4) / count).toFixed(2),
        total: sums.science.total
      }
    };
  }, [filteredStudents]);

  // Tablo için veri hazırlama
  const tableData = useMemo(() => {
    return filteredStudents.map(student => {
      // Net puanları hesapla
      const turkishNet = +(student.results.turkish.correct - student.results.turkish.incorrect / 4).toFixed(2);
      const socialNet = +(student.results.social.correct - student.results.social.incorrect / 4).toFixed(2);
      const mathNet = +(student.results.math.correct - student.results.math.incorrect / 4).toFixed(2);
      const scienceNet = +(student.results.science.correct - student.results.science.incorrect / 4).toFixed(2);
      
      // Toplam net ve yüzde
      const totalNet = +(turkishNet + socialNet + mathNet + scienceNet).toFixed(2);
      const totalCorrect = student.results.turkish.correct + student.results.social.correct + 
                           student.results.math.correct + student.results.science.correct;
      const totalQuestions = student.results.turkish.total + student.results.social.total + 
                             student.results.math.total + student.results.science.total;
      const percentage = +((totalCorrect / totalQuestions) * 100).toFixed(1);
      
      return {
        ...student,
        turkishNet,
        socialNet,
        mathNet,
        scienceNet,
        totalNet,
        percentage
      };
    }).sort((a, b) => b.totalNet - a.totalNet);
  }, [filteredStudents]);

  // Ders bazlı doğru sayısı grafiği için veri hazırlama
  const correctsBySubjectData = useMemo(() => {
    if (!averages) return [];
    
    return [
      {
        name: "Türkçe",
        value: averages.turkish.correct,
        color: COLORS.turkish
      },
      {
        name: "Sosyal",
        value: averages.social.correct,
        color: COLORS.social
      },
      {
        name: "Matematik",
        value: averages.math.correct,
        color: COLORS.math
      },
      {
        name: "Fen",
        value: averages.science.correct,
        color: COLORS.science
      }
    ];
  }, [averages]);

  // Ders bazlı net puan grafiği için veri hazırlama
  const netsBySubjectData = useMemo(() => {
    if (!averages) return [];
    
    return [
      {
        name: "Türkçe",
        value: averages.turkish.net,
        color: COLORS.turkish
      },
      {
        name: "Sosyal",
        value: averages.social.net,
        color: COLORS.social
      },
      {
        name: "Matematik",
        value: averages.math.net,
        color: COLORS.math
      },
      {
        name: "Fen",
        value: averages.science.net,
        color: COLORS.science
      }
    ];
  }, [averages]);

  // Radar chart için veri hazırlama
  const radarData = useMemo(() => {
    if (!averages) return [];
    
    return [
      {
        subject: "Türkçe",
        Doğru: averages.turkish.correct,
        Yanlış: averages.turkish.incorrect,
        Net: averages.turkish.net,
        fullMark: averages.turkish.total,
      },
      {
        subject: "Sosyal",
        Doğru: averages.social.correct,
        Yanlış: averages.social.incorrect,
        Net: averages.social.net,
        fullMark: averages.social.total,
      },
      {
        subject: "Matematik",
        Doğru: averages.math.correct,
        Yanlış: averages.math.incorrect,
        Net: averages.math.net,
        fullMark: averages.math.total,
      },
      {
        subject: "Fen",
        Doğru: averages.science.correct,
        Yanlış: averages.science.incorrect,
        Net: averages.science.net,
        fullMark: averages.science.total,
      }
    ];
  }, [averages]);

  // Grafik için veri hazırlama
  const chartData = useMemo(() => {
    if (!averages) return [];
    
    return [
      {
        name: "Türkçe",
        doğru: averages.turkish.correct,
        yanlış: averages.turkish.incorrect,
        boş: averages.turkish.empty,
        net: averages.turkish.net,
      },
      {
        name: "Sosyal",
        doğru: averages.social.correct,
        yanlış: averages.social.incorrect,
        boş: averages.social.empty,
        net: averages.social.net,
      },
      {
        name: "Matematik",
        doğru: averages.math.correct,
        yanlış: averages.math.incorrect,
        boş: averages.math.empty,
        net: averages.math.net,
      },
      {
        name: "Fen",
        doğru: averages.science.correct,
        yanlış: averages.science.incorrect,
        boş: averages.science.empty,
        net: averages.science.net,
      }
    ];
  }, [averages]);

  if (!averages) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Arama Çubuğu */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Öğrenci adı veya ID ile ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <div className="mt-2">
            <Badge variant="outline">
              {filteredStudents.length} öğrenci bulundu
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS.turkish }}></div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Türkçe</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pt-0">
            <div className="text-center">
              <div className="text-2xl font-bold">{averages.turkish.net}</div>
              <div className="text-xs text-muted-foreground">Ortalama Net</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <div className="text-sm font-medium text-green-600">{averages.turkish.correct}</div>
                <div className="text-xs text-muted-foreground">D</div>
              </div>
              <div>
                <div className="text-sm font-medium text-red-500">{averages.turkish.incorrect}</div>
                <div className="text-xs text-muted-foreground">Y</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">{averages.turkish.empty}</div>
                <div className="text-xs text-muted-foreground">B</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS.social }}></div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Sosyal</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pt-0">
            <div className="text-center">
              <div className="text-2xl font-bold">{averages.social.net}</div>
              <div className="text-xs text-muted-foreground">Ortalama Net</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <div className="text-sm font-medium text-green-600">{averages.social.correct}</div>
                <div className="text-xs text-muted-foreground">D</div>
              </div>
              <div>
                <div className="text-sm font-medium text-red-500">{averages.social.incorrect}</div>
                <div className="text-xs text-muted-foreground">Y</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">{averages.social.empty}</div>
                <div className="text-xs text-muted-foreground">B</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS.math }}></div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Matematik</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pt-0">
            <div className="text-center">
              <div className="text-2xl font-bold">{averages.math.net}</div>
              <div className="text-xs text-muted-foreground">Ortalama Net</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <div className="text-sm font-medium text-green-600">{averages.math.correct}</div>
                <div className="text-xs text-muted-foreground">D</div>
              </div>
              <div>
                <div className="text-sm font-medium text-red-500">{averages.math.incorrect}</div>
                <div className="text-xs text-muted-foreground">Y</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">{averages.math.empty}</div>
                <div className="text-xs text-muted-foreground">B</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="h-2" style={{ backgroundColor: COLORS.science }}></div>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Fen</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 pt-0">
            <div className="text-center">
              <div className="text-2xl font-bold">{averages.science.net}</div>
              <div className="text-xs text-muted-foreground">Ortalama Net</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3">
              <div>
                <div className="text-sm font-medium text-green-600">{averages.science.correct}</div>
                <div className="text-xs text-muted-foreground">D</div>
              </div>
              <div>
                <div className="text-sm font-medium text-red-500">{averages.science.incorrect}</div>
                <div className="text-xs text-muted-foreground">Y</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">{averages.science.empty}</div>
                <div className="text-xs text-muted-foreground">B</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar" className="w-full mb-6" onValueChange={setChartType}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <ChartBar className="h-4 w-4" /> 
                <span className={isMobile ? "hidden" : "inline"}>Bar</span>
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <ChartPie className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "inline"}>Pie</span>
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "inline"}>Line</span>
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "inline"}>Radar</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar" className="mt-0">
              <Card className="p-4 shadow-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-base">Ders Bazlı Değerlendirme</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[350px]">
                    <ChartContainer 
                      config={{
                        turkish: { color: COLORS.turkish },
                        social: { color: COLORS.social },
                        math: { color: COLORS.math },
                        science: { color: COLORS.science },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar
                            dataKey="doğru"
                            name="Doğru"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="yanlış"
                            name="Yanlış"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="boş"
                            name="Boş"
                            fill="#9ca3af"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="net"
                            name="Net"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pie" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 shadow-sm">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-base">Ortalama Doğru Sayısı</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px]">
                      <ChartContainer 
                        config={{
                          turkish: { color: COLORS.turkish },
                          social: { color: COLORS.social },
                          math: { color: COLORS.math },
                          science: { color: COLORS.science },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={correctsBySubjectData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                            >
                              {correctsBySubjectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-4 shadow-sm">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-base">Ortalama Net Puanlar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[300px]">
                      <ChartContainer 
                        config={{
                          turkish: { color: COLORS.turkish },
                          social: { color: COLORS.social },
                          math: { color: COLORS.math },
                          science: { color: COLORS.science },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={netsBySubjectData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                            >
                              {netsBySubjectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="line" className="mt-0">
              <Card className="p-4 shadow-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-base">Ders Bazlı Performans</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[350px]">
                    <ChartContainer 
                      config={{
                        turkish: { color: COLORS.turkish },
                        social: { color: COLORS.social },
                        math: { color: COLORS.math },
                        science: { color: COLORS.science },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="doğru" 
                            name="Doğru" 
                            stroke="#22c55e" 
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="yanlış" 
                            name="Yanlış" 
                            stroke="#ef4444" 
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="boş" 
                            name="Boş" 
                            stroke="#9ca3af" 
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="net" 
                            name="Net"
                            stroke="#3b82f6" 
                            activeDot={{ r: 10 }}
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="radar" className="mt-0">
              <Card className="p-4 shadow-sm">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-base">Ders Performans Analizi</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[350px]">
                    <ChartContainer 
                      config={{
                        turkish: { color: COLORS.turkish },
                        social: { color: COLORS.social },
                        math: { color: COLORS.math },
                        science: { color: COLORS.science },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 30]} />
                          <Radar 
                            name="Doğru" 
                            dataKey="Doğru" 
                            stroke="#22c55e" 
                            fill="#22c55e" 
                            fillOpacity={0.6}
                          />
                          <Radar 
                            name="Yanlış" 
                            dataKey="Yanlış" 
                            stroke="#ef4444" 
                            fill="#ef4444" 
                            fillOpacity={0.6}
                          />
                          <Radar 
                            name="Net" 
                            dataKey="Net" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.6}
                          />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Sıra</TableHead>
                  {!isMobile && <TableHead>ID</TableHead>}
                  <TableHead>Öğrenci</TableHead>
                  <TableHead className="text-center">TÜR</TableHead>
                  <TableHead className="text-center">SOS</TableHead>
                  <TableHead className="text-center">MAT</TableHead>
                  <TableHead className="text-center">FEN</TableHead>
                  <TableHead className="text-center">Toplam</TableHead>
                  <TableHead className="text-right">Başarı %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    {!isMobile && <TableCell className="text-muted-foreground">{student.id}</TableCell>}
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-center font-medium">
                      <span style={{ color: COLORS.turkish }}>{student.turkishNet}</span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      <span style={{ color: COLORS.social }}>{student.socialNet}</span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      <span style={{ color: COLORS.math }}>{student.mathNet}</span>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      <span style={{ color: COLORS.science }}>{student.scienceNet}</span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{student.totalNet}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={student.percentage >= 70 ? "default" : 
                                student.percentage >= 50 ? "secondary" : "outline"}
                        className={`${
                          student.percentage >= 70 ? "bg-green-500" : 
                          student.percentage >= 50 ? "bg-yellow-500" : ""
                        }`}
                      >
                        %{student.percentage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentStatistics;
