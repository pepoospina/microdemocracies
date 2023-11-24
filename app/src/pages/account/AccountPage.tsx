import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountOverview } from './AccountOverview';
import { AccountChallenge } from '../challenges/AccountChallenge';

import { MemberContext } from '../../contexts/MemberContext';
import { ChallengeContext } from '../../contexts/CurrentChallengeContext';
import { AppBottomButton } from '../common/BottomButtons';
import { COMMUNITY_MEMBER } from '../../config/community';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';

export const AccountPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  if (!tokenId) {
    throw new Error('tokenId undefined');
  }

  console.log({ tokenId });

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={`${COMMUNITY_MEMBER} #${tokenId}`} />

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
