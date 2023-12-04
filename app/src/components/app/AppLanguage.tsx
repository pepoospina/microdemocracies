import { changeLanguage } from 'i18next';
import { PropsWithChildren, createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export enum Language {
  ENG = 'ENG',
  SPA = 'SPA',
  CAT = 'CAT',
  HEB = 'HEB',
}

export type AppLanguageType = {
  change: (key: Language) => void;
  selected: Language;
};

const ThemeContextValue = createContext<AppLanguageType | undefined>(undefined);

/** check language */
export const AppLanguage = (props: PropsWithChildren): JSX.Element => {
  const { i18n } = useTranslation();
  const selected = i18n.language as Language;

  useEffect(() => {
    const preferred = localStorage.getItem('language');
    if (preferred !== null) {
      console.log('Setting preferred language', preferred);
      i18n.changeLanguage(preferred);
    } else {
      const local = navigator.language;
      if (local.includes('en')) {
        changeLanguage(Language.ENG);
      }
      if (local.includes('es')) {
        changeLanguage(Language.SPA);
      }
      if (local.includes('cat')) {
        changeLanguage(Language.CAT);
      }
      if (local.includes('he')) {
        changeLanguage(Language.HEB);
      }
    }
  }, [i18n]);

  const change = (key: Language) => {
    i18n.changeLanguage(key);
    localStorage.setItem('language', key);
  };

  return <ThemeContextValue.Provider value={{ change, selected }}>{props.children}</ThemeContextValue.Provider>;
};

export const useAppLanguage = (): AppLanguageType => {
  const context = useContext(ThemeContextValue);
  if (!context) throw Error('useThemeContext can only be used within the CampaignContext component');
  return context;
};
