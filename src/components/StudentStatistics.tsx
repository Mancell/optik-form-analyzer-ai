
import React, { useMemo } from "react";
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
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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

const StudentStatistics: React.FC<StudentStatisticsProps> = ({ title, students, type }) => {
  const isMobile = useIsMobile();
  
  // Sınıf ortalamalarını hesapla
  const averages = useMemo(() => {
    if (students.length === 0) return null;
    
    const sums = {
      turkish: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      social: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      math: { correct: 0, incorrect: 0, empty: 0, total: 0 },
      science: { correct: 0, incorrect: 0, empty: 0, total: 0 },
    };
    
    students.forEach(student => {
      Object.keys(sums).forEach(subject => {
        const typedSubject = subject as keyof typeof sums;
        sums[typedSubject].correct += student.results[typedSubject].correct;
        sums[typedSubject].incorrect += student.results[typedSubject].incorrect;
        sums[typedSubject].empty += student.results[typedSubject].empty;
        sums[typedSubject].total = student.results[typedSubject].total;
      });
    });
    
    const count = students.length;
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
  }, [students]);

  // Tablo için veri hazırlama
  const tableData = useMemo(() => {
    return students.map(student => {
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
  }, [students]);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
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
        
        <Card className="overflow-hidden">
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
        
        <Card className="overflow-hidden">
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
        
        <Card className="overflow-hidden">
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
      
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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
          </div>
          
          <div className="rounded-md border">
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
