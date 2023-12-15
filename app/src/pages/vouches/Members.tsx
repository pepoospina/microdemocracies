import { Box } from 'grommet';
import { Add, FormPrevious } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';

import { VoucheCard } from './VouchCard';
import { AppBottomButton } from '../common/BottomButtons';
import { useProjectContext } from '../../contexts/ProjectContext';
import { ApplicationCard } from './ApplicationCard';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { cap } from '../../utils/general';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../../ui-components';

export const Members = (): JSX.Element => {
  const { t } = useTranslation();
  const { allVouches, applications } = useProjectContext();
  const navigate = useNavigate();

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={cap(t('members'))}></ViewportHeadingLarge>
      <Box pad="large">
        <AppButton
          margin={{ bottom: 'medium' }}
          primary
          icon={<Add />}
          label={t('invite')}
          onClick={() => navigate('../invite')}></AppButton>

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
      <AppBottomButton icon={<FormPrevious />} label={t('back')} onClick={() => navigate('..')}></AppBottomButton>
    </ViewportPage>
  );
};
