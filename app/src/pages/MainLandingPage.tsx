import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ViewportContainer } from '../components/styles/LayoutComponents.styled';
import { LandingPage } from './landing/LandingPage';
import { LearnMore } from './landing/LearnMore';
import { CreateProject } from './create/CreateProject';
import { CreateProjectContext } from '../contexts/CreateProjectContext';

export const LandingRouteNames = {
  Base: `/`,
  More: `/learn`,
  Start: '/start',
};

export const MainLandingPage = () => {
  return (
    <BrowserRouter>
      <ViewportContainer>
        <Routes>
          <Route path={LandingRouteNames.Base} element={<LandingPage />}></Route>
          <Route path={LandingRouteNames.More} element={<LearnMore />}></Route>
          <Route
            path={LandingRouteNames.Start}
            element={
              <CreateProjectContext>
                <CreateProject />
              </CreateProjectContext>
            }></Route>
        </Routes>
      </ViewportContainer>
    </BrowserRouter>
  );
};
