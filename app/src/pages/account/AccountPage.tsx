import { Box } from 'grommet';
import { FormPrevious } from 'grommet-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountOverview } from './AccountOverview';
import { AccountChallenge } from '../challenges/AccountChallenge';

import { AccountContext } from '../../contexts/AccountContext';

import { ChallengeContext } from '../../contexts/CurrentChallengeContext';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { ProjectRouteNames } from '../MainProjectPage';
import { BottomButton } from '../common/BottomButton';
import { AccountCircles } from './AccountCircles';
import { COMMUNITY_MEMBER } from '../../config/community';

export const AccountPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  if (!tokenId) {
    throw new Error('tokenId undefined');
  }

  return (
    <AppScreen label={`${COMMUNITY_MEMBER} #${tokenId}`}>
      <Box pad={{ top: '0', left: 'large', right: 'large' }} style={{ overflowY: 'auto' }}>
        <AccountContext tokenId={+tokenId}>
          <Box margin={{ top: 'large' }} style={{ flexShrink: 0 }}>
            <AccountOverview></AccountOverview>
          </Box>
          <AccountCircles cardStyle={{ marginTop: '36px' }} />
          <ChallengeContext tokenId={+tokenId}>
            <AccountChallenge cardStyle={{ marginTop: '36px', marginBottom: '36px' }} />
          </ChallengeContext>
        </AccountContext>
      </Box>
      <BottomButton
        icon={<FormPrevious />}
        label="home"
        onClick={() => navigate(ProjectRouteNames.Base)}></BottomButton>
    </AppScreen>
  );
};
