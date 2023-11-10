import { Anchor, Box, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { RouteNames } from '../../App';
import { AppCard } from '../../ui-components';

export const MyNetworkWidget = () => {
  const { myVouches, myChallenge, tokenId } = useConnectedMember();
  const navigate = useNavigate();

  const goToMyVouches = () => {
    navigate(RouteNames.MyVouches);
  };

  const goToAccount = () => {
    if (tokenId) {
      navigate(RouteNames.Member(tokenId));
    }
  };

  if (!tokenId) return <></>;

  return (
    <AppCard fill align="center" justify="center" style={{ maxWidth: '400px' }}>
      <Text weight="bold" style={{ position: 'absolute', top: '-25px' }}>
        My Network
      </Text>
      <Box margin={{ bottom: '16px' }}>
        <Anchor onClick={() => goToMyVouches()} label={`Vouches (${myVouches?.length})`}></Anchor>
      </Box>
      <Box>
        {myChallenge !== undefined && myChallenge !== null ? (
          <Anchor onClick={() => goToAccount()} label={`Account challenged!`}></Anchor>
        ) : (
          <></>
        )}
      </Box>
    </AppCard>
  );
};
