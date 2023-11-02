import { Box } from 'grommet';
import { RouteNames } from '../MainPage';
import { useNavigate } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { AppFormScreen } from '../../ui-components/AppFormScreen';
import { VoucheCard } from './VouchCard';
import { BottomButton } from '../common/BottomButton';
import { useRegistry } from '../../contexts/RegistryContext';

export const AllVouches = (): JSX.Element => {
  const navigate = useNavigate();
  const { allVouches } = useRegistry();

  return (
    <AppFormScreen label="Vouches">
      <Box pad="large">
        <Box>
          {allVouches?.map((vouch) => {
            return (
              <Box style={{ marginBottom: '16px' }}>
                <VoucheCard vouch={vouch}></VoucheCard>
              </Box>
            );
          })}
        </Box>
      </Box>
      <BottomButton icon={<FormPrevious />} label="home" onClick={() => navigate(RouteNames.Base)}></BottomButton>
    </AppFormScreen>
  );
};
