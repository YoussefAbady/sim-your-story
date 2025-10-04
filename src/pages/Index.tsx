import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, Info, BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EducationalInput } from "@/components/education/EducationalInput";
import { EducationalCard } from "@/components/education/EducationalCard";
import { useEducation } from "@/contexts/EducationContext";
import { EDUCATION_TIPS } from "@/data/educationContent";
import zusLogo from "@/assets/zus-logo.png";

export default function Index() {
  const navigate = useNavigate();
  const { showTip } = useEducation();
  const [expectedPension, setExpectedPension] = useState<string>("3000");

  const handleExpectedPensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpectedPension(value);
    // Store in sessionStorage for use in results
    if (value) {
      sessionStorage.setItem("expectedPension", value);
    }
  };

  // Mock data - will be replaced with real data
  const currentAverage = 2850;
  const pensionGroups = [
    {
      key: "below_minimum",
      label: "Below Minimum",
      amount: 1200,
      description: "Beneficiaries with low employment activity, <25 years men / <20 years women → no guaranteed minimum"
    },
    {
      key: "minimum",
      label: "At Minimum",
      amount: 1780,
      description: "Minimum pension for those meeting minimum contribution requirements"
    },
    {
      key: "average",
      label: "Average",
      amount: 2850,
      description: "Average pension across all beneficiaries"
    },
    {
      key: "above_average",
      label: "Above Average",
      amount: 4200,
      description: "Higher earners with 35+ years of contributions"
    }
  ];

  const facts = [
    "Highest pension in Poland is received by a Silesian Voivodeship resident; worked 45 years; never on sick leave.",
    "Every 5 years of additional work can increase your pension by approximately 25%.",
    "Women retire at 60, men at 65 under current regulations.",
    "The pension system uses your entire employment history to calculate benefits."
  ];

  const randomFact = facts[Math.floor(Math.random() * facts.length)];

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center gap-6">
          <Link to="/">
            <img 
              src={zusLogo} 
              alt="ZUS - Zakład Ubezpieczeń Społecznych" 
              className="h-16 md:h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Retirement Education Center</h1>
            <p className="text-sm text-muted-foreground mt-1">Learn about your pension while planning your future</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => showTip(EDUCATION_TIPS.simulation)}
          >
            <BookOpen className="w-4 h-4" />
            Learning Guide
          </Button>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8 space-y-8">
        {/* Educational Welcome */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">Welcome to Your Pension Learning Journey</h2>
              <p className="text-sm text-foreground mb-3">
                Understanding your pension doesn't have to be complicated! Click on any field or card to learn more about how it affects your retirement.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Look for the "Did You Know?" tips as you explore</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-accent/10 border-accent/20 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="font-semibold text-foreground">Educational Tool</h2>
              <p className="text-sm text-foreground mt-1">
                This simulator helps you learn about Polish pension system. Based on official ZUS forecasts, GUS, NBP, and Ministry of Finance data.
              </p>
            </div>
          </div>
        </Card>

        {/* Expected Pension Input */}
        <EducationalCard educationKey="expectedPension" className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="expected-pension" className="text-lg font-semibold flex items-center gap-2">
                What pension would you like in the future?
                <span className="text-xs font-normal text-muted-foreground">(Click to learn more)</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your desired monthly pension amount (PLN)
              </p>
            </div>
            
            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="expected-pension" className="sr-only">
                  Expected pension amount in PLN
                </Label>
                <div className="relative">
                  <EducationalInput
                    id="expected-pension"
                    type="number"
                    value={expectedPension}
                    onChange={handleExpectedPensionChange}
                    className="pr-12 text-lg"
                    aria-describedby="pension-comparison"
                    educationKey="expectedPension"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                    PLN
                  </span>
                </div>
              </div>
              
              <div 
                id="pension-comparison" 
                className="text-sm text-muted-foreground cursor-help"
                onClick={() => showTip(EDUCATION_TIPS.averagePension)}
              >
                Current average: <span className="font-semibold text-foreground">{currentAverage} PLN</span>
                <span className="sr-only">
                  {parseInt(expectedPension) > currentAverage 
                    ? `Your expected amount is ${parseInt(expectedPension) - currentAverage} PLN above average`
                    : `Your expected amount is ${currentAverage - parseInt(expectedPension)} PLN below average`}
                </span>
              </div>
            </div>
          </div>
        </EducationalCard>

        {/* Pension Groups Chart */}
        <EducationalCard educationKey="pensionGroups" className="p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            Average Pension by Group
            <span className="text-xs font-normal text-muted-foreground">(Click cards to learn)</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Explore different pension levels and what they mean for you
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            {pensionGroups.map((group) => (
              <TooltipProvider key={group.key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="bg-secondary/30 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-help focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${group.label}: ${group.amount} PLN average pension. ${group.description}`}
                    >
                      <div className="text-sm text-muted-foreground mb-1">{group.label}</div>
                      <div className="text-2xl font-bold text-foreground">{group.amount}</div>
                      <div className="text-xs text-muted-foreground mt-1">PLN/month</div>
                      <div 
                        className="w-full bg-primary/20 h-2 rounded-full mt-3"
                        role="presentation"
                        aria-hidden="true"
                      >
                        <div 
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${(group.amount / 5000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{group.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </EducationalCard>

        {/* Did You Know */}
        <Card className="bg-success/5 border-success/20 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-success text-xl">💡</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Did You Know?</h2>
              <p className="text-sm text-foreground mt-1">{randomFact}</p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/simulation')}
            className="gap-2 text-lg px-8"
          >
            Start Pension Simulation
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ZUS. Educational simulator based on official forecasts.
          </p>
        </div>
      </footer>
    </div>
  );
}
