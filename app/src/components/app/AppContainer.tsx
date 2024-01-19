import { Outlet } from 'react-router-dom';
import { GlobalNav } from './GlobalNav';

export const AppContainer = (props: {}) => {
  return (
    <>
      <GlobalNav />
      <Outlet />
    </>
  );
};
