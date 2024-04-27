import { Box } from 'grommet'
import { createContext, useContext, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { ConnectedMemberContext } from '../../contexts/ConnectedAccountContext'
import { ProjectContext } from '../../contexts/ProjectContext'
import { AccountPage } from '../../pages/account/AccountPage'
import { CreateProject } from '../../pages/create/CreateProject'
import { JoinPage } from '../../pages/join/JoinPage'
import { AppLog } from '../../pages/log/Log'
import { AppHome } from '../../pages/myprojects/AppHome'
import { ProjectBase } from '../../pages/project/ProjectBase'
import { ProjectHomePage } from '../../pages/project/ProjectHome'
import { VoiceBasePage } from '../../pages/voice/VoiceBase'
import { VoicePropose } from '../../pages/voice/VoicePropose'
import { VoiceStatementPageBase } from '../../pages/voice/VoiceStatementPageBase'
import { InviteAccountPage } from '../../pages/vouch/InviteAccount'
import { InvitePage } from '../../pages/vouch/InvitePage'
import { MembersPage } from '../../pages/vouches/MembersPage'
import { RouteNames } from '../../route.names'
import { TestCreateProject } from '../../test/TestCreateProject'
import { TestProject } from '../../test/TestProject'
import { GlobalNav } from './GlobalNav'
import { MAX_WIDTH_APP, ViewportContainer } from './Viewport'

export interface SetPageTitleType {
  prefix: string
  main: string
}

export type AppContainerContextType = {
  setTitle: (title: SetPageTitleType) => void
}

const AppContainerContextValue = createContext<AppContainerContextType | undefined>(
  undefined,
)

export const AppContainer = (props: React.PropsWithChildren) => {
  const [title, setTitle] = useState<SetPageTitleType>()

  return (
    <AppContainerContextValue.Provider value={{ setTitle }}>
      <ViewportContainer style={{ maxWidth: MAX_WIDTH_APP }}>
        <Box
          pad={{ horizontal: 'medium' }}
          style={{ height: '80px', flexShrink: 0 }}
          justify="center"
        >
          <GlobalNav title={title} />
        </Box>
        <Box style={{ height: 'calc(100% - 80px)' }}>
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
                    <ProjectBase />
                  </ConnectedMemberContext>
                </ProjectContext>
              }
            >
              <Route path={''} element={<ProjectHomePage />}></Route>
              <Route
                path={`${RouteNames.Member}/:tokenId/*`}
                element={<AccountPage />}
              ></Route>
              <Route
                path={`${RouteNames.Invite}/:hash`}
                element={<InviteAccountPage />}
              ></Route>
              <Route path={RouteNames.Join} element={<JoinPage />}></Route>
              <Route path={RouteNames.Invite} element={<InvitePage />}></Route>
              <Route path={RouteNames.Members} element={<MembersPage />}></Route>
              <Route path={RouteNames.VoiceBase} element={<VoiceBasePage />}>
                <Route path={RouteNames.VoicePropose} element={<VoicePropose />}></Route>
                <Route
                  path={`${RouteNames.VoiceStatement}/:statementId`}
                  element={<VoiceStatementPageBase />}
                ></Route>
              </Route>

              <Route path={'test'} element={<TestProject />}></Route>
            </Route>

            <Route path={'/test'} element={<TestCreateProject />}></Route>
            <Route path={'/log'} element={<AppLog />}></Route>
          </Routes>
        </Box>
      </ViewportContainer>
    </AppContainerContextValue.Provider>
  )
}

export const useAppContainer = (): AppContainerContextType => {
  const context = useContext(AppContainerContextValue)
  if (!context) throw Error('context not found')
  return context
}
