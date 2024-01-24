import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppContainer } from '../../components/app/AppContainer';

export const VoiceBasePage = (props: {}) => {
  const { setTitle } = useAppContainer();

  useEffect(() => {
    setTitle({ prefix: 'Propose new', main: 'Statement' });
  }, []);

  return <Outlet />;
};
