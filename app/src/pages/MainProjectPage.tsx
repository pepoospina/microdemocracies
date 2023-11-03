import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import { TestComponent } from './TestComponent';
import { ProjectHome } from './project/ProjectPage';
import { Join } from './join/Join';
import { VouchPage } from './vouch/Vouch';
import { Challenges } from './challenges/Challenges';
import { Vouches } from './vouches/Vouches';
import { VouchAccount } from './vouch/VouchAccount';
import { AccountPage } from './account/AccountPage';
import { AccountContext } from '../contexts/AccountContext';
import { VouchContext } from '../contexts/VouchContext';
import { VoicePage } from './voice/VoicePage';
import { VoiceReadContext } from '../contexts/VoiceReadContext';
import { VoicePropose } from './voice/VoicePropose';
import { VoiceSendContext } from '../contexts/VoiceSendContext';

import { AllVouches } from './vouches/AllVouches';
import { ViewportContainer } from '../components/styles/LayoutComponents.styled';
import { useEffect } from 'react';
import { useRegistry } from '../contexts/RegistryContext';

export const ProjectRouteNames = {
  Base: `/`,
  Join: `/join`,
  Vouch: `/invite`,
  VouchAccount: (hash: string) => `/invite/${hash}`,
  MyVouches: `/invites`,
  VouchesAll: `/allnew`,
  Challenges: `/challenges`,
  Account: (id: number) => `/account/${id}`,
  AccountChallenge: (id: number) => `/account/${id}/challenge`,
  Voice: `/voice`,
  VoicePropose: `/voice/propose`,
};

export const MAX_WIDTH_LANDING = 1600;

export const MainProjectPage = (props: { projectId: string }) => {
  const { setProjectId } = useRegistry();

  useEffect(() => {
    if (props.projectId) {
      setProjectId(props.projectId);
    }
  }, [props.projectId, setProjectId]);

  return (
    <BrowserRouter>
      <ViewportContainer>
        <Routes>
          <Route path={`account/:tokenId/*`} element={<AccountPage />}></Route>
          <Route
            path={`vouch/:hash`}
            element={
              <VouchContext>
                <AccountContext>
                  <VouchAccount />
                </AccountContext>
              </VouchContext>
            }></Route>
          <Route path={ProjectRouteNames.Join} element={<Join />}></Route>
          <Route
            path={ProjectRouteNames.Vouch}
            element={
              <VouchContext>
                <VouchPage />
              </VouchContext>
            }></Route>
          <Route path={ProjectRouteNames.MyVouches} element={<Vouches />}></Route>
          <Route path={ProjectRouteNames.VouchesAll} element={<AllVouches />}></Route>
          <Route path={ProjectRouteNames.Challenges} element={<Challenges />}></Route>
          {/* <Route path={ProjectRouteNames.Base} element={<TestComponent />}></Route> */}
          <Route path={ProjectRouteNames.Base} element={<ProjectHome />}></Route>
          <Route
            path={ProjectRouteNames.VoicePropose}
            element={
              <VoiceSendContext>
                <VoicePropose />
              </VoiceSendContext>
            }></Route>
          <Route
            path={ProjectRouteNames.Voice}
            element={
              <VoiceReadContext>
                <VoicePage />
              </VoiceReadContext>
            }></Route>
        </Routes>
      </ViewportContainer>
    </BrowserRouter>
  );
};
