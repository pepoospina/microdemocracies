import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppContainer } from '../../components/app/AppContainer';
import { cap } from '../../utils/general';
import { useTranslation } from 'react-i18next';

export const VoiceBasePage = (props: {}) => {
  const { t, i18n } = useTranslation();
  const { setTitle } = useAppContainer();

  useEffect(() => {
    setTitle({ prefix: cap(t('proposeNew')), main: t('statement') });
  }, [i18n.language]);

  return <Outlet />;
};
