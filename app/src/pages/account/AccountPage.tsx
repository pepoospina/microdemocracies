import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountOverview } from './AccountOverview';
import { AccountChallenge } from '../challenges/AccountChallenge';

import { MemberContext } from '../../contexts/MemberContext';
import { ChallengeContext } from '../../contexts/CurrentChallengeContext';
import { AppBottomButton } from '../common/BottomButtons';
import { AccountCircles } from './AccountCircles';
import { COMMUNITY_MEMBER } from '../../config/community';
import { ViewportHeadingLarge, ViewportPage } from '../../components/styles/LayoutComponents.styled';

export const AccountPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  if (!tokenId) {
    throw new Error('tokenId undefined');
  }

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={`${COMMUNITY_MEMBER} #${tokenId}`} />

      <Box>
        <MemberContext tokenId={+tokenId}>
          <Box margin={{ top: 'large' }} style={{ flexShrink: 0 }}>
            <AccountOverview></AccountOverview>
          </Box>
          <AccountCircles cardStyle={{ marginTop: '36px' }} />
          <ChallengeContext tokenId={+tokenId}>
            <AccountChallenge cardStyle={{ marginTop: '36px', marginBottom: '36px' }} />
          </ChallengeContext>
        </MemberContext>
      </Box>
      <AppBottomButton icon={<FormPrevious />} label="back" onClick={() => navigate(-1)}></AppBottomButton>
    </ViewportPage>
  );
};
