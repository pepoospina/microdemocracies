import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountOverview } from './AccountOverview';
import { AccountChallenge } from '../challenges/AccountChallenge';

import { MemberContext } from '../../contexts/MemberContext';
import { ChallengeContext } from '../../contexts/CurrentChallengeContext';
import { AppBottomButton } from '../common/BottomButtons';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';

export const AccountPage = () => {
  const { t } = useTranslation();
  const { tokenId } = useParams();
  const navigate = useNavigate();

  if (!tokenId) {
    throw new Error('tokenId undefined');
  }

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={`${cap(t('member'))} #${tokenId}`} />

      <Box pad="large">
        <MemberContext tokenId={+tokenId}>
          <Box style={{ flexShrink: 0 }}>
            <AccountOverview></AccountOverview>
          </Box>

          <ChallengeContext tokenId={+tokenId}>
            <AccountChallenge cardStyle={{ marginTop: '36px', marginBottom: '36px' }} />
          </ChallengeContext>
        </MemberContext>
      </Box>

      <AppBottomButton icon={<FormPrevious />} label="back" onClick={() => navigate(-1)}></AppBottomButton>
    </ViewportPage>
  );
};
