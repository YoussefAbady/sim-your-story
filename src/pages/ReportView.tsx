import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { PensionReport } from "@/components/report/PensionReport";
import { Header } from "@/components/Header";
import { SimulationInput, SimulationResult } from "@/services/pensionEngine";
import { SalaryPeriod, IllnessPeriod } from "@/pages/Results";

export default function ReportView() {
  const navigate = useNavigate();
  const [simulationInput, setSimulationInput] = useState<SimulationInput | null>(null);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [expectedPension, setExpectedPension] = useState<number>(0);
  const [historicalSalaries, setHistoricalSalaries] = useState<SalaryPeriod[]>([]);
  const [futureSalaries, setFutureSalaries] = useState<SalaryPeriod[]>([]);
  const [illnessPeriods, setIllnessPeriods] = useState<IllnessPeriod[]>([]);
  const [customIndexation, setCustomIndexation] = useState<number | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("simulationData");
    const storedResults = sessionStorage.getItem("simulationResults");
    const storedExpected = sessionStorage.getItem("expectedPension");
    const storedHistorical = sessionStorage.getItem("historicalSalaries");
    const storedFuture = sessionStorage.getItem("futureSalaries");
    const storedIllness = sessionStorage.getItem("illnessPeriods");
    const storedIndexation = sessionStorage.getItem("customIndexation");

    if (!storedData || !storedResults) {
      navigate("/simulation");
      return;
    }

    setSimulationInput(JSON.parse(storedData));
    setResults(JSON.parse(storedResults));
    
    if (storedExpected) setExpectedPension(parseFloat(storedExpected));
    if (storedHistorical) setHistoricalSalaries(JSON.parse(storedHistorical));
    if (storedFuture) setFutureSalaries(JSON.parse(storedFuture));
    if (storedIllness) setIllnessPeriods(JSON.parse(storedIllness));
    if (storedIndexation) setCustomIndexation(parseFloat(storedIndexation));
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!results || !simulationInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden">
        <Header />
      </div>
      <div className="border-b border-border bg-card sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/results")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-8">
        <PensionReport
          simulationInput={simulationInput}
          results={results}
          expectedPension={expectedPension}
          historicalSalaries={historicalSalaries}
          futureSalaries={futureSalaries}
          illnessPeriods={illnessPeriods}
          customIndexation={customIndexation}
        />
      </main>
    </div>
  );
};
