import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { SimulationInput } from "@/services/pensionEngine";
import { IllnessPeriod } from "@/pages/Dashboard";

interface IllnessPeriodInputProps {
  simulationInput: SimulationInput;
  periods: IllnessPeriod[];
  onPeriodsChange: (periods: IllnessPeriod[]) => void;
}

export function IllnessPeriodInput({ 
  simulationInput, 
  periods, 
  onPeriodsChange 
}: IllnessPeriodInputProps) {
  const currentYear = new Date().getFullYear();
  
  const addPeriod = () => {
    const newPeriod: IllnessPeriod = {
      id: crypto.randomUUID(),
      startYear: currentYear,
      endYear: currentYear,
      days: 30,
    };
    onPeriodsChange([...periods, newPeriod]);
  };

  const removePeriod = (id: string) => {
    onPeriodsChange(periods.filter(p => p.id !== id));
  };

  const updatePeriod = (id: string, field: keyof IllnessPeriod, value: number) => {
    onPeriodsChange(
      periods.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  return (
    <div className="space-y-4">
      {periods.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No illness periods specified yet.</p>
          <p className="text-sm mt-2">Click "Add Illness Period" to model the impact of sick leave on your pension.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {periods.map((period) => (
            <div key={period.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-border rounded-lg">
              <div>
                <Label htmlFor={`start-${period.id}`}>Start Year</Label>
                <Input
                  id={`start-${period.id}`}
                  type="number"
                  min={simulationInput.startYear}
                  max={simulationInput.endYear}
                  value={period.startYear}
                  onChange={(e) => updatePeriod(period.id, 'startYear', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`end-${period.id}`}>End Year</Label>
                <Input
                  id={`end-${period.id}`}
                  type="number"
                  min={period.startYear}
                  max={simulationInput.endYear}
                  value={period.endYear}
                  onChange={(e) => updatePeriod(period.id, 'endYear', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor={`days-${period.id}`}>Sick Days/Year</Label>
                <Input
                  id={`days-${period.id}`}
                  type="number"
                  min={0}
                  max={365}
                  value={period.days}
                  onChange={(e) => updatePeriod(period.id, 'days', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removePeriod(period.id)}
                  aria-label="Remove illness period"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button onClick={addPeriod} variant="outline" className="gap-2">
        <Plus className="w-4 h-4" />
        Add Illness Period
      </Button>
      
      {periods.length > 0 && (
        <div className="mt-4 p-4 bg-accent/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Total impact:</strong> {periods.reduce((sum, p) => sum + ((p.endYear - p.startYear + 1) * p.days), 0)} sick days across all periods
          </p>
        </div>
      )}
    </div>
  );
}
