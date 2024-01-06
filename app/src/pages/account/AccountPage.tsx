import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountOverview } from './AccountOverview';
import { AccountChallenge } from '../challenges/AccountChallenge';

import { AppBottomButton } from '../common/BottomButtons';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';

export const AccountPage = () => {
  const { t } = useTranslation();
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { account } = useMember(+tokenId);

  if (!tokenId) {
    throw new Error('tokenId undefined');
  }

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={`${cap(t('member'))} #${tokenId}`} />

      <Box pad="large">
        <AccountOverview account={account}></AccountOverview>
        <AccountChallenge account={account} cardStyle={{ marginTop: '36px', marginBottom: '36px' }} />
      </Box>

      <AppBottomButton icon={<FormPrevious />} label="back" onClick={() => navigate(-1)}></AppBottomButton>
    </ViewportPage>
  );
};
