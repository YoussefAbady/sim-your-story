import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import zusLogo from "@/assets/zus-logo.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Calculator, Lightbulb } from "lucide-react";
import { SICK_LEAVE_DATA } from "@/services/pensionData";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EducationalInput } from "@/components/education/EducationalInput";
import { EducationalCard } from "@/components/education/EducationalCard";
import { useEducation } from "@/contexts/EducationContext";
import { EDUCATION_TIPS } from "@/data/educationContent";
import { useLocale } from "@/contexts/LocaleContext";

const currentYear = new Date().getFullYear();

const simulationSchema = z.object({
  age: z.coerce.number().min(18, "Must be at least 18").max(67, "Must be under 67"),
  sex: z.enum(["male", "female"], { required_error: "Please select sex" }),
  grossSalary: z.coerce.number().min(1000, "Salary must be at least 1000 PLN").max(1000000, "Salary seems too high"),
  startYear: z.coerce.number().min(1960).max(currentYear),
  endYear: z.coerce.number().min(currentYear).max(2080),
  postalCode: z.string().max(10, "Postal code must be less than 10 characters").optional(),
  accountFunds: z.coerce.number().min(0).optional(),
  subAccountFunds: z.coerce.number().min(0).optional(),
  includeSickLeave: z.boolean().default(false),
});

type SimulationFormData = z.infer<typeof simulationSchema>;

export default function Simulation() {
  const navigate = useNavigate();
  const { showAITip } = useEducation();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate default retirement year based on current age and sex
  const getRetirementYear = (age: number, sex: string) => {
    const retirementAge = sex === "female" ? 60 : 65;
    const yearsToRetirement = retirementAge - age;
    return currentYear + yearsToRetirement;
  };

  const form = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      age: 30,
      sex: "male",
      grossSalary: 5000,
      startYear: currentYear - 10,
      endYear: getRetirementYear(30, "male"),
      accountFunds: 0,
      subAccountFunds: 0,
      includeSickLeave: false,
    },
  });

  // Update retirement year when age or sex changes
  const watchAge = form.watch("age");
  const watchSex = form.watch("sex");

  const onSubmit = async (data: SimulationFormData) => {
    setIsSubmitting(true);
    
    // Store simulation data in sessionStorage
    sessionStorage.setItem("simulationData", JSON.stringify(data));
    
    // Navigate to results
    setTimeout(() => {
      navigate("/results");
    }, 500);
  };

  // Get actual sick leave data from pension data
  const maleSickLeaveDays = SICK_LEAVE_DATA.male.lifetimeAvgDays;
  const femaleSickLeaveDays = SICK_LEAVE_DATA.female.lifetimeAvgDays;
  const currentGenderSickLeave = watchSex === "female" ? femaleSickLeaveDays : maleSickLeaveDays;

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center gap-6">
          <Link to="/">
            <img 
              src={zusLogo} 
              alt="ZUS - Zakład Ubezpieczeń Społecznych" 
              className="h-12 md:h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t('simulation.retirementSimulator')}</h1>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Educational Header */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground mb-1">{t('simulation.learnAsYouGo')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('simulation.clickFieldsHint')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Required Fields Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{t('simulation.requiredInfo')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('simulation.currentAge')}</FormLabel>
                        <FormControl>
                          <EducationalInput 
                            type="number" 
                            placeholder="30" 
                            {...field}
                            aria-required="true"
                            educationKey="birthDate"
                            userData={form.getValues()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('simulation.sex')}</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Trigger tip with the newly selected value
                            showAITip('gender', { ...form.getValues(), sex: value });
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger aria-required="true">
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">{t('simulation.maleRetirement')}</SelectItem>
                            <SelectItem value="female">{t('simulation.femaleRetirement')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="grossSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('simulation.currentSalary')}</FormLabel>
                      <FormControl>
                        <EducationalInput 
                          type="number" 
                          placeholder="5000" 
                          {...field}
                          aria-required="true"
                          educationKey="currentSalary"
                          userData={form.getValues()}
                        />
                      </FormControl>
                      <FormDescription>{t('simulation.salaryDescription')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('simulation.yearStartedWorking')}</FormLabel>
                        <FormControl>
                          <EducationalInput 
                            type="number" 
                            placeholder={String(currentYear - 10)} 
                            {...field}
                            aria-required="true"
                            aria-describedby="start-year-note"
                            educationKey="workStartYear"
                            userData={form.getValues()}
                          />
                        </FormControl>
                        <FormDescription id="start-year-note">{t('simulation.startYearNote')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('simulation.plannedRetirement')}</FormLabel>
                        <FormControl>
                          <EducationalInput 
                            type="number" 
                            placeholder={String(getRetirementYear(watchAge, watchSex))} 
                            {...field}
                            aria-required="true"
                            aria-describedby="end-year-note"
                            educationKey="contributionYears"
                            userData={form.getValues()}
                          />
                        </FormControl>
                        <FormDescription id="end-year-note">
                          {t('simulation.defaultRetirement').replace('{year}', String(getRetirementYear(watchAge, watchSex)))}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground">{t('simulation.optionalInfo')}</h2>
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('simulation.postalCode')}</FormLabel>
                        <FormControl>
                          <EducationalInput 
                            type="text" 
                            placeholder="00-000" 
                            {...field} 
                            educationKey="employmentGaps"
                            userData={form.getValues()}
                          />
                        </FormControl>
                        <FormDescription>{t('simulation.postalCodeHelper')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountFunds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('simulation.accountFunds')}</FormLabel>
                        <FormControl>
                          <EducationalInput 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            educationKey="simulation"
                            userData={form.getValues()}
                          />
                        </FormControl>
                        <FormDescription>{t('simulation.leaveBlank')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subAccountFunds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('simulation.subAccountFunds')}</FormLabel>
                        <FormControl>
                          <EducationalInput 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            educationKey="simulation"
                            userData={form.getValues()}
                          />
                        </FormControl>
                        <FormDescription>{t('simulation.leaveBlank')}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="includeSickLeave"
                  render={({ field }) => (
                    <FormItem 
                      className="flex flex-row items-center justify-between rounded-lg border border-border p-4 cursor-help hover:border-primary/50 transition-colors"
                      onClick={() => showAITip('sickLeave', form.getValues())}
                    >
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t('simulation.includeSickLeave')}</FormLabel>
                        <FormDescription>
                          {t('simulation.sickLeaveDesc').replace('{male}', String(maleSickLeaveDays)).replace('{female}', String(femaleSickLeaveDays)).replace('{current}', String(currentGenderSickLeave))}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Include sick leave in calculations"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Info Note */}
              <Card className="bg-accent/10 border-accent p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-sm text-foreground">
                  <p className="font-semibold mb-1">{t('simulation.importantNotes')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('simulation.note1')}</li>
                    <li>{t('simulation.note2')}</li>
                    <li>{t('simulation.note3')}</li>
                  </ul>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                  {isSubmitting ? t('simulation.calculating') : t('simulation.forecastPension')}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
