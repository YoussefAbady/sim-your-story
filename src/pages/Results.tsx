import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import zusLogo from "@/assets/zus-logo.png";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, DollarSign, Info, Settings, RefreshCw, Download, Mail, Eye, Brain } from "lucide-react";
import { QuizWizard } from "@/components/quiz/QuizWizard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmailReportDialog } from "@/components/report/EmailReportDialog";
import { PensionReport } from "@/components/report/PensionReport";
import { useToast } from "@/hooks/use-toast";
import { PensionEngine, SimulationInput, SimulationResult } from "@/services/pensionEngine";
import { PENSION_FACTS } from "@/services/pensionData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountGrowthChart } from "@/components/dashboard/AccountGrowthChart";
import { HistoricalSalaryInput } from "@/components/dashboard/HistoricalSalaryInput";
import { FutureSalaryInput } from "@/components/dashboard/FutureSalaryInput";
import { IllnessPeriodInput } from "@/components/dashboard/IllnessPeriodInput";
import { EducationalInput } from "@/components/education/EducationalInput";
import { EducationalCard } from "@/components/education/EducationalCard";
import { useEducation } from "@/contexts/EducationContext";
import { EDUCATION_TIPS } from "@/data/educationContent";
import { useLocale } from "@/contexts/LocaleContext";

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

export default function Results() {
  const navigate = useNavigate();
  const { showTip } = useEducation();
  const { t } = useLocale();
  const [simulationInput, setSimulationInput] = useState<SimulationInput | null>(null);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [expectedPension, setExpectedPension] = useState<number>(0);
  const [historicalSalaries, setHistoricalSalaries] = useState<SalaryPeriod[]>([]);
  const [futureSalaries, setFutureSalaries] = useState<SalaryPeriod[]>([]);
  const [illnessPeriods, setIllnessPeriods] = useState<IllnessPeriod[]>([]);
  const [customIndexation, setCustomIndexation] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("growth");
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const { toast } = useToast();

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
    runSimulation(input);
  }, [navigate]);

  const runSimulation = (input: SimulationInput) => {
    // Apply advanced settings to the simulation input
    const enhancedInput: SimulationInput = {
      ...input,
      customIndexation,
      historicalSalaries: historicalSalaries.map(s => ({ year: s.year, amount: s.amount })),
      futureSalaries: futureSalaries.map(s => ({ year: s.year, amount: s.amount })),
      illnessPeriods: illnessPeriods.map(p => ({ 
        startYear: p.startYear, 
        endYear: p.endYear, 
        days: p.days 
      }))
    };
    
    const simulationResults = PensionEngine.simulate(enhancedInput);
    setResults(simulationResults);

    // Log simulation usage (fire and forget)
    const postalCode = (input as any).postalCode;
    import('@/services/simulationLogger').then(({ logSimulationUsage }) => {
      logSimulationUsage(input, simulationResults, expectedPension, postalCode);
    });
  };

  const handleUpdateForecast = () => {
    if (!simulationInput) return;
    
    setIsUpdating(true);
    
    // Run simulation with updated settings
    setTimeout(() => {
      runSimulation(simulationInput);
      setIsUpdating(false);
    }, 300);
  };

  const handleResetChanges = () => {
    setCustomIndexation(null);
    setHistoricalSalaries([]);
    setFutureSalaries([]);
    setIllnessPeriods([]);
    
    // Re-run simulation with original input
    if (simulationInput) {
      runSimulation(simulationInput);
    }
  };

  const handleDownloadReport = () => {
    // Store current state in sessionStorage for report
    if (results) {
      sessionStorage.setItem("simulationResults", JSON.stringify(results));
      sessionStorage.setItem("historicalSalaries", JSON.stringify(historicalSalaries));
      sessionStorage.setItem("futureSalaries", JSON.stringify(futureSalaries));
      sessionStorage.setItem("illnessPeriods", JSON.stringify(illnessPeriods));
      if (customIndexation !== null) {
        sessionStorage.setItem("customIndexation", customIndexation.toString());
      }
    }
    
    // Trigger print dialog (user can save as PDF)
    window.print();
  };

  const handleViewReport = () => {
    // Store current state for report view
    if (results) {
      sessionStorage.setItem("simulationResults", JSON.stringify(results));
      sessionStorage.setItem("historicalSalaries", JSON.stringify(historicalSalaries));
      sessionStorage.setItem("futureSalaries", JSON.stringify(futureSalaries));
      sessionStorage.setItem("illnessPeriods", JSON.stringify(illnessPeriods));
      if (customIndexation !== null) {
        sessionStorage.setItem("customIndexation", customIndexation.toString());
      }
    }
    
    navigate("/report");
  };

  const handleSendEmail = async (email: string, allowContact: boolean) => {
    // TODO: Implement email sending via edge function
    // For now, just show a toast
    toast({
      title: "Email functionality coming soon",
      description: "Please use Download or View options for now.",
    });
    
    console.log("Email report to:", email, "Allow contact:", allowContact);
  };

  if (!results || !simulationInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('results.loadingResults')}</p>
      </div>
    );
  }

  const yearsNeeded = expectedPension > 0 
    ? PensionEngine.calculateYearsForExpectedPension(results, expectedPension, simulationInput)
    : undefined;

  const randomFact = PENSION_FACTS[Math.floor(Math.random() * PENSION_FACTS.length)];

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background">
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="border-b border-border bg-card sticky top-0 z-10">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/simulation")}
                    className="gap-2"
                    aria-label="Back to simulation form"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('results.back')}
                  </Button>
                  <Link to="/">
                    <img 
                      src={zusLogo} 
                      alt="ZUS - Zakład Ubezpieczeń Społecznych" 
                      className="h-10 md:h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{t('simulation.retirementSimulator')}</h1>
                </div>
                <SidebarTrigger className="gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">{t('results.advancedControls')}</span>
                </SidebarTrigger>
              </div>
            </div>
          </header>

          <main id="main-content" className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* Disclaimer */}
        <Card className="bg-zus-amber/10 border-zus-amber p-4 mb-6">
          <p className="text-sm font-semibold text-foreground">
            {t('results.disclaimer')}
          </p>
        </Card>

        {/* Main Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Actual Pension */}
          <EducationalCard 
            educationKey="nominalPension"
            userData={{ 
              pension: results.actualPension,
              retirementYear: simulationInput.endYear,
              salary: simulationInput.grossSalary,
              yearsWorked: simulationInput.endYear - simulationInput.startYear
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-muted-foreground">{t('results.forecastNominal')}</h2>
                  <p className="text-4xl font-bold text-foreground mt-2">
                    {results.actualPension.toLocaleString('pl-PL')} PLN
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{t('results.perMonth')}</p>
                </div>
                <DollarSign className="w-8 h-8 text-zus-green" aria-hidden="true" />
              </div>
            </div>
          </EducationalCard>

          {/* Real Pension */}
          <EducationalCard 
            educationKey="realPension"
            userData={{ 
              nominalPension: results.actualPension,
              realPension: results.realPension,
              inflationImpact: results.actualPension - results.realPension
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-muted-foreground">{t('results.realPension')}</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" aria-label="More information" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t('results.realPensionInfo')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {results.realPension.toLocaleString('pl-PL')} PLN
              </p>
              <p className="text-sm text-muted-foreground mt-1">{t('results.value2025')}</p>
            </div>
          </EducationalCard>
        </div>

        {/* Comparison & Replacement Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Average Benefit Comparison */}
          <EducationalCard 
            educationKey="averageComparison"
            userData={{ 
              yourPension: results.actualPension,
              averagePension: results.averageBenefitAtRetirement,
              percentageDifference: ((results.actualPension / results.averageBenefitAtRetirement - 1) * 100).toFixed(1)
            }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('results.vsAverage')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('results.yourForecast')}</span>
                  <span className="font-semibold">{results.actualPension.toLocaleString('pl-PL')} PLN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('results.avgIn').replace('{year}', String(simulationInput.endYear))}</span>
                  <span className="font-semibold">{results.averageBenefitAtRetirement.toLocaleString('pl-PL')} PLN</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    {results.actualPension > results.averageBenefitAtRetirement ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-zus-green" aria-hidden="true" />
                        <span className="text-zus-green font-semibold">
                          {t('results.aboveAverage').replace('{percent}', ((results.actualPension / results.averageBenefitAtRetirement - 1) * 100).toFixed(1))}
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-5 h-5 text-zus-red" aria-hidden="true" />
                        <span className="text-zus-red font-semibold">
                          {t('results.belowAverage').replace('{percent}', ((1 - results.actualPension / results.averageBenefitAtRetirement) * 100).toFixed(1))}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </EducationalCard>

          {/* Replacement Rate */}
          <EducationalCard 
            educationKey="replacementRate"
            userData={{ 
              replacementRate: results.replacementRate,
              pension: results.actualPension,
              finalWage: results.actualPension / (results.replacementRate / 100)
            }}
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-foreground">{t('results.replacementRate')}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" aria-label="More information" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{t('results.replacementRateInfo')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-4xl font-bold text-foreground">
                {results.replacementRate.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('results.ofFinalWage')}
              </p>
            </div>
          </EducationalCard>
        </div>

        {/* Sick Leave Impact (if enabled) */}
        {simulationInput.includeSickLeave && (
          <EducationalCard 
            educationKey="sickLeaveImpact"
            userData={{ 
              wageWithoutIllness: results.wageWithoutIllness,
              wageWithIllness: results.wageWithIllness,
              impact: results.wageWithoutIllness - results.wageWithIllness
            }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('results.sickLeaveImpact')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('results.wageWithout')}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {results.wageWithoutIllness.toLocaleString('pl-PL')} PLN
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('results.wageWith')}</p>
                  <p className="text-2xl font-bold text-zus-red">
                    {results.wageWithIllness.toLocaleString('pl-PL')} PLN
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {t('results.difference').replace('{amount}', (results.wageWithoutIllness - results.wageWithIllness).toLocaleString('pl-PL'))}
              </p>
            </div>
          </EducationalCard>
        )}

        {/* Postponement Benefits */}
        <EducationalCard 
          educationKey="postponement"
          userData={{ 
            plusOne: results.postponementDeltas.plusOne,
            plusTwo: results.postponementDeltas.plusTwo,
            plusFive: results.postponementDeltas.plusFive,
            currentPension: results.actualPension
          }}
          className="mb-8"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zus-blue" aria-hidden="true" />
              {t('results.postponement')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{t('results.plusOneYear')}</p>
                <p className="text-2xl font-bold text-zus-green">
                  +{results.postponementDeltas.plusOne.toLocaleString('pl-PL')} PLN
                </p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{t('results.plusTwoYears')}</p>
                <p className="text-2xl font-bold text-zus-green">
                  +{results.postponementDeltas.plusTwo.toLocaleString('pl-PL')} PLN
                </p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{t('results.plusFiveYears')}</p>
                <p className="text-2xl font-bold text-zus-green">
                  +{results.postponementDeltas.plusFive.toLocaleString('pl-PL')} PLN
                </p>
              </div>
            </div>
          </div>
        </EducationalCard>

        {/* Expected vs Actual */}
        {expectedPension > 0 && (
          <EducationalCard 
            educationKey="expectedVsActual"
            userData={{ 
              expectedPension,
              actualPension: results.actualPension,
              shortfall: expectedPension - results.actualPension,
              yearsNeeded
            }}
            className="mb-8"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('results.expectedGoal')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('results.youWanted')}</span>
                  <span className="font-semibold">{expectedPension.toLocaleString('pl-PL')} PLN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('results.youWillGet')}</span>
                  <span className="font-semibold">{results.actualPension.toLocaleString('pl-PL')} PLN</span>
                </div>
                <div className="pt-2 border-t border-border">
                  {results.actualPension >= expectedPension ? (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-zus-green" aria-hidden="true" />
                      <span className="text-zus-green font-semibold">
                        {t('results.exceedGoal')}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-zus-red" aria-hidden="true" />
                        <span className="text-zus-red font-semibold">
                          {t('results.shortfall').replace('{amount}', (expectedPension - results.actualPension).toLocaleString('pl-PL'))}
                        </span>
                      </div>
                      {yearsNeeded !== undefined ? (
                        <p className="text-sm text-muted-foreground">
                          {t('results.yearsNeeded').replace('{years}', String(yearsNeeded))}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {t('results.notAchievable')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </EducationalCard>
        )}

        {/* Did You Know? */}
        <Card className="p-6 bg-zus-blue/5 border-zus-blue">
          <h3 className="text-lg font-semibold text-foreground mb-3">💡 {t('education.didYouKnow')}</h3>
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
                {t('results.runNewSimulation')}
              </Button>
              
              <Button
                onClick={() => setQuizDialogOpen(true)}
                size="lg"
                variant="secondary"
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Brain className="w-5 h-5" />
                Take Quiz! 🎯 (Earn up to 500 pts)
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Download className="w-4 h-4" />
                    {t('results.exportReport')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleDownloadReport} className="gap-2 cursor-pointer">
                    <Download className="w-4 h-4" />
                    {t('results.download')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEmailDialogOpen(true)} className="gap-2 cursor-pointer">
                    <Mail className="w-4 h-4" />
                    {t('results.emailReport')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleViewReport} className="gap-2 cursor-pointer">
                    <Eye className="w-4 h-4" />
                    {t('results.viewReport')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <EmailReportDialog
              open={emailDialogOpen}
              onOpenChange={setEmailDialogOpen}
              onSendEmail={handleSendEmail}
            />
            
            <QuizWizard
              open={quizDialogOpen}
              onOpenChange={setQuizDialogOpen}
            />

            {/* Data Source Footer */}
            <footer className="mt-12 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {t('results.dataSource')}
              </p>
            </footer>
          </main>
        </div>

        <Sidebar side="right" className="border-l" collapsible="offcanvas">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span className="font-semibold">{t('results.sidebar.editOptions')}</span>
            </div>
            <SidebarTrigger />
          </div>
          <SidebarContent>
            <div className="p-4 border-b space-y-2">
              <Button 
                onClick={handleUpdateForecast}
                disabled={isUpdating}
                className="w-full gap-2"
                size="lg"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? t('results.sidebar.updating') : t('results.sidebar.updateForecast')}
              </Button>
              <Button 
                onClick={handleResetChanges}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {t('results.sidebar.resetAllChanges')}
              </Button>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="growth" className="text-xs">{t('results.sidebar.tabs.growth')}</TabsTrigger>
                    <TabsTrigger value="historical" className="text-xs">{t('results.sidebar.tabs.history')}</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="future" className="text-xs">{t('results.sidebar.tabs.future')}</TabsTrigger>
                    <TabsTrigger value="illness" className="text-xs">{t('results.sidebar.tabs.illness')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="growth" className="space-y-4 px-2">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">{t('results.sidebar.growthHeader')}</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        {t('results.sidebar.growthDesc').replace('{start}', String(simulationInput?.startYear ?? '—')).replace('{end}', String(simulationInput?.endYear ?? '—'))}
                      </p>
                      {simulationInput && (
                        <div className="w-full h-[300px]">
                          <AccountGrowthChart simulationInput={simulationInput} />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="historical" className="space-y-4 px-2">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">{t('results.sidebar.historicalHeader')}</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        {t('results.sidebar.historicalDesc')}
                      </p>
                      {simulationInput && (
                        <HistoricalSalaryInput
                          simulationInput={simulationInput}
                          salaries={historicalSalaries}
                          onSalariesChange={setHistoricalSalaries}
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="future" className="space-y-4 px-2">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">{t('results.sidebar.futureHeader')}</h3>
                      <div className="mb-4">
                        <Label htmlFor="custom-indexation" className="text-xs">
                          {t('results.sidebar.customGrowthRate')}
                        </Label>
                        <EducationalInput
                          id="custom-indexation"
                          type="number"
                          step="0.1"
                          placeholder={t('results.sidebar.placeholderExample')}
                          value={customIndexation ?? ""}
                          onChange={(e) => setCustomIndexation(e.target.value ? parseFloat(e.target.value) : null)}
                          className="mt-1"
                          educationKey="indexation"
                        />
                      </div>
                      {simulationInput && (
                        <FutureSalaryInput
                          simulationInput={simulationInput}
                          salaries={futureSalaries}
                          onSalariesChange={setFutureSalaries}
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="illness" className="space-y-4 px-2">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">{t('results.sidebar.illnessHeader')}</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        {t('results.sidebar.illnessDesc')}
                      </p>
                      {simulationInput && (
                        <IllnessPeriodInput
                          simulationInput={simulationInput}
                          periods={illnessPeriods}
                          onPeriodsChange={setIllnessPeriods}
                        />
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
