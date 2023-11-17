import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { VoucheCard } from './VouchCard';
import { BottomButton } from '../common/BottomButton';
import { useProjectContext } from '../../contexts/ProjectContext';

export const AllVouches = (): JSX.Element => {
  const { allVouches } = useProjectContext();
  const { goHome } = useProjectContext();

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
      <BottomButton icon={<FormPrevious />} label="home" onClick={() => goHome()}></BottomButton>
    </AppScreen>
  );
};
