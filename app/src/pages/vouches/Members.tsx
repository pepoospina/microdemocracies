import { Box } from 'grommet';
import { Add, FormPrevious } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';

import { VoucheCard } from './VouchCard';
import { AppBottomButtons } from '../common/BottomButtons';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ApplicationCard } from './ApplicationCard';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';

export const Members = (): JSX.Element => {
  const { allVouches, applications } = useProjectContext();
  const navigate = useNavigate();

  return (
    <ViewportPage>
      <ViewportHeadingLarge label="Members"></ViewportHeadingLarge>
      <Box pad="large">
        {applications?.map((application, ix) => {
          return (
            <Box key={ix} style={{ marginBottom: '16px' }}>
              <ApplicationCard application={application}></ApplicationCard>
            </Box>
          );
        })}
        {allVouches?.map((vouch, ix) => {
          return (
            <Box key={ix} style={{ marginBottom: '16px', flexShrink: 0 }}>
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
    </ViewportPage>
  );
};
