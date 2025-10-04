import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, BarChart3, TrendingUp } from "lucide-react";
import { SimulationInput } from "@/services/pensionEngine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountGrowthChart } from "@/components/dashboard/AccountGrowthChart";
import { HistoricalSalaryInput } from "@/components/dashboard/HistoricalSalaryInput";
import { FutureSalaryInput } from "@/components/dashboard/FutureSalaryInput";
import { IllnessPeriodInput } from "@/components/dashboard/IllnessPeriodInput";
import { toast } from "sonner";

export interface SalaryPeriod {
  id: string;
  year: number;
  amount: number;
}

export interface IllnessPeriod {
  id: string;
  startYear: number;
  endYear: number;
  days: number;
}

export interface CustomIndexation {
  year: number;
  rate: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [simulationInput, setSimulationInput] = useState<SimulationInput | null>(null);
  const [historicalSalaries, setHistoricalSalaries] = useState<SalaryPeriod[]>([]);
  const [futureSalaries, setFutureSalaries] = useState<SalaryPeriod[]>([]);
  const [illnessPeriods, setIllnessPeriods] = useState<IllnessPeriod[]>([]);
  const [customIndexation, setCustomIndexation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("growth");

  useEffect(() => {
    // Retrieve simulation data from sessionStorage
    const storedData = sessionStorage.getItem("simulationData");
    
    if (!storedData) {
      navigate("/simulation");
      return;
    }

    const input: SimulationInput = JSON.parse(storedData);
    setSimulationInput(input);
  }, [navigate]);

  if (!simulationInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const handleSaveAdvancedSettings = () => {
    const advancedSettings = {
      historicalSalaries,
      futureSalaries,
      illnessPeriods,
      customIndexation,
    };
    
    sessionStorage.setItem("advancedSettings", JSON.stringify(advancedSettings));
    toast.success("Advanced settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/results")}
              className="gap-2"
              aria-label="Back to results"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Advanced Pension Dashboard</h1>
              <p className="text-muted-foreground mt-2">Fine-tune your pension forecast with detailed adjustments</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="growth" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Account Growth
            </TabsTrigger>
            <TabsTrigger value="historical" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Historical Salaries
            </TabsTrigger>
            <TabsTrigger value="future" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Future Projections
            </TabsTrigger>
            <TabsTrigger value="illness" className="gap-2">
              <Plus className="w-4 h-4" />
              Illness Periods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">ZUS Account Growth Over Time</h2>
              <p className="text-muted-foreground mb-6">
                Visualize how your main account and sub-account balances grow from {simulationInput.startYear} to {simulationInput.endYear}
              </p>
              <AccountGrowthChart simulationInput={simulationInput} />
            </Card>
          </TabsContent>

          <TabsContent value="historical" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Historical Salary Adjustments</h2>
              <p className="text-muted-foreground mb-6">
                Enter specific salary amounts for different years in the past to improve accuracy
              </p>
              <HistoricalSalaryInput
                simulationInput={simulationInput}
                salaries={historicalSalaries}
                onSalariesChange={setHistoricalSalaries}
              />
            </Card>
          </TabsContent>

          <TabsContent value="future" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Future Salary Projections</h2>
              <p className="text-muted-foreground mb-6">
                Customize future salary expectations or use a custom wage growth rate
              </p>
              
              <div className="mb-6">
                <Label htmlFor="custom-indexation" className="text-base font-semibold mb-2 block">
                  Custom Wage Growth Rate (%)
                </Label>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      id="custom-indexation"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 3.5"
                      value={customIndexation ?? ""}
                      onChange={(e) => setCustomIndexation(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Leave blank to use default ZUS forecast rates
                    </p>
                  </div>
                  {customIndexation !== null && (
                    <Button
                      variant="outline"
                      onClick={() => setCustomIndexation(null)}
                    >
                      Reset to Default
                    </Button>
                  )}
                </div>
              </div>

              <FutureSalaryInput
                simulationInput={simulationInput}
                salaries={futureSalaries}
                onSalariesChange={setFutureSalaries}
              />
            </Card>
          </TabsContent>

          <TabsContent value="illness" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Illness Period Management</h2>
              <p className="text-muted-foreground mb-6">
                Specify periods of illness (past and future) to see their impact on your pension
              </p>
              <IllnessPeriodInput
                simulationInput={simulationInput}
                periods={illnessPeriods}
                onPeriodsChange={setIllnessPeriods}
              />
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border">
          <Button
            onClick={handleSaveAdvancedSettings}
            size="lg"
            className="gap-2"
          >
            Save Advanced Settings
          </Button>
          <Button
            onClick={() => navigate("/results")}
            variant="outline"
            size="lg"
          >
            View Results
          </Button>
        </div>
      </main>
    </div>
  );
}
