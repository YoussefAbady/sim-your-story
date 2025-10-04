import { EducationTip } from "@/contexts/EducationContext";

export const EDUCATION_TIPS: Record<string, EducationTip> = {
  birthDate: {
    id: "birthDate",
    title: "Why Birth Date Matters",
    content: "Your birth date determines your retirement age. In Poland, women can retire at 60 and men at 65. The earlier you start working, the more contributions you accumulate, which directly increases your pension amount.",
    icon: "🎂"
  },
  gender: {
    id: "gender",
    title: "Gender and Retirement",
    content: "Retirement age differs by gender in Poland: women retire at 60, men at 65. This means women typically have 5 fewer years to accumulate pension contributions, but also receive benefits earlier.",
    icon: "👤"
  },
  currentSalary: {
    id: "currentSalary",
    title: "How Salary Affects Your Pension",
    content: "Your current and historical salaries are crucial! The pension system calculates your benefit based on all contributions made throughout your career. Higher salaries mean higher contributions and a bigger pension pot.",
    icon: "💰"
  },
  workStartYear: {
    id: "workStartYear",
    title: "Years of Work Matter",
    content: "Every year of work counts! The pension system rewards longevity. Working 35+ years can significantly increase your pension. Early career starts mean more time to build your retirement fund.",
    icon: "📅"
  },
  expectedPension: {
    id: "expectedPension",
    title: "Setting Pension Goals",
    content: "The average pension in Poland is around 2,850 PLN/month. Setting a realistic goal helps you understand how many more years you need to work or how much you need to earn to reach your target.",
    icon: "🎯"
  },
  pensionGroups: {
    id: "pensionGroups",
    title: "Understanding Pension Groups",
    content: "Pensions vary widely based on contribution years and salary levels. The minimum pension requires at least 25 years of work for men and 20 for women. Without this, you may receive below-minimum benefits.",
    icon: "📊"
  },
  minimumPension: {
    id: "minimumPension",
    title: "Minimum Pension Guarantee",
    content: "Poland guarantees a minimum pension (around 1,780 PLN) for those who meet minimum contribution requirements. This safety net protects workers who had lower salaries throughout their careers.",
    icon: "🛡️"
  },
  averagePension: {
    id: "averagePension",
    title: "The Average Pensioner",
    content: "The average pension of 2,850 PLN represents typical Polish workers with consistent employment. To reach or exceed this, maintain steady employment and contribute from a fair salary.",
    icon: "📈"
  },
  aboveAverage: {
    id: "aboveAverage",
    title: "Higher Pensions",
    content: "Pensions above 4,200 PLN typically belong to those with 35+ years of contributions from above-average salaries. Professionals, managers, and specialized workers often fall into this category.",
    icon: "⭐"
  },
  contributionYears: {
    id: "contributionYears",
    title: "Every Year Counts",
    content: "Each additional 5 years of work can increase your pension by approximately 25%! Delaying retirement even by a few years can make a substantial difference in your monthly benefits.",
    icon: "⏰"
  },
  sickLeave: {
    id: "sickLeave",
    title: "Impact of Sick Leave",
    content: "Extended sick leave periods can reduce your pension! While you're on sick leave, contributions are lower or paused. The record-holder for Poland's highest pension never took sick leave in 45 years of work.",
    icon: "🏥"
  },
  simulation: {
    id: "simulation",
    title: "Why Use a Simulator?",
    content: "This educational tool helps you understand how different life choices affect your retirement. While not a guarantee, it's based on official ZUS forecasts and helps you plan your financial future.",
    icon: "🎓"
  },
  employmentGaps: {
    id: "employmentGaps",
    title: "Employment Gaps",
    content: "Periods without employment (unemployment, raising children, education) can create gaps in your contribution history. Some gaps may be covered by special provisions, but they generally reduce your final pension.",
    icon: "⚠️"
  },
  indexation: {
    id: "indexation",
    title: "Pension Indexation",
    content: "Pensions are adjusted annually based on inflation and wage growth. This indexation helps maintain the purchasing power of your pension over time, protecting you from rising costs.",
    icon: "📉"
  }
};

export const getRandomEducationTip = (): EducationTip => {
  const tips = Object.values(EDUCATION_TIPS);
  return tips[Math.floor(Math.random() * tips.length)];
};
