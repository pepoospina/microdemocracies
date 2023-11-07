import { Box } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { RouteNames } from '../../App';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { VoucheCard } from './VouchCard';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { BottomButton } from '../common/BottomButton';
import { useAccountContext } from '../../wallet/AccountContext';

export const Vouches = (): JSX.Element => {
  const navigate = useNavigate();
  const { isConnected } = useAccountContext();
  const { myVouches } = useConnectedMember();

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
      <BottomButton icon={<FormPrevious />} label="home" onClick={() => navigate(RouteNames.Base)}></BottomButton>
    </AppScreen>
  );
};
