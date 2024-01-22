import { GlobalNav } from './GlobalNav';

export const AppContainer = (props: React.PropsWithChildren) => {
  return (
    <>
      <GlobalNav />
      {props.children}
    </>
  );
};
