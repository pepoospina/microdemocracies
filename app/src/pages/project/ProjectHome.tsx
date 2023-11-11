import { Anchor, Box, Text } from 'grommet';
import { AppButton } from '../../ui-components';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import { MyNetworkWidget } from '../mynetwork/MyNetworkWidget';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { COMMUNITY_MEMBER } from '../../config/community';
import { useAccountContext } from '../../wallet/AccountContext';
import { RouteNames } from '../../App';
import { StatementEditable } from '../voice/StatementEditable';

export interface IProjectHome {
  dum?: any;
}

export const ProjectHome = (props: IProjectHome) => {
  const navigate = useNavigate();
  const { nMembers, project } = useProjectContext();

  const { isConnected } = useAccountContext();
  const { tokenId } = useConnectedMember();

  return (
    <Box style={{ flexGrow: '1', width: '100%', overflowY: 'auto' }} align="center" id="LandingPageContainer">
      <Box justify="center" align="center" style={{ flexShrink: '0', marginTop: '6vh' }}>
        <Text size="48px" weight="bold">
          <StatementEditable value={project?.whatStatement}></StatementEditable>
        </Text>
        {tokenId ? (
          <Box>
            <Text size="xlarge">
              <Anchor onClick={() => navigate(RouteNames.VouchesAll)}>Members: {nMembers}</Anchor>
            </Text>
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box justify="center" align="center" style={{ flexGrow: 1, flexShrink: '0', marginBottom: '16px' }}>
        {!tokenId ? (
          <>
            <Box>
              <Text size="110px">{nMembers}</Text>
            </Box>
            <Box>
              <Anchor onClick={() => navigate(RouteNames.VouchesAll)}>{COMMUNITY_MEMBER}s</Anchor>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Text size="xlarge">Welcome</Text>
            </Box>
            <Box></Box>
            <Box>
              <Text size="48px">
                {COMMUNITY_MEMBER} #{tokenId}
              </Text>
            </Box>
          </>
        )}
      </Box>

      <Box style={{ flexGrow: '2', width: '200px', flexShrink: '0' }} justify="center">
        {!tokenId ? (
          <AppButton onClick={() => navigate(RouteNames.Join)} label="JOIN" primary style={{ marginBottom: '15px' }} />
        ) : (
          <></>
        )}
        <AppButton onClick={() => navigate(RouteNames.Vouch)} label="VOUCH" style={{ marginBottom: '15px' }} />
        <AppButton onClick={() => navigate(RouteNames.Voice)} label="VOICE" style={{ marginBottom: '15px' }} />
      </Box>

      <Box style={{ width: '100%', flexShrink: '0' }} pad="large" justify="center" align="center">
        {isConnected ? <MyNetworkWidget></MyNetworkWidget> : <AppConnectButton primary style={{ width: '200px' }} />}
      </Box>
    </Box>
  );
};
