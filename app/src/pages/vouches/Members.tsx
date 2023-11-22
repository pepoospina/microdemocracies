import { Box } from 'grommet';
import { Add, FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { VoucheCard } from './VouchCard';
import { AppBottomButton, AppBottomButtons } from '../common/BottomButtons';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

export const Members = (): JSX.Element => {
  const { allVouches } = useProjectContext();
  const navigate = useNavigate();

  return (
    <AppScreen label="Members">
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
      <AppBottomButtons
        left={{
          icon: <FormPrevious />,
          label: 'back',
          action: () => navigate('..'),
        }}
        right={{
          primary: true,
          icon: <Add />,
          label: 'invite',
          action: () => navigate('../invite'),
        }}></AppBottomButtons>
    </AppScreen>
  );
};
