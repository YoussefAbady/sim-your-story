import { useMemo } from "react";
import { SimulationInput } from "@/services/pensionEngine";
import { INDEXATION_DATA } from "@/services/pensionData";
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
import { Baby, User, Users, Briefcase, Heart } from "lucide-react";

interface AccountGrowthChartProps {
  simulationInput: SimulationInput;
}

export function AccountGrowthChart({ simulationInput }: AccountGrowthChartProps) {
  const getAgeIcon = (age: number) => {
    if (age < 18) return "👶";
    if (age < 30) return "🧑";
    if (age < 45) return "👨‍💼";
    if (age < 60) return "👴";
    return "🎂";
  };

  const chartData = useMemo(() => {
    const data = [];
    const CONTRIBUTION_RATE = 0.1952;
    const currentYear = new Date().getFullYear();
    const currentAge = simulationInput.age;
    const yearsFromNow = simulationInput.startYear - currentYear;
    
    let accountBalance = 0;
    let subAccountBalance = 0;
    
    for (let year = simulationInput.startYear; year <= simulationInput.endYear; year++) {
      // Calculate wage for this year using indexation
      let wage = simulationInput.grossSalary;
      
      // Apply wage growth from start year to current year
      for (let y = simulationInput.startYear; y < year; y++) {
        const growthRate = INDEXATION_DATA.wageGrowth[y] || 0.035; // Default 3.5%
        wage *= (1 + growthRate);
      }
      
      // Calculate annual contribution
      const annualContribution = wage * 12 * CONTRIBUTION_RATE;
      
      // Split into main account (85%) and sub-account (15%)
      accountBalance += annualContribution * 0.85;
      subAccountBalance += annualContribution * 0.15;
      
      const yearsSinceStart = year - simulationInput.startYear;
      const age = currentAge + yearsFromNow + yearsSinceStart;
      
      data.push({
        year,
        age,
        ageIcon: getAgeIcon(age),
        mainAccount: Math.round(accountBalance),
        subAccount: Math.round(subAccountBalance),
        total: Math.round(accountBalance + subAccountBalance),
      });
    }
    
    return data;
  }, [simulationInput]);

  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="year" 
            className="text-xs"
            tick={(props) => {
              const { x, y, payload } = props;
              const dataPoint = chartData.find(d => d.year === payload.value);
              return (
                <g transform={`translate(${x},${y})`}>
                  <text 
                    x={0} 
                    y={0} 
                    dy={16} 
                    textAnchor="middle" 
                    fill="hsl(var(--muted-foreground))"
                    fontSize={10}
                  >
                    {payload.value}
                  </text>
                  <text 
                    x={0} 
                    y={0} 
                    dy={28}
                    textAnchor="middle"
                    fontSize={16}
                  >
                    {dataPoint?.ageIcon || ""}
                  </text>
                  <text 
                    x={0} 
                    y={0} 
                    dy={42}
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    fontSize={9}
                  >
                    {dataPoint?.age}y
                  </text>
                </g>
              );
            }}
            height={60}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => `${value.toLocaleString('pl-PL')} PLN`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="mainAccount" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            name="Main Account (85%)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="subAccount" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2}
            name="Sub-Account (15%)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={3}
            name="Total Balance"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
