/**
 * Pension calculation data based on ZUS forecast document
 * Source: "Prognoza wpływów i wydatków Funduszu Emerytalnego do 2080 roku"
 */

interface IndexationData {
  wageGrowth: Record<number, number>;
  cpi: Record<number, number>;
  cpiPensioners: Record<number, number>;
  realGDPGrowth: Record<number, number>;
}

interface BenefitData {
  avgBenefitByYear: Record<number, number>;
  groups: Array<{
    key: string;
    label: string;
    avgPension: number;
    description: string;
  }>;
}

interface SickLeaveData {
  male: { lifetimeAvgDays: number };
  female: { lifetimeAvgDays: number };
}

/**
 * Wage growth indices from Table 1.1 (Wariant nr 1 - intermediate scenario)
 * Real wage growth converted to nominal (real * CPI)
 */
export const INDEXATION_DATA: IndexationData = {
  wageGrowth: {
    2022: 1.1133, // 98% real * 113.5% CPI
    2023: 1.1009, // 100.3% real * 109.8% CPI
    2024: 1.0838, // 103.4% real * 104.8% CPI
    2025: 1.0695, // 103.7% real * 103.1% CPI
    2026: 1.0611, // 103.5% real * 102.5% CPI
    2027: 1.0557, // 103.0% real * 102.5% CPI
    2028: 1.0547, // 102.9% real * 102.5% CPI
    2029: 1.0547, // 102.9% real * 102.5% CPI
    2030: 1.0547, // 102.9% real * 102.5% CPI
    2031: 1.0547,
    2032: 1.0547,
    2035: 1.0537, // 102.8% real * 102.5% CPI
    2040: 1.0527, // 102.7% real * 102.5% CPI
    2045: 1.0517, // 102.6% real * 102.5% CPI
    2050: 1.0506, // 102.5% real * 102.5% CPI
    2055: 1.0496, // 102.4% real * 102.5% CPI
    2060: 1.0496,
    2065: 1.0486, // 102.3% real * 102.5% CPI
    2070: 1.0476, // 102.2% real * 102.5% CPI
    2075: 1.0466, // 102.1% real * 102.5% CPI
    2080: 1.0456, // 102.0% real * 102.5% CPI
  },
  
  /**
   * Consumer Price Index from Table 1.1
   */
  cpi: {
    2022: 1.1350,
    2023: 1.0980,
    2024: 1.0480,
    2025: 1.0310,
    2026: 1.0250,
    2027: 1.0250,
    2028: 1.0250,
    2029: 1.0250,
    2030: 1.0250,
    2031: 1.0250,
    2032: 1.0250,
    2035: 1.0250,
    2040: 1.0250,
    2045: 1.0250,
    2050: 1.0250,
    2055: 1.0250,
    2060: 1.0250,
    2065: 1.0250,
    2070: 1.0250,
    2075: 1.0250,
    2080: 1.0250,
  },
  
  /**
   * CPI for pensioners' households from Table 1.1
   */
  cpiPensioners: {
    2022: 1.1380,
    2023: 1.1010,
    2024: 1.0510,
    2025: 1.0340,
    2026: 1.0280,
    2027: 1.0280,
    2028: 1.0280,
    2029: 1.0280,
    2030: 1.0280,
    2031: 1.0280,
    2032: 1.0280,
    2035: 1.0280,
    2040: 1.0280,
    2045: 1.0280,
    2050: 1.0280,
    2055: 1.0280,
    2060: 1.0280,
    2065: 1.0280,
    2070: 1.0280,
    2075: 1.0280,
    2080: 1.0280,
  },
  
  /**
   * Real GDP growth from Table 1.1
   */
  realGDPGrowth: {
    2022: 1.0460,
    2023: 1.0170,
    2024: 1.0310,
    2025: 1.0310,
    2026: 1.0290,
    2027: 1.0290,
    2028: 1.0290,
    2029: 1.0280,
    2030: 1.0270,
    2031: 1.0270,
    2032: 1.0260,
    2035: 1.0240,
    2040: 1.0200,
    2045: 1.0160,
    2050: 1.0140,
    2055: 1.0140,
    2060: 1.0160,
    2065: 1.0170,
    2070: 1.0150,
    2075: 1.0130,
    2080: 1.0120,
  },
};

/**
 * Average benefit data
 * Values extrapolated based on current trends and forecast data
 */
export const BENEFIT_DATA: BenefitData = {
  avgBenefitByYear: {
    2023: 3200,
    2024: 3360,
    2025: 3520,
    2026: 3680,
    2027: 3840,
    2028: 4000,
    2029: 4160,
    2030: 4320,
    2035: 5120,
    2040: 6080,
    2045: 7200,
    2050: 8500,
    2055: 10000,
    2060: 11700,
    2065: 13600,
    2070: 15800,
    2075: 18300,
    2080: 21200,
  },
  
  /**
   * Pension groups with average amounts and descriptions
   * Based on document's discussion of benefit distribution
   */
  groups: [
    {
      key: 'below_minimum',
      label: 'Below Minimum Pension',
      avgPension: 1500,
      description: 'Beneficiaries with low employment activity, less than 25 years (men) / 20 years (women) of contributions. No guaranteed minimum pension applies.',
    },
    {
      key: 'minimum',
      label: 'Minimum Pension',
      avgPension: 1780,
      description: 'Recipients receiving the guaranteed minimum pension. Includes those with at least 20/25 years of contributions but low earnings.',
    },
    {
      key: 'below_average',
      label: 'Below Average',
      avgPension: 2500,
      description: 'Pensions below the national average. Typical for those with interrupted careers or lower-wage employment.',
    },
    {
      key: 'average',
      label: 'Average Pension',
      avgPension: 3500,
      description: 'National average pension. Represents steady employment at median wage levels throughout working life.',
    },
    {
      key: 'above_average',
      label: 'Above Average',
      avgPension: 5200,
      description: 'Pensions above average. Result of higher earnings, longer contribution periods, or both.',
    },
    {
      key: 'high',
      label: 'High Pension',
      avgPension: 8500,
      description: 'High pensions from maximum contribution base (30x average wage). Professionals with continuous high-wage employment.',
    },
  ],
};

/**
 * Sick leave statistics by sex
 * Based on GUS labor statistics
 */
export const SICK_LEAVE_DATA: SickLeaveData = {
  male: {
    lifetimeAvgDays: 10, // Average sick days per year for males
  },
  female: {
    lifetimeAvgDays: 14, // Average sick days per year for females
  },
};

/**
 * Trivia facts for "Did you know?" component
 */
export const PENSION_FACTS = [
  "The highest pension in Poland is received by a Silesian Voivodeship resident who worked for over 45 years without any sick leave.",
  "In 2023, over 9.8 million people receive pensions from ZUS, making it one of Europe's largest pension systems.",
  "The Polish pension system reformed in 1999 shifted from defined benefit to defined contribution, making your pension directly related to your lifetime earnings.",
  "Working just one additional year beyond retirement age can increase your pension by 8-12%, depending on your contribution history.",
  "Women in Poland retire at age 60 and men at 65, one of the few European countries with different retirement ages by sex.",
  "The pension replacement rate (pension as % of last salary) in Poland is projected to be around 40-50% for most workers by 2050.",
  "Your ZUS account and sub-account balances are indexed annually based on wage growth and GDP, helping preserve value over time.",
  "Contributions to the pension system represent 19.52% of your gross salary, with your employer paying an additional amount.",
  "Poland's demographic reserve fund (FRD) was created to help manage the financial impact of population aging on the pension system.",
  "By 2080, Poland's old-age dependency ratio is projected to reach approximately 75 pensioners per 100 working-age people.",
];
