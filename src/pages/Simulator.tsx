import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertCircle, Trophy } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Mock data for initial visualization
const generateMockData = (savingsRate: number, income: number) => {
  const data = [];
  let savings = 10000;
  const age = 25;
  
  for (let year = 0; year <= 40; year++) {
    const currentAge = age + year;
    const monthlySavings = (income * savingsRate) / 100 / 12;
    const yearlyGrowth = savings * 0.07;
    savings += monthlySavings * 12 + yearlyGrowth;
    
    data.push({
      age: currentAge,
      netWorth: Math.round(savings),
      optimistic: Math.round(savings * 1.3),
      pessimistic: Math.round(savings * 0.7),
    });
  }
  return data;
};

export default function Simulator() {
  const [income, setIncome] = useState(60000);
  const [savingsRate, setSavingsRate] = useState(15);
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const [chartData, setChartData] = useState(generateMockData(15, 60000));

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setChartData(generateMockData(savingsRate, income));
      setIsSimulating(false);
    }, 1000);
  };

  const projectedRetirement = chartData[chartData.length - 1]?.netWorth || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Your Financial Timeline</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Trophy className="w-3 h-3" />
                First Simulation
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - AI Mentor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Mentor</h3>
                  <p className="text-xs text-muted-foreground">Your guide</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-sm text-foreground">
                    Great start! At your current savings rate of {savingsRate}%, you're building a
                    solid foundation.
                  </p>
                </div>

                <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                  <p className="text-sm text-foreground">
                    💡 Try increasing your savings rate by just 5% to see how it accelerates your
                    timeline.
                  </p>
                </div>

                <div className="text-xs text-muted-foreground space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Remember: This is educational, not financial advice.</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Center - Timeline & Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Projected at 65</p>
                <p className="text-2xl font-bold text-foreground">
                  ${(projectedRetirement / 1000000).toFixed(2)}M
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
                <p className="text-2xl font-bold text-primary">
                  ${Math.round((income * savingsRate) / 100 / 12)}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Years to Retire</p>
                <p className="text-2xl font-bold text-accent">40</p>
              </Card>
            </div>

            {/* Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Net Worth Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    stroke="hsl(152, 76%, 64%)"
                    fill="none"
                    strokeDasharray="5 5"
                    opacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
                    stroke="hsl(239, 84%, 67%)"
                    strokeWidth={3}
                    fill="url(#colorNetWorth)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pessimistic"
                    stroke="hsl(0, 84%, 60%)"
                    fill="none"
                    strokeDasharray="5 5"
                    opacity={0.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Timeline Events */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Life Milestones</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">30</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Career Growth</h4>
                    <p className="text-sm text-muted-foreground">
                      Projected income increase, savings accelerate
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-accent">45</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Peak Earning Years</h4>
                    <p className="text-sm text-muted-foreground">
                      Maximum contribution phase begins
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6 text-foreground">Adjust Your Future</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-foreground">Annual Income</label>
                    <span className="text-sm font-bold text-primary">${income.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[income]}
                    onValueChange={([value]) => setIncome(value)}
                    min={20000}
                    max={200000}
                    step={5000}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-foreground">Savings Rate</label>
                    <span className="text-sm font-bold text-primary">{savingsRate}%</span>
                  </div>
                  <Slider
                    value={[savingsRate]}
                    onValueChange={([value]) => setSavingsRate(value)}
                    min={0}
                    max={50}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-foreground">Risk Tolerance</label>
                    <span className="text-sm font-bold text-primary">{riskTolerance}%</span>
                  </div>
                  <Slider
                    value={[riskTolerance]}
                    onValueChange={([value]) => setRiskTolerance(value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <Button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                >
                  {isSimulating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run Simulation
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Adjust sliders to see instant changes in your timeline
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
