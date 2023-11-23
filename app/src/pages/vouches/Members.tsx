import { Box } from 'grommet';
import { Add, FormPrevious } from 'grommet-icons';

import { AppScreen } from '../../ui-components/AppFormScreen';
import { VoucheCard } from './VouchCard';
import { AppBottomButtons } from '../common/BottomButtons';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { ApplicationCard } from './ApplicationCard';

export const Members = (): JSX.Element => {
  const { allVouches, applications } = useProjectContext();
  const navigate = useNavigate();

  return (
    <AppScreen label="Members">
      <Box pad="large">
        {applications?.map((application) => {
          return (
            <Box style={{ marginBottom: '16px' }}>
              <ApplicationCard application={application}></ApplicationCard>
            </Box>
          );
        })}
        {allVouches?.map((vouch) => {
          return (
            <Box style={{ marginBottom: '16px', flexShrink: 0 }}>
              <VoucheCard vouch={vouch}></VoucheCard>
            </Box>
          );
        })}
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
