import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountOverview } from './AccountOverview';
import { AccountChallenge } from '../challenges/AccountChallenge';

import { AppBottomButton } from '../common/BottomButtons';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';
import { useMember } from '../../contexts/MemberContext';

export const AccountPage = () => {
  const { t } = useTranslation();
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { accountRead, accountPapRead } = useMember({ tokenId: tokenId ? +tokenId : undefined });

  if (!tokenId) {
    throw new Error('tokenId undefined');
  }

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={`${cap(t('member'))} #${tokenId}`} />

      <Box pad="large">
        <AccountOverview account={accountRead} pap={accountPapRead}></AccountOverview>
        <AccountChallenge account={accountRead} cardStyle={{ marginTop: '36px', marginBottom: '36px' }} />
      </Box>

      <AppBottomButton icon={<FormPrevious />} label="back" onClick={() => navigate(-1)}></AppBottomButton>
    </ViewportPage>
  );
};
