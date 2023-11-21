import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { VoucheCard } from './VouchCard';
import { BottomButton } from '../common/BottomButton';
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
      <BottomButton icon={<FormPrevious />} label="back" onClick={() => navigate('..')}></BottomButton>
    </AppScreen>
  );
};
