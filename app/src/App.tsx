import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { alchemyProvider as wagmiAlchemyProvider } from 'wagmi/providers/alchemy';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { ResponsiveApp, ThemedApp } from './components/app';
import { ProjectContext } from './contexts/ProjectContext';

import { chain } from './wallet/config';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { ALCHEMY_KEY } from './config/appConfig';
import { ViewportContainer } from './components/app/Viewport';
import { VoiceReadContext } from './contexts/VoiceReadContext';
import { VoiceSendContext } from './contexts/VoiceSendContext';
import { VouchContext } from './contexts/VouchContext';
import { AccountPage } from './pages/account/AccountPage';
import { Challenges } from './pages/challenges/Challenges';
import { CreateProject } from './pages/create/CreateProject';
import { Join } from './pages/join/Join';
import { LandingPage } from './pages/landing/LandingPage';
import { ProjectHome } from './pages/project/ProjectHome';
import { VoiceBase } from './pages/voice/VoiceBase';
import { VoicePropose } from './pages/voice/VoicePropose';
import { InvitePage } from './pages/vouch/InvitePage';
import { InviteAccount } from './pages/vouch/InviteAccount';
import { Members } from './pages/vouches/Members';
import { Vouches } from './pages/vouches/Vouches';
import { ProjectBase } from './pages/project/ProjectBase';
import { SignerContext } from './wallet/SignerContext';
import { ConnectedMemberContext } from './contexts/ConnectedAccountContext';
import { AccountContext } from './wallet/AccountContext';
import { MemberContext } from './contexts/MemberContext';
import { SemaphoreContext } from './contexts/SemaphoreContext';
import { AppHome } from './pages/myprojects/AppHome';
import { TestComponent } from './test/TestComponent';

const queryClient = new QueryClient();

export const RouteNames = {
  Base: ``,
  Start: 'start',
  Projects: 'home',
  ProjectHome: (projectId: string) => `/p/${projectId}`,
  Join: `join`,
  Invite: `invite`,
  InviteAccount: (hash: string) => `invite/${hash}`,
  MyVouches: `invites`,
  Members: `members`,
  Challenges: `challenges`,
  Member: (id: number) => `member/${id}`,
  MemberChallange: (id: number) => `member/${id}/challenge`,
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
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <SignerContext>
            <AccountContext>
              <SemaphoreContext>
                <GlobalStyles />
                <ThemedApp>
                  <ResponsiveApp>
                    <BrowserRouter>
                      <ViewportContainer>
                        <Routes>
                          {/* Landing and project create */}
                          <Route path={RouteNames.Base} element={<LandingPage />}></Route>
                          <Route path={RouteNames.Projects} element={<AppHome></AppHome>}></Route>
                          <Route path={RouteNames.Start} element={<CreateProject />}></Route>

                          {/* Project-Specific */}
                          <Route
                            path={`/p/:projectId`}
                            element={
                              <ProjectContext>
                                <ConnectedMemberContext>
                                  <MemberContext>
                                    <VouchContext>
                                      <VoiceSendContext>
                                        <VoiceReadContext>
                                          <ProjectBase />
                                        </VoiceReadContext>
                                      </VoiceSendContext>
                                    </VouchContext>
                                  </MemberContext>
                                </ConnectedMemberContext>
                              </ProjectContext>
                            }>
                            <Route path={RouteNames.Base} element={<ProjectHome />}></Route>
                            <Route path={`member/:tokenId/*`} element={<AccountPage />}></Route>
                            <Route path={`${RouteNames.Invite}/:hash`} element={<InviteAccount />}></Route>
                            <Route path={RouteNames.Join} element={<Join />}></Route>
                            <Route path={RouteNames.Invite} element={<InvitePage />}></Route>
                            <Route path={RouteNames.MyVouches} element={<Vouches />}></Route>
                            <Route path={RouteNames.Members} element={<Members />}></Route>
                            <Route path={RouteNames.Challenges} element={<Challenges />}></Route>
                            {/* <Route path={ProjectRouteNames.Base} element={<TestComponent />}></Route> */}
                            <Route path={'voice'} element={<VoiceBase />}>
                              <Route path={RouteNames.VoicePropose} element={<VoicePropose />}></Route>
                            </Route>
                            <Route path={RouteNames.Base} element={<ProjectHome />}></Route>
                          </Route>
                          <Route path={'/test'} element={<TestComponent />}></Route>
                        </Routes>
                      </ViewportContainer>
                    </BrowserRouter>
                  </ResponsiveApp>
                </ThemedApp>
              </SemaphoreContext>
            </AccountContext>
          </SignerContext>
        </WagmiConfig>
      </QueryClientProvider>
    </div>
  );
}

export default App;
