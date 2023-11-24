import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { VoucheCard } from './VouchCard';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { AppBottomButton } from '../common/BottomButtons';
import { useAccountContext } from '../../wallet/AccountContext';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';

export const Vouches = (): JSX.Element => {
  const { isConnected } = useAccountContext();
  const { myVouches } = useConnectedMember();

  return (
    <ViewportPage>
      <ViewportHeadingLarge label="My Invitations"></ViewportHeadingLarge>
      <Box pad="large">
        {isConnected ? (
          <Box>
            {myVouches?.map((vouch) => {
              return (
                <Box style={{ marginBottom: '16px' }}>
                  <VoucheCard vouch={vouch}></VoucheCard>
                </Box>
              );
            })}
          </Box>
        ) : (
          <AppConnectButton />
        )}
      </Box>
      <AppBottomButton icon={<FormPrevious />} label="home" onClick={() => '..'}></AppBottomButton>
    </ViewportPage>
  );
};
