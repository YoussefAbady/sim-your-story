import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const steps = ["Profile", "Finances", "Goals"];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: 25,
    country: "",
    income: 50000,
    savingsRate: 10,
    riskTolerance: 50,
    lifestyle: 50,
    retirementAge: 65,
    desiredIncome: 4000,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Profile Created!",
        description: "Starting your simulation...",
      });
      navigate("/simulator");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (key: string, value: number | string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  initial={false}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                  }}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-24 mx-2 rounded-full ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{steps[currentStep]}</h2>
          </div>
        </div>

        {/* Form content */}
        <motion.div
          className="bg-card rounded-2xl p-8 border border-border shadow-lg"
          initial={false}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 0 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="age"
                        value={[formData.age]}
                        onValueChange={([value]) => updateFormData("age", value)}
                        min={18}
                        max={65}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-primary w-12 text-right">
                        {formData.age}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="e.g., United States"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                    />
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        id="income"
                        type="number"
                        value={formData.income}
                        onChange={(e) => updateFormData("income", parseInt(e.target.value) || 0)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="savingsRate">Savings Rate ({formData.savingsRate}%)</Label>
                    <Slider
                      id="savingsRate"
                      value={[formData.savingsRate]}
                      onValueChange={([value]) => updateFormData("savingsRate", value)}
                      min={0}
                      max={50}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                    <Slider
                      id="riskTolerance"
                      value={[formData.riskTolerance]}
                      onValueChange={([value]) => updateFormData("riskTolerance", value)}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lifestyle">Lifestyle Spending</Label>
                    <Slider
                      id="lifestyle"
                      value={[formData.lifestyle]}
                      onValueChange={([value]) => updateFormData("lifestyle", value)}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minimal</span>
                      <span>Luxurious</span>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Desired Retirement Age</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="retirementAge"
                        value={[formData.retirementAge]}
                        onValueChange={([value]) => updateFormData("retirementAge", value)}
                        min={50}
                        max={80}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-primary w-12 text-right">
                        {formData.retirementAge}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desiredIncome">Desired Monthly Retirement Income</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        id="desiredIncome"
                        type="number"
                        value={formData.desiredIncome}
                        onChange={(e) => updateFormData("desiredIncome", parseInt(e.target.value) || 0)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Ready to see your future?</span> We'll simulate
                      thousands of scenarios to show you how your choices impact your retirement.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleNext} className="gap-2 bg-primary hover:bg-primary/90">
              {currentStep === steps.length - 1 ? "Start Simulation" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
