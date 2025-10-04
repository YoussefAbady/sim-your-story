import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, DollarSign, Info } from "lucide-react";
import { PensionEngine, SimulationInput, SimulationResult } from "@/services/pensionEngine";
import { PENSION_FACTS } from "@/services/pensionData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Results() {
  const navigate = useNavigate();
  const [simulationInput, setSimulationInput] = useState<SimulationInput | null>(null);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [expectedPension, setExpectedPension] = useState<number>(0);

  useEffect(() => {
    // Retrieve simulation data from sessionStorage
    const storedData = sessionStorage.getItem("simulationData");
    const storedExpected = sessionStorage.getItem("expectedPension");
    
    if (!storedData) {
      navigate("/simulation");
      return;
    }

    const input: SimulationInput = JSON.parse(storedData);
    setSimulationInput(input);
    
    if (storedExpected) {
      setExpectedPension(parseFloat(storedExpected));
    }

    // Run simulation
    const simulationResults = PensionEngine.simulate(input);
    setResults(simulationResults);
  }, [navigate]);

  if (!results || !simulationInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  const yearsNeeded = expectedPension > 0 
    ? PensionEngine.calculateYearsForExpectedPension(results, expectedPension, simulationInput)
    : undefined;

  const randomFact = PENSION_FACTS[Math.floor(Math.random() * PENSION_FACTS.length)];

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
              onClick={() => navigate("/simulation")}
              className="gap-2"
              aria-label="Back to simulation form"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Pension Forecast</h1>
              <p className="text-muted-foreground mt-2">Based on ZUS actuarial data (2023-2080)</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Disclaimer */}
        <Card className="bg-zus-amber/10 border-zus-amber p-4 mb-6">
          <p className="text-sm font-semibold text-foreground">
            ⚠️ Educational simulator. Not financial advice. Not a prediction.
          </p>
        </Card>

        {/* Main Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Actual Pension */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-muted-foreground">Forecast Pension (Nominal)</h2>
                <p className="text-4xl font-bold text-foreground mt-2">
                  {results.actualPension.toLocaleString('pl-PL')} PLN
                </p>
                <p className="text-sm text-muted-foreground mt-1">per month</p>
              </div>
              <DollarSign className="w-8 h-8 text-zus-green" aria-hidden="true" />
            </div>
          </Card>

          {/* Real Pension */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-muted-foreground">Real Pension (Inflation-Adjusted)</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" aria-label="More information" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Adjusted for inflation using CPI to show purchasing power in today's terms</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {results.realPension.toLocaleString('pl-PL')} PLN
            </p>
            <p className="text-sm text-muted-foreground mt-1">per month (2025 value)</p>
          </Card>
        </div>

        {/* Comparison & Replacement Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Average Benefit Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">vs. Average Benefit</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Your forecast:</span>
                <span className="font-semibold">{results.actualPension.toLocaleString('pl-PL')} PLN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. in {simulationInput.endYear}:</span>
                <span className="font-semibold">{results.averageBenefitAtRetirement.toLocaleString('pl-PL')} PLN</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  {results.actualPension > results.averageBenefitAtRetirement ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-zus-green" aria-hidden="true" />
                      <span className="text-zus-green font-semibold">
                        {((results.actualPension / results.averageBenefitAtRetirement - 1) * 100).toFixed(1)}% above average
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-5 h-5 text-zus-red" aria-hidden="true" />
                      <span className="text-zus-red font-semibold">
                        {((1 - results.actualPension / results.averageBenefitAtRetirement) * 100).toFixed(1)}% below average
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Replacement Rate */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground">Replacement Rate</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" aria-label="More information" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Your pension as a percentage of your indexed wage at retirement. Shows how well your pension replaces your working income.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {results.replacementRate.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              of indexed final wage
            </p>
          </Card>
        </div>

        {/* Sick Leave Impact (if enabled) */}
        {simulationInput.includeSickLeave && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Impact of Sick Leave</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Effective wage without illness:</p>
                <p className="text-2xl font-bold text-foreground">
                  {results.wageWithoutIllness.toLocaleString('pl-PL')} PLN
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Effective wage with illness:</p>
                <p className="text-2xl font-bold text-zus-red">
                  {results.wageWithIllness.toLocaleString('pl-PL')} PLN
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Difference: {(results.wageWithoutIllness - results.wageWithIllness).toLocaleString('pl-PL')} PLN/month
            </p>
          </Card>
        )}

        {/* Postponement Benefits */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zus-blue" aria-hidden="true" />
            Effect of Postponing Retirement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">+1 Year</p>
              <p className="text-2xl font-bold text-zus-green">
                +{results.postponementDeltas.plusOne.toLocaleString('pl-PL')} PLN
              </p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">+2 Years</p>
              <p className="text-2xl font-bold text-zus-green">
                +{results.postponementDeltas.plusTwo.toLocaleString('pl-PL')} PLN
              </p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">+5 Years</p>
              <p className="text-2xl font-bold text-zus-green">
                +{results.postponementDeltas.plusFive.toLocaleString('pl-PL')} PLN
              </p>
            </div>
          </div>
        </Card>

        {/* Expected vs Actual */}
        {expectedPension > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Expected Pension Goal</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">You wanted:</span>
                <span className="font-semibold">{expectedPension.toLocaleString('pl-PL')} PLN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">You'll get:</span>
                <span className="font-semibold">{results.actualPension.toLocaleString('pl-PL')} PLN</span>
              </div>
              <div className="pt-2 border-t border-border">
                {results.actualPension >= expectedPension ? (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-zus-green" aria-hidden="true" />
                    <span className="text-zus-green font-semibold">
                      You'll exceed your goal! 🎉
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-zus-red" aria-hidden="true" />
                      <span className="text-zus-red font-semibold">
                        Shortfall: {(expectedPension - results.actualPension).toLocaleString('pl-PL')} PLN/month
                      </span>
                    </div>
                    {yearsNeeded !== undefined ? (
                      <p className="text-sm text-muted-foreground">
                        To reach your goal, you would need to work approximately <strong>{yearsNeeded} more year{yearsNeeded !== 1 ? 's' : ''}</strong> beyond your planned retirement.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Your expected pension may not be achievable within a reasonable timeframe with current salary levels.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Did You Know? */}
        <Card className="p-6 bg-zus-blue/5 border-zus-blue">
          <h3 className="text-lg font-semibold text-foreground mb-3">💡 Did You Know?</h3>
          <p className="text-foreground">{randomFact}</p>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={() => navigate("/simulation")}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            Run New Simulation
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="gap-2"
          >
            Advanced Dashboard
          </Button>
        </div>

        {/* Data Source Footer */}
        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Data source: ZUS Forecast of Pension Fund Revenues and Expenditures 2023-2080 
            (Department of Statistics & Actuarial Forecasts) | 
            Additional sources: GUS, NBP, Ministry of Finance
          </p>
        </footer>
      </main>
    </div>
  );
}
