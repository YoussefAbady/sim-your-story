import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-border">
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLocale('en')}
        className={`h-10 w-14 p-1 overflow-hidden transition-all ${
          locale === 'en' ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
        }`}
        title="English"
      >
        <img 
          src="https://flagcdn.com/w80/gb.png" 
          alt="English" 
          className="w-full h-full object-cover rounded"
        />
      </Button>
      <Button
        variant={locale === 'pl' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLocale('pl')}
        className={`h-10 w-14 p-1 overflow-hidden transition-all ${
          locale === 'pl' ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
        }`}
        title="Polski"
      >
        <img 
          src="https://flagcdn.com/w80/pl.png" 
          alt="Polski" 
          className="w-full h-full object-cover rounded"
        />
      </Button>
    </div>
  );
};
