import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export enum Language {
  ENG = 'ENG',
  SPA = 'SPA',
  CAT = 'CAT',
}

export type AppLanguageType = {
  change: (key: Language) => void;
  selected: Language;
  hasChosen: boolean;
};

const ThemeContextValue = createContext<AppLanguageType | undefined>(undefined);

/** check language */
export const AppLanguage = (props: PropsWithChildren): JSX.Element => {
  const { i18n } = useTranslation();
  const selected = i18n.language as Language;

  const [hasChosen, setHasChosen] = useState<boolean>(false);

  useEffect(() => {
    const preferred = localStorage.getItem('language');

    if (preferred !== null) {
      console.log('Setting preferred language', preferred);
      setHasChosen(true);
      i18n.changeLanguage(preferred);
    } else {
      const local = navigator.language;
      console.log('reading nav language', local);
      if (local.includes('en')) {
        i18n.changeLanguage(Language.ENG);
      }
      if (local.includes('es')) {
        i18n.changeLanguage(Language.SPA);
      }
      if (local.includes('cat')) {
        i18n.changeLanguage(Language.CAT);
      }
    }
  }, [i18n]);

  const change = (key: Language) => {
    i18n.changeLanguage(key);
    localStorage.setItem('language', key);
  };

  return (
    <ThemeContextValue.Provider value={{ change, selected, hasChosen }}>{props.children}</ThemeContextValue.Provider>
  );
};

export const useAppLanguage = (): AppLanguageType => {
  const context = useContext(ThemeContextValue);
  if (!context) throw Error('useThemeContext can only be used within the CampaignContext component');
  return context;
};
