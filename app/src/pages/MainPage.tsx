import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import { TestComponent } from './TestComponent';
import { LandingPage } from './landing/LandingPage';
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
import { Box } from 'grommet';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { appConfig } from '../config';
import { AllVouches } from './vouches/AllVouches';

export const RouteNames = {
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

export const MainPage = () => {
  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork({
    chainId: 137,
  });

  if (switchNetwork && chain && chain.id !== appConfig.CHAIN.id) {
    switchNetwork(appConfig.CHAIN.id);
  }

  return (
    <BrowserRouter>
      <Box
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          maxWidth: `${MAX_WIDTH_LANDING}px`,
          margin: '0 auto',
        }}
        id="MainPageRoutesWrapper">
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
          <Route path={RouteNames.Join} element={<Join />}></Route>
          <Route
            path={RouteNames.Vouch}
            element={
              <VouchContext>
                <VouchPage />
              </VouchContext>
            }></Route>
          <Route path={RouteNames.MyVouches} element={<Vouches />}></Route>
          <Route path={RouteNames.VouchesAll} element={<AllVouches />}></Route>
          <Route path={RouteNames.Challenges} element={<Challenges />}></Route>
          {/* <Route path={RouteNames.Base} element={<TestComponent />}></Route> */}
          <Route path={RouteNames.Base} element={<LandingPage />}></Route>
          <Route
            path={RouteNames.VoicePropose}
            element={
              <VoiceSendContext>
                <VoicePropose />
              </VoiceSendContext>
            }></Route>
          <Route
            path={RouteNames.Voice}
            element={
              <VoiceReadContext>
                <VoicePage />
              </VoiceReadContext>
            }></Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
};
