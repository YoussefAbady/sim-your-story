import { SimulationInput, SimulationResult } from "@/services/pensionEngine";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Info } from "lucide-react";
import { SalaryPeriod, IllnessPeriod } from "@/pages/Results";

interface PensionReportProps {
  simulationInput: SimulationInput;
  results: SimulationResult;
  expectedPension: number;
  historicalSalaries: SalaryPeriod[];
  futureSalaries: SalaryPeriod[];
  illnessPeriods: IllnessPeriod[];
  customIndexation: number | null;
}

export const PensionReport = ({ 
  simulationInput, 
  results, 
  expectedPension,
  historicalSalaries,
  futureSalaries,
  illnessPeriods,
  customIndexation
}: PensionReportProps) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-background">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">ZUS Pension Forecast Report</h1>
        <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString('pl-PL')}</p>
      </div>

      {/* Disclaimer */}
      <Card className="bg-zus-amber/10 border-zus-amber p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">⚠️ Important Disclaimer</h2>
        <div className="text-sm text-foreground space-y-2">
          <p>This pension forecast is for <strong>educational purposes only</strong> and should not be considered as:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Financial advice or professional consultation</li>
            <li>An official prediction of your future pension benefits</li>
            <li>A guarantee of specific pension amounts</li>
            <li>A substitute for official ZUS calculations</li>
          </ul>
          <p className="mt-3">
            The simulation is based on ZUS actuarial data (2023-2080) and various economic assumptions 
            that may change. Your actual pension may differ significantly based on legislative changes, 
            economic conditions, and your personal circumstances.
          </p>
          <p className="mt-2">
            For official pension estimates, please contact ZUS directly or use their official calculators.
          </p>
        </div>
      </Card>

      {/* User Input Data - Basic */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Basic Input Data</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Age</p>
            <p className="text-lg font-semibold text-foreground">{simulationInput.age} years</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="text-lg font-semibold text-foreground">{simulationInput.sex === 'male' ? 'Male' : 'Female'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Career Start Year</p>
            <p className="text-lg font-semibold text-foreground">{simulationInput.startYear}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Planned Retirement Year</p>
            <p className="text-lg font-semibold text-foreground">{simulationInput.endYear}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gross Monthly Salary</p>
            <p className="text-lg font-semibold text-foreground">{simulationInput.grossSalary.toLocaleString('pl-PL')} PLN</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Funds</p>
            <p className="text-lg font-semibold text-foreground">{(simulationInput.accountFunds || 0).toLocaleString('pl-PL')} PLN</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Include Sick Leave Impact</p>
            <p className="text-lg font-semibold text-foreground">{simulationInput.includeSickLeave ? 'Yes' : 'No'}</p>
          </div>
          {expectedPension > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">Expected Pension Goal</p>
              <p className="text-lg font-semibold text-foreground">{expectedPension.toLocaleString('pl-PL')} PLN</p>
            </div>
          )}
        </div>
      </Card>

      {/* Advanced Options */}
      {(customIndexation !== null || historicalSalaries.length > 0 || futureSalaries.length > 0 || illnessPeriods.length > 0) && (
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Advanced Options Applied</h2>
          
          {customIndexation !== null && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Custom Account Growth Rate</p>
              <p className="text-lg font-semibold text-foreground">{customIndexation.toFixed(2)}%</p>
            </div>
          )}

          {historicalSalaries.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-2">Historical Salary Adjustments</p>
              <div className="space-y-1">
                {historicalSalaries.map(salary => (
                  <div key={salary.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Year {salary.year}:</span>
                    <span className="font-medium">{salary.amount.toLocaleString('pl-PL')} PLN</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {futureSalaries.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-2">Future Salary Projections</p>
              <div className="space-y-1">
                {futureSalaries.map(salary => (
                  <div key={salary.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Year {salary.year}:</span>
                    <span className="font-medium">{salary.amount.toLocaleString('pl-PL')} PLN</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {illnessPeriods.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Illness Periods</p>
              <div className="space-y-1">
                {illnessPeriods.map(period => (
                  <div key={period.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {period.startYear} - {period.endYear}:
                    </span>
                    <span className="font-medium">{period.days} days/year</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Main Results */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Forecast Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Forecast Pension (Nominal)</h3>
              <DollarSign className="w-5 h-5 text-zus-green" />
            </div>
            <p className="text-3xl font-bold text-foreground">{results.actualPension.toLocaleString('pl-PL')} PLN</p>
            <p className="text-xs text-muted-foreground mt-1">per month</p>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Real Pension (2025 Value)</h3>
              <Info className="w-5 h-5 text-zus-blue" />
            </div>
            <p className="text-3xl font-bold text-foreground">{results.realPension.toLocaleString('pl-PL')} PLN</p>
            <p className="text-xs text-muted-foreground mt-1">inflation-adjusted</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Replacement Rate</h3>
            <p className="text-2xl font-bold text-foreground">{results.replacementRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">of indexed final wage</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">vs. Average Benefit</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your forecast:</span>
                <span className="font-medium">{results.actualPension.toLocaleString('pl-PL')} PLN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average in {simulationInput.endYear}:</span>
                <span className="font-medium">{results.averageBenefitAtRetirement.toLocaleString('pl-PL')} PLN</span>
              </div>
              <div className="pt-2 border-t border-border">
                {results.actualPension > results.averageBenefitAtRetirement ? (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zus-green" />
                    <span className="text-zus-green text-sm font-semibold">
                      {((results.actualPension / results.averageBenefitAtRetirement - 1) * 100).toFixed(1)}% above average
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-zus-red" />
                    <span className="text-zus-red text-sm font-semibold">
                      {((1 - results.actualPension / results.averageBenefitAtRetirement) * 100).toFixed(1)}% below average
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sick Leave Impact */}
      {simulationInput.includeSickLeave && (
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Impact of Sick Leave</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Effective wage without illness</p>
              <p className="text-xl font-bold text-foreground">{results.wageWithoutIllness.toLocaleString('pl-PL')} PLN</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effective wage with illness</p>
              <p className="text-xl font-bold text-zus-red">{results.wageWithIllness.toLocaleString('pl-PL')} PLN</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Monthly difference: {(results.wageWithoutIllness - results.wageWithIllness).toLocaleString('pl-PL')} PLN
          </p>
        </Card>
      )}

      {/* Postponement Benefits */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-zus-blue" />
          Effect of Postponing Retirement
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">+1 Year</p>
            <p className="text-xl font-bold text-zus-green">+{results.postponementDeltas.plusOne.toLocaleString('pl-PL')} PLN</p>
          </div>
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">+2 Years</p>
            <p className="text-xl font-bold text-zus-green">+{results.postponementDeltas.plusTwo.toLocaleString('pl-PL')} PLN</p>
          </div>
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">+5 Years</p>
            <p className="text-xl font-bold text-zus-green">+{results.postponementDeltas.plusFive.toLocaleString('pl-PL')} PLN</p>
          </div>
        </div>
      </Card>

      {/* Expected vs Actual */}
      {expectedPension > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Expected Pension Goal Analysis</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Your goal:</span>
              <span className="font-semibold text-lg">{expectedPension.toLocaleString('pl-PL')} PLN</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Forecast amount:</span>
              <span className="font-semibold text-lg">{results.actualPension.toLocaleString('pl-PL')} PLN</span>
            </div>
            <div className="pt-3 border-t border-border">
              {results.actualPension >= expectedPension ? (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-zus-green" />
                  <span className="text-zus-green font-semibold">
                    You'll exceed your goal by {(results.actualPension - expectedPension).toLocaleString('pl-PL')} PLN/month! 🎉
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-zus-red" />
                  <span className="text-zus-red font-semibold">
                    Shortfall: {(expectedPension - results.actualPension).toLocaleString('pl-PL')} PLN/month
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ZUS Contact Information */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Need More Information?</h2>
        <div className="space-y-3 text-sm">
          <p className="text-foreground">
            For official pension calculations and personalized advice, please contact ZUS (Zakład Ubezpieczeń Społecznych):
          </p>
          <div className="space-y-2 ml-4">
            <div>
              <p className="font-semibold text-foreground">ZUS Contact Center:</p>
              <p className="text-muted-foreground">Phone: 22 560 16 00 (Mon-Fri, 7:00-18:00)</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Website:</p>
              <p className="text-muted-foreground">www.zus.pl</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Online Account:</p>
              <p className="text-muted-foreground">PUE ZUS (Platforma Usług Elektronicznych) - www.zus.pl/portal</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">In-Person:</p>
              <p className="text-muted-foreground">Visit your nearest ZUS branch office for personalized consultation</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 italic">
            ZUS officers can provide official pension estimates, review your contribution history, 
            and answer specific questions about your retirement planning.
          </p>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Data source: ZUS Forecast of Pension Fund Revenues and Expenditures 2023-2080 
          (Department of Statistics & Actuarial Forecasts) | 
          Additional sources: GUS, NBP, Ministry of Finance
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Report generated: {new Date().toLocaleString('pl-PL')}
        </p>
      </div>
    </div>
  );
};
