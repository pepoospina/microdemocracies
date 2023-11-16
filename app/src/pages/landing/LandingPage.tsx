import { Box, Text } from 'grommet';
import { appName } from '../../config/community';
import { AppButton } from '../../ui-components';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../App';
import { useResponsive } from '../../components/app';
import { LearnMore } from './LearnMore';

// import { CollectionNames, db } from '../../firestore/database';
// import { getDoc, doc } from 'firebase/firestore';
// import { postProject } from '../../utils/project';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { mobile } = useResponsive();

  const logoSize = mobile ? '36px' : '48px';

  const start = () => {
    navigate(RouteNames.Start);
  };

  return (
    <Box fill align="center">
      <Box justify="center" align="center" style={{ flexShrink: '0', marginTop: '6vh' }}>
        <Text size={logoSize} weight="bold">
          {appName}
        </Text>
      </Box>

      <Box style={{ flexGrow: '2', width: '100%', flexShrink: '0' }} justify="center" align="center">
        <LearnMore></LearnMore>
      </Box>

      <Box justify="center" align="center" style={{ flexShrink: '0', marginBottom: '6vh' }}>
        <AppButton primary onClick={start} label="Start now" style={{ margin: '12px 0px', width: '200px' }} />
      </Box>
    </Box>
  );
};
