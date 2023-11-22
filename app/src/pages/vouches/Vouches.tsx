import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { VoucheCard } from './VouchCard';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { AppBottomButton } from '../common/BottomButtons';
import { useAccountContext } from '../../wallet/AccountContext';
import { useProjectContext } from '../../contexts/ProjectContext';

export const Vouches = (): JSX.Element => {
  const { isConnected } = useAccountContext();
  const { myVouches } = useConnectedMember();
  const { goHome } = useProjectContext();

  return (
    <AppScreen label="My Vouches">
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
      <AppBottomButton icon={<FormPrevious />} label="home" onClick={() => goHome()}></AppBottomButton>
    </AppScreen>
  );
};
