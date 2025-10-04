import { useLocale } from '@/contexts/LocaleContext';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLocale('en')}
        className="h-8 w-8 p-0"
        title="English"
      >
        <span className="text-lg">🇬🇧</span>
      </Button>
      <Button
        variant={locale === 'pl' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLocale('pl')}
        className="h-8 w-8 p-0"
        title="Polski"
      >
        <span className="text-lg">🇵🇱</span>
      </Button>
    </div>
  );
};
