import { supabase } from "@/integrations/supabase/client";
import { SimulationInput, SimulationResult } from "@/services/pensionEngine";

export const logSimulationUsage = async (
  input: SimulationInput,
  results: SimulationResult,
  expectedPension: number,
  postalCode?: string
) => {
  try {
    const { error } = await supabase
      .from('simulation_logs')
      .insert({
        age: input.age,
        sex: input.sex,
        salary_amount: input.grossSalary,
        illness_included: input.includeSickLeave,
        account_funds: input.accountFunds || 0,
        sub_account_funds: input.subAccountFunds || 0,
        actual_pension: results.actualPension,
        real_pension: results.realPension,
        expected_pension: expectedPension > 0 ? expectedPension : null,
        postal_code: postalCode || null,
      });

    if (error) {
      console.error('Failed to log simulation usage:', error);
    }
  } catch (err) {
    console.error('Error logging simulation:', err);
  }
};
