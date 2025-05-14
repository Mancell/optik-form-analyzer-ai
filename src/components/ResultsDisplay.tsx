
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnswers } from "@/contexts/AnswerContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ResultsDisplay: React.FC = () => {
  const { studentInfo, calculateResults } = useAnswers();

  // Calculate results if they don't exist
  React.useEffect(() => {
    if (studentInfo && !studentInfo.results) {
      calculateResults();
    }
  }, [studentInfo, calculateResults]);

  if (!studentInfo || !studentInfo.results) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Sonuçlar hazırlanıyor...</p>
      </div>
    );
  }

  const { name, results } = studentInfo;

  // Prepare data for bar chart
  const barChartData = [
    {
      name: "Türkçe",
      doğru: results.turkish.correct,
      yanlış: results.turkish.incorrect,
      boş: results.turkish.empty,
      color: "#3B82F6",
    },
    {
      name: "Sosyal",
      doğru: results.social.correct,
      yanlış: results.social.incorrect,
      boş: results.social.empty,
      color: "#10B981",
    },
    {
      name: "Matematik",
      doğru: results.math.correct,
      yanlış: results.math.incorrect,
      boş: results.math.empty,
      color: "#8B5CF6",
    },
    {
      name: "Fen",
      doğru: results.science.correct,
      yanlış: results.science.incorrect,
      boş: results.science.empty,
      color: "#F59E0B",
    },
  ];

  // Colors for pie chart
  const COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

  // Prepare data for pie chart (total correct answers by subject)
  const pieChartData = [
    { name: "Türkçe", value: results.turkish.correct },
    { name: "Sosyal", value: results.social.correct },
    { name: "Matematik", value: results.math.correct },
    { name: "Fen", value: results.science.correct },
  ];

  // Calculate overall success percentage
  const totalCorrect =
    results.turkish.correct +
    results.social.correct +
    results.math.correct +
    results.science.correct;

  const totalQuestions =
    results.turkish.total +
    results.social.total +
    results.math.total +
    results.science.total;

  const successPercentage = ((totalCorrect / totalQuestions) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Öğrenci Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-muted-foreground text-sm mt-1">
            Genel Başarı: <span className="font-medium text-primary">{successPercentage}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {barChartData.map((subject) => (
          <Card key={subject.name} className="overflow-hidden">
            <div
              className="h-2"
              style={{ backgroundColor: subject.color }}
            ></div>
            <CardHeader className="py-3">
              <CardTitle className="text-base">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {subject.doğru}
                  </div>
                  <div className="text-xs text-muted-foreground">Doğru</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-500">
                    {subject.yanlış}
                  </div>
                  <div className="text-xs text-muted-foreground">Yanlış</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-400">
                    {subject.boş}
                  </div>
                  <div className="text-xs text-muted-foreground">Boş</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-xs text-muted-foreground">Net (4 Yanlış 1 Doğru Götürür)</div>
                <div className="text-lg font-semibold">
                  {subject.name === "Türkçe" ? results.turkish.net :
                   subject.name === "Sosyal" ? results.social.net :
                   subject.name === "Matematik" ? results.math.net :
                   results.science.net}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ders Başına Doğru Sayısı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
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
                  />
                  <Bar
                    dataKey="yanlış"
                    name="Yanlış"
                    fill="#ef4444"
                  />
                  <Bar
                    dataKey="boş"
                    name="Boş"
                    fill="#9ca3af"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doğru Cevap Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 1.5;
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#888"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {`${name} ${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
