import { Box } from 'grommet';
import { ProjectRouteNames } from '../MainProjectPage';
import { useNavigate } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { VoucheCard } from './VouchCard';
import { BottomButton } from '../common/BottomButton';
import { useRegistry } from '../../contexts/RegistryContext';

export const AllVouches = (): JSX.Element => {
  const navigate = useNavigate();
  const { allVouches } = useRegistry();

  return (
    <AppScreen label="Vouches">
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
      <BottomButton
        icon={<FormPrevious />}
        label="home"
        onClick={() => navigate(ProjectRouteNames.Base)}></BottomButton>
    </AppScreen>
  );
};
