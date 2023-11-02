import { Anchor, Box, Text } from 'grommet';
import { AppButton } from '../../ui-components';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../MainPage';
import { useRegistry } from '../../contexts/RegistryContext';
import { MyNetworkWidget } from '../mynetwork/MyNetworkWidget';
import { useConnectedAccount } from '../../contexts/ConnectedAccountContext';
import { AppConnect } from '../../components/app/AppConnect';
import { COMMUNITY_MEMBER, COMMUNITY_NAME } from '../../config/community';

export interface ILandingPageProps {
  dum?: any;
}

export const LandingPage = (props: ILandingPageProps) => {
  const { isConnected } = useRegistry();
  const navigate = useNavigate();
  const { nMembers } = useRegistry();
  const { tokenId } = useConnectedAccount();

  return (
    <Box style={{ flexGrow: '1', width: '100%', overflowY: 'auto' }} align="center" id="LandingPageContainer">
      <Box justify="center" align="center" style={{ flexShrink: '0', marginTop: '6vh' }}>
        <Text size="48px" weight="bold">
          {COMMUNITY_NAME}
        </Text>
        {tokenId ? (
          <Box>
            <Text size="xlarge">
              <Anchor onClick={() => navigate(RouteNames.VouchesAll)}>Population: {nMembers}</Anchor>
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
        {isConnected ? <MyNetworkWidget></MyNetworkWidget> : <AppConnect primary style={{ width: '200px' }} />}
      </Box>
    </Box>
  );
};
