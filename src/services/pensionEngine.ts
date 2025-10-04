/**
 * ZUS Pension Simulation Engine
 * Based on "Prognoza wpływów i wydatków Funduszu Emerytalnego do 2080 roku"
 * ZUS Departament Statystyki i Prognoz Aktuarialnych, October 2022
 */

import { INDEXATION_DATA, BENEFIT_DATA, SICK_LEAVE_DATA } from './pensionData';

export interface SimulationInput {
  age: number;
  sex: 'male' | 'female';
  grossSalary: number;
  startYear: number;
  endYear: number;
  accountFunds?: number;
  subAccountFunds?: number;
  includeSickLeave: boolean;
}

export interface SimulationResult {
  actualPension: number;
  realPension: number;
  replacementRate: number;
  averageBenefitAtRetirement: number;
  wageWithoutIllness: number;
  wageWithIllness: number;
  postponementDeltas: {
    plusOne: number;
    plusTwo: number;
    plusFive: number;
  };
  yearsNeededForExpected?: number;
  totalContributions: number;
  accountBalance: number;
  subAccountBalance: number;
}

export class PensionEngine {
  private static readonly CONTRIBUTION_RATE = 0.1952; // 19.52% to FUS pension fund
  private static readonly OFE_TRANSFER_RATE = 0.0; // After 2014 reforms, no new transfers to OFE
  private static readonly FRD_RATE = 0.0165; // 1.65% to Demographic Reserve Fund
  private static readonly MAX_CONTRIBUTION_BASE_MULTIPLIER = 30; // 30x average wage
  
  /**
   * Main simulation method
   */
  static simulate(input: SimulationInput): SimulationResult {
    const retirementAge = input.sex === 'female' ? 60 : 65;
    const currentYear = new Date().getFullYear();
    const yearsOfWork = input.endYear - input.startYear;
    
    // Calculate contribution basis with sick leave adjustment
    const sickLeaveImpact = input.includeSickLeave 
      ? SICK_LEAVE_DATA[input.sex].lifetimeAvgDays / 365 
      : 0;
    
    const effectiveSalaryMultiplier = 1 - sickLeaveImpact;
    const wageWithIllness = input.grossSalary * effectiveSalaryMultiplier;
    const wageWithoutIllness = input.grossSalary;
    
    // Calculate total contributions using wage indexation
    const totalContributions = this.calculateTotalContributions(
      input.startYear,
      input.endYear,
      input.grossSalary,
      effectiveSalaryMultiplier
    );
    
    // Calculate account balances
    const accountBalance = input.accountFunds ?? totalContributions * 0.85; // Estimate if not provided
    const subAccountBalance = input.subAccountFunds ?? totalContributions * 0.15; // Estimate if not provided
    
    // Calculate life expectancy at retirement (from mortality tables)
    const lifeExpectancy = this.calculateLifeExpectancy(input.sex, retirementAge);
    
    // Calculate actual pension (nominal)
    const actualPension = this.calculatePension(
      accountBalance,
      subAccountBalance,
      lifeExpectancy
    );
    
    // Calculate real pension (inflation-adjusted)
    const realPension = this.calculateRealPension(
      actualPension,
      input.endYear
    );
    
    // Get average benefit at retirement year
    const averageBenefitAtRetirement = BENEFIT_DATA.avgBenefitByYear[input.endYear] || 3500;
    
    // Calculate replacement rate
    const indexedWage = this.getIndexedWage(input.grossSalary, currentYear, input.endYear);
    const replacementRate = (actualPension / indexedWage) * 100;
    
    // Calculate postponement deltas
    const postponementDeltas = this.calculatePostponementDeltas(
      accountBalance,
      subAccountBalance,
      input.sex,
      retirementAge,
      input.grossSalary
    );
    
    return {
      actualPension,
      realPension,
      replacementRate,
      averageBenefitAtRetirement,
      wageWithoutIllness,
      wageWithIllness,
      postponementDeltas,
      totalContributions,
      accountBalance,
      subAccountBalance,
    };
  }
  
  /**
   * Calculate total contributions over working period
   */
  private static calculateTotalContributions(
    startYear: number,
    endYear: number,
    currentSalary: number,
    effectiveMultiplier: number
  ): number {
    let total = 0;
    const currentYear = new Date().getFullYear();
    
    for (let year = startYear; year < endYear; year++) {
      // Get wage growth index for this year
      const wageGrowth = INDEXATION_DATA.wageGrowth[year] || 1.025;
      
      // Calculate salary for this year (reverse indexation from current)
      const yearsFromNow = currentYear - year;
      let yearSalary = currentSalary;
      
      if (yearsFromNow > 0) {
        // Historical - reverse index
        yearSalary = currentSalary / Math.pow(1.025, yearsFromNow);
      } else if (yearsFromNow < 0) {
        // Future - forward index
        yearSalary = currentSalary * Math.pow(wageGrowth, Math.abs(yearsFromNow));
      }
      
      // Apply sick leave multiplier
      yearSalary *= effectiveMultiplier;
      
      // Calculate annual contribution (19.52% rate)
      const annualContribution = yearSalary * 12 * this.CONTRIBUTION_RATE;
      total += annualContribution;
    }
    
    return total;
  }
  
  /**
   * Calculate pension based on capital accumulation
   */
  private static calculatePension(
    accountBalance: number,
    subAccountBalance: number,
    lifeExpectancy: number
  ): number {
    const totalCapital = accountBalance + subAccountBalance;
    const monthlyPension = totalCapital / (lifeExpectancy * 12);
    return Math.round(monthlyPension * 100) / 100;
  }
  
  /**
   * Calculate real (inflation-adjusted) pension
   */
  private static calculateRealPension(
    nominalPension: number,
    retirementYear: number
  ): number {
    const currentYear = new Date().getFullYear();
    let deflator = 1;
    
    // Apply CPI deflation from current year to retirement year
    for (let year = currentYear; year < retirementYear; year++) {
      const cpi = INDEXATION_DATA.cpi[year] || 1.025;
      deflator *= cpi;
    }
    
    return Math.round((nominalPension / deflator) * 100) / 100;
  }
  
  /**
   * Calculate life expectancy based on sex and age at retirement
   */
  private static calculateLifeExpectancy(sex: 'male' | 'female', ageAtRetirement: number): number {
    // Based on GUS life expectancy tables (simplified)
    // Women live approximately 6 years longer than men
    const baseExpectancy = sex === 'female' ? 26 : 20; // Years after retirement
    return baseExpectancy;
  }
  
  /**
   * Get indexed wage at retirement
   */
  private static getIndexedWage(
    currentSalary: number,
    currentYear: number,
    retirementYear: number
  ): number {
    let indexedWage = currentSalary;
    
    for (let year = currentYear; year < retirementYear; year++) {
      const wageGrowth = INDEXATION_DATA.wageGrowth[year] || 1.025;
      indexedWage *= wageGrowth;
    }
    
    return indexedWage;
  }
  
  /**
   * Calculate pension deltas for postponed retirement
   */
  private static calculatePostponementDeltas(
    accountBalance: number,
    subAccountBalance: number,
    sex: 'male' | 'female',
    baseRetirementAge: number,
    grossSalary: number
  ) {
    const calculateForDelay = (yearsDelay: number): number => {
      // Additional contributions during delay period
      const additionalContributions = grossSalary * 12 * this.CONTRIBUTION_RATE * yearsDelay;
      const newAccountBalance = accountBalance + additionalContributions;
      
      // Reduced life expectancy (fewer years to collect pension)
      const lifeExpectancy = this.calculateLifeExpectancy(sex, baseRetirementAge + yearsDelay);
      
      const newPension = this.calculatePension(newAccountBalance, subAccountBalance, lifeExpectancy);
      const basePension = this.calculatePension(accountBalance, subAccountBalance, 
        this.calculateLifeExpectancy(sex, baseRetirementAge));
      
      return Math.round((newPension - basePension) * 100) / 100;
    };
    
    return {
      plusOne: calculateForDelay(1),
      plusTwo: calculateForDelay(2),
      plusFive: calculateForDelay(5),
    };
  }
  
  /**
   * Calculate years needed to reach expected pension amount
   */
  static calculateYearsForExpectedPension(
    currentResult: SimulationResult,
    expectedPension: number,
    input: SimulationInput
  ): number | undefined {
    if (currentResult.actualPension >= expectedPension) {
      return 0;
    }
    
    const retirementAge = input.sex === 'female' ? 60 : 65;
    const maxAge = 70; // Reasonable maximum
    
    for (let additionalYears = 1; additionalYears <= (maxAge - retirementAge); additionalYears++) {
      const newInput = {
        ...input,
        endYear: input.endYear + additionalYears,
      };
      
      const newResult = this.simulate(newInput);
      
      if (newResult.actualPension >= expectedPension) {
        return additionalYears;
      }
    }
    
    return undefined; // Cannot reach expected pension within reasonable timeframe
  }
}
