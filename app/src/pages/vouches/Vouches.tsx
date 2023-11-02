import { Box } from 'grommet';
import { RouteNames } from '../MainPage';
import { useNavigate } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { AppFormScreen } from '../../ui-components/AppFormScreen';
import { useConnectedAccount } from '../../contexts/ConnectedAccountContext';
import { VoucheCard } from './VouchCard';
import { AppConnect } from '../../components/app/AppConnect';
import { BottomButton } from '../common/BottomButton';

export const Vouches = (): JSX.Element => {
  const navigate = useNavigate();
  const { myVouches, isConnected } = useConnectedAccount();

  return (
    <AppFormScreen label="My Vouches">
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
          <AppConnect />
        )}
      </Box>
      <BottomButton icon={<FormPrevious />} label="home" onClick={() => navigate(RouteNames.Base)}></BottomButton>
    </AppFormScreen>
  );
};
