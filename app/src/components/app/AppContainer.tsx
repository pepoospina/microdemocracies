import { createContext, useContext, useState } from 'react';

import { GlobalNav } from './GlobalNav';
import { Routes, Route } from 'react-router-dom';
import { ConnectedMemberContext } from '../../contexts/ConnectedAccountContext';
import { ProjectContext } from '../../contexts/ProjectContext';
import { VoiceReadContext } from '../../contexts/VoiceReadContext';
import { AccountPage } from '../../pages/account/AccountPage';
import { Challenges } from '../../pages/challenges/Challenges';
import { CreateProject } from '../../pages/create/CreateProject';
import { Join } from '../../pages/join/Join';
import { AppHome } from '../../pages/myprojects/AppHome';
import { ProjectBase } from '../../pages/project/ProjectBase';
import { ProjectHome } from '../../pages/project/ProjectHome';
import { VoiceBase } from '../../pages/voice/VoiceBase';
import { VoicePropose } from '../../pages/voice/VoicePropose';
import { InviteAccount } from '../../pages/vouch/InviteAccount';
import { InvitePage } from '../../pages/vouch/InvitePage';
import { Members } from '../../pages/vouches/Members';
import { Vouches } from '../../pages/vouches/Vouches';
import { RouteNames } from '../../route.names';
import { TestCreateProject } from '../../test/TestCreateProject';
import { TestProject } from '../../test/TestProject';

export type AppContainerContextType = {
  setTitle: (title: string) => void;
};

const AppContainerContextValue = createContext<AppContainerContextType | undefined>(undefined);

export const AppContainer = (props: React.PropsWithChildren) => {
  const [title, setTitle] = useState<string>();

  return (
    <AppContainerContextValue.Provider value={{ setTitle }}>
      <GlobalNav title={title} />
      <Routes>
        {/* Landing and project create */}
        <Route path={RouteNames.AppHome} element={<AppHome></AppHome>}></Route>
        <Route path={RouteNames.Start} element={<CreateProject />}></Route>

        {/* Project-Specific */}
        <Route
          path={`p/:projectId`}
          element={
            <ProjectContext>
              <ConnectedMemberContext>
                <VoiceReadContext>
                  <ProjectBase />
                </VoiceReadContext>
              </ConnectedMemberContext>
            </ProjectContext>
          }>
          <Route path={''} element={<ProjectHome />}></Route>
          <Route path={`member/:tokenId/*`} element={<AccountPage />}></Route>
          <Route path={`${RouteNames.Invite}/:hash`} element={<InviteAccount />}></Route>
          <Route path={RouteNames.Join} element={<Join />}></Route>
          <Route path={RouteNames.Invite} element={<InvitePage />}></Route>
          <Route path={RouteNames.MyVouches} element={<Vouches />}></Route>
          <Route path={RouteNames.Members} element={<Members />}></Route>
          <Route path={RouteNames.Challenges} element={<Challenges />}></Route>
          <Route path={'voice'} element={<VoiceBase />}>
            <Route path={RouteNames.VoicePropose} element={<VoicePropose />}></Route>
          </Route>

          <Route path={'test'} element={<TestProject />}></Route>
        </Route>

        <Route path={'/test'} element={<TestCreateProject />}></Route>
      </Routes>
    </AppContainerContextValue.Provider>
  );
};

export const useAppContainer = (): AppContainerContextType => {
  const context = useContext(AppContainerContextValue);
  if (!context) throw Error('context not found');
  return context;
};
