import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'pl';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    return (saved === 'en' || saved === 'pl') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};

const translations: Record<Locale, any> = {
  en: {
    nav: {
      home: 'Home',
      simulator: 'Simulator',
      education: 'Education',
      reports: 'Reports',
    },
    hero: {
      badge: 'AI-Powered Financial Education',
      title: 'See Your Financial Future',
      subtitle: 'Slide through life, watch your choices unfold. An interactive simulator that makes retirement planning feel real, engaging, and personal.',
      cta: 'Start Your Simulation',
      demo: 'Watch Demo',
      simulations: 'simulations run',
      liveAI: 'Live AI Analysis',
    },
    features: {
      title: 'Why Use Our Calculator',
      accurate: {
        title: 'Accurate Calculations',
        description: 'Based on official ZUS formulas and regulations',
      },
      easy: {
        title: 'Easy to Use',
        description: 'Simple interface for quick pension estimates',
      },
      detailed: {
        title: 'Detailed Reports',
        description: 'Comprehensive breakdown of your pension calculation',
      },
    },
    howItWorks: {
      title: 'How It Works',
      step1: {
        title: 'Enter Your Data',
        description: 'Provide your employment history and salary information',
      },
      step2: {
        title: 'Calculate',
        description: 'Our system processes your data using ZUS formulas',
      },
      step3: {
        title: 'Get Results',
        description: 'View your estimated pension and detailed breakdown',
      },
    },
    cta: {
      title: 'Ready to Plan Your Future?',
      subtitle: 'Start calculating your pension today',
      button: 'Get Started',
    },
    simulation: {
      title: 'Pension Simulation',
      personalInfo: 'Personal Information',
      birthDate: 'Birth Date',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      salaryHistory: 'Salary History',
      futureSalary: 'Future Salary Projections',
      illnessPeriods: 'Illness Periods',
      calculate: 'Calculate Pension',
      calculating: 'Calculating...',
    },
    results: {
      title: 'Your Pension Results',
      estimatedPension: 'Estimated Monthly Pension',
      retirementAge: 'Retirement Age',
      totalContributions: 'Total Contributions',
      downloadReport: 'Download Report',
      emailReport: 'Email Report',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      submit: 'Submit',
    },
  },
  pl: {
    nav: {
      home: 'Strona główna',
      simulator: 'Symulator',
      education: 'Edukacja',
      reports: 'Raporty',
    },
    hero: {
      badge: 'Edukacja Finansowa Wspierana przez AI',
      title: 'Zobacz Swoją Finansową Przyszłość',
      subtitle: 'Przechodź przez życie, obserwuj swoje wybory. Interaktywny symulator, który sprawia, że planowanie emerytury jest realne, angażujące i osobiste.',
      cta: 'Rozpocznij Symulację',
      demo: 'Zobacz Demo',
      simulations: 'wykonanych symulacji',
      liveAI: 'Analiza AI na Żywo',
    },
    features: {
      title: 'Dlaczego Warto Użyć Naszego Kalkulatora',
      accurate: {
        title: 'Dokładne Obliczenia',
        description: 'Oparte na oficjalnych formułach i przepisach ZUS',
      },
      easy: {
        title: 'Łatwy w Użyciu',
        description: 'Prosty interfejs do szybkiego szacowania emerytury',
      },
      detailed: {
        title: 'Szczegółowe Raporty',
        description: 'Kompleksowe zestawienie obliczeń emerytury',
      },
    },
    howItWorks: {
      title: 'Jak To Działa',
      step1: {
        title: 'Wprowadź Swoje Dane',
        description: 'Podaj historię zatrudnienia i informacje o wynagrodzeniu',
      },
      step2: {
        title: 'Oblicz',
        description: 'Nasz system przetwarza dane według formuł ZUS',
      },
      step3: {
        title: 'Otrzymaj Wyniki',
        description: 'Zobacz szacowaną emeryturę i szczegółowe zestawienie',
      },
    },
    cta: {
      title: 'Gotowy Zaplanować Swoją Przyszłość?',
      subtitle: 'Zacznij obliczać swoją emeryturę już dziś',
      button: 'Rozpocznij',
    },
    simulation: {
      title: 'Symulacja Emerytury',
      personalInfo: 'Informacje Osobiste',
      birthDate: 'Data Urodzenia',
      sex: 'Płeć',
      male: 'Mężczyzna',
      female: 'Kobieta',
      salaryHistory: 'Historia Wynagrodzeń',
      futureSalary: 'Prognozy Przyszłych Wynagrodzeń',
      illnessPeriods: 'Okresy Chorobowe',
      calculate: 'Oblicz Emeryturę',
      calculating: 'Obliczanie...',
    },
    results: {
      title: 'Twoje Wyniki Emerytalne',
      estimatedPension: 'Szacowana Miesięczna Emerytura',
      retirementAge: 'Wiek Emerytalny',
      totalContributions: 'Suma Składek',
      downloadReport: 'Pobierz Raport',
      emailReport: 'Wyślij Raport Email',
    },
    auth: {
      signIn: 'Zaloguj się',
      signUp: 'Zarejestruj się',
      email: 'Email',
      password: 'Hasło',
      forgotPassword: 'Zapomniałeś hasła?',
      noAccount: 'Nie masz konta?',
      haveAccount: 'Masz już konto?',
    },
    common: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      cancel: 'Anuluj',
      save: 'Zapisz',
      delete: 'Usuń',
      edit: 'Edytuj',
      close: 'Zamknij',
      submit: 'Wyślij',
    },
  },
};
