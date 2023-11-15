import { QueryClient, QueryClientProvider } from 'react-query';
import { alchemyProvider as wagmiAlchemyProvider } from 'wagmi/providers/alchemy';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { ResponsiveApp, ThemedApp } from './components/app';
import { ProjectContext } from './contexts/ProjectContext';

import { chain } from './wallet/config';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { ALCHEMY_KEY } from './config/appConfig';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ViewportContainer } from './components/styles/LayoutComponents.styled';
import { VoiceReadContext } from './contexts/VoiceReadContext';
import { VoiceSendContext } from './contexts/VoiceSendContext';
import { VouchContext } from './contexts/VouchContext';
import { AccountPage } from './pages/account/AccountPage';
import { Challenges } from './pages/challenges/Challenges';
import { CreateProject } from './pages/create/CreateProject';
import { Join } from './pages/join/Join';
import { LandingPage } from './pages/landing/LandingPage';
import { LearnMore } from './pages/landing/LearnMore';
import { ProjectHome } from './pages/project/ProjectHome';
import { VoicePage } from './pages/voice/VoicePage';
import { VoiceBase } from './pages/voice/VoiceBase';
import { VoicePropose } from './pages/voice/VoicePropose';
import { VouchPage } from './pages/vouch/Vouch';
import { VouchAccount } from './pages/vouch/VouchAccount';
import { AllVouches } from './pages/vouches/AllVouches';
import { Vouches } from './pages/vouches/Vouches';
import { ProjectBase } from './pages/project/ProjectBase';
import { SignerContext } from './wallet/SignerContext';
import { ConnectedMemberContext } from './contexts/ConnectedAccountContext';
import { AccountContext } from './wallet/AccountContext';
import { MemberContext } from './contexts/MemberContext';
import { SemaphoreContext } from './contexts/SemaphoreContext';

const queryClient = new QueryClient();

export const RouteNames = {
  Base: ``,
  More: `/learn`,
  Start: '/start',
  ProjectHome: (projectId: string) => `/p/${projectId}`,
  Join: `join`,
  Vouch: `invite`,
  VouchAccount: (hash: string) => `invite/${hash}`,
  MyVouches: `invites`,
  VouchesAll: `allnew`,
  Challenges: `challenges`,
  Member: (id: number) => `member/${id}`,
  MemberChallange: (id: number) => `member/${id}/challenge`,
  Voice: `voice`,
  VoicePropose: `propose`,
};

function App() {
  const { publicClient, webSocketPublicClient } = configureChains(
    [chain],
    [wagmiAlchemyProvider({ apiKey: ALCHEMY_KEY })]
  );

  const config = createConfig({
    publicClient,
    webSocketPublicClient,
  });

  return (
    <div className="App">
      <WagmiConfig config={config}>
        <SignerContext>
          <AccountContext>
            <GlobalStyles />
            <ThemedApp>
              <ResponsiveApp>
                <QueryClientProvider client={queryClient}>
                  <BrowserRouter>
                    <ViewportContainer>
                      <Routes>
                        {/* Landing and project create */}
                        <Route path={RouteNames.Base} element={<LandingPage />}></Route>
                        <Route path={RouteNames.More} element={<LearnMore />}></Route>
                        <Route path={RouteNames.Start} element={<CreateProject />}></Route>

                        {/* Project-Specific */}
                        <Route
                          path={`/p/:projectId`}
                          element={
                            <ProjectContext>
                              <ConnectedMemberContext>
                                <MemberContext>
                                  <VouchContext>
                                    <ProjectBase />
                                  </VouchContext>
                                </MemberContext>
                              </ConnectedMemberContext>
                            </ProjectContext>
                          }>
                          <Route path={RouteNames.Base} element={<ProjectHome />}></Route>
                          <Route path={`account/:tokenId/*`} element={<AccountPage />}></Route>
                          <Route
                            path={`vouch/:hash`}
                            element={
                              // Another Member context for the vouched account
                              <MemberContext>
                                <VouchAccount />
                              </MemberContext>
                            }></Route>
                          <Route path={RouteNames.Join} element={<Join />}></Route>
                          <Route path={RouteNames.Vouch} element={<VouchPage />}></Route>
                          <Route path={RouteNames.MyVouches} element={<Vouches />}></Route>
                          <Route path={RouteNames.VouchesAll} element={<AllVouches />}></Route>
                          <Route path={RouteNames.Challenges} element={<Challenges />}></Route>
                          {/* <Route path={ProjectRouteNames.Base} element={<TestComponent />}></Route> */}
                          <Route
                            path={'voice'}
                            element={
                              <SemaphoreContext>
                                <VoiceBase />
                              </SemaphoreContext>
                            }>
                            <Route
                              path={''}
                              element={
                                <VoiceSendContext>
                                  <VoicePropose />
                                </VoiceSendContext>
                              }></Route>
                            <Route
                              path={RouteNames.VoicePropose}
                              element={
                                <VoiceReadContext>
                                  <VoicePage />
                                </VoiceReadContext>
                              }></Route>
                          </Route>
                          <Route path={RouteNames.Base} element={<ProjectHome />}></Route>
                        </Route>
                      </Routes>
                    </ViewportContainer>
                  </BrowserRouter>
                </QueryClientProvider>
              </ResponsiveApp>
            </ThemedApp>
          </AccountContext>
        </SignerContext>
      </WagmiConfig>
    </div>
  );
}

export default App;
