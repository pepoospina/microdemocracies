import { Box } from 'grommet';
import { ProjectRouteNames } from '../MainProjectPage';
import { useNavigate } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { useConnectedAccount } from '../../contexts/ConnectedAccountContext';
import { VoucheCard } from './VouchCard';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { BottomButton } from '../common/BottomButton';

export const Vouches = (): JSX.Element => {
  const navigate = useNavigate();
  const { myVouches, isConnected } = useConnectedAccount();

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
      <BottomButton
        icon={<FormPrevious />}
        label="home"
        onClick={() => navigate(ProjectRouteNames.Base)}></BottomButton>
    </AppScreen>
  );
};
