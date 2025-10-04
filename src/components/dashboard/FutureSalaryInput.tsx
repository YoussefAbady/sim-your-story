import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { SimulationInput } from "@/services/pensionEngine";
import { SalaryPeriod } from "@/pages/Dashboard";

interface FutureSalaryInputProps {
  simulationInput: SimulationInput;
  salaries: SalaryPeriod[];
  onSalariesChange: (salaries: SalaryPeriod[]) => void;
}

export function FutureSalaryInput({ 
  simulationInput, 
  salaries, 
  onSalariesChange 
}: FutureSalaryInputProps) {
  const currentYear = new Date().getFullYear();
  
  const addSalaryPeriod = () => {
    const newPeriod: SalaryPeriod = {
      id: crypto.randomUUID(),
      year: currentYear + 1,
      amount: simulationInput.grossSalary,
    };
    onSalariesChange([...salaries, newPeriod]);
  };

  const removeSalaryPeriod = (id: string) => {
    onSalariesChange(salaries.filter(s => s.id !== id));
  };

  const updateSalaryPeriod = (id: string, field: keyof SalaryPeriod, value: number) => {
    onSalariesChange(
      salaries.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  return (
    <div className="space-y-4">
      {salaries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No future salary projections added yet.</p>
          <p className="text-sm mt-2">Click "Add Period" to specify expected salaries for future years.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {salaries.map((salary) => (
            <div key={salary.id} className="flex gap-4 items-end p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor={`future-year-${salary.id}`}>Year</Label>
                <Input
                  id={`future-year-${salary.id}`}
                  type="number"
                  min={currentYear}
                  max={simulationInput.endYear}
                  value={salary.year}
                  onChange={(e) => updateSalaryPeriod(salary.id, 'year', parseInt(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`future-amount-${salary.id}`}>Expected Monthly Salary (PLN)</Label>
                <Input
                  id={`future-amount-${salary.id}`}
                  type="number"
                  min={0}
                  value={salary.amount}
                  onChange={(e) => updateSalaryPeriod(salary.id, 'amount', parseFloat(e.target.value))}
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeSalaryPeriod(salary.id)}
                aria-label="Remove salary projection"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <Button onClick={addSalaryPeriod} variant="outline" className="gap-2">
        <Plus className="w-4 h-4" />
        Add Future Salary Projection
      </Button>
    </div>
  );
}
