import { Box, Text } from 'grommet';
import { appName } from '../../config/community';
import { AppButton } from '../../ui-components';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../App';

// import { CollectionNames, db } from '../../firestore/database';
// import { getDoc, doc } from 'firebase/firestore';
// import { postProject } from '../../utils/project';

export const LandingPage = () => {
  const navigate = useNavigate();

  const textStyle: React.CSSProperties = { marginBottom: '40px', fontSize: '24px' };

  // const start = async () => {
  //   // postProject({
  //   //   projectId: 1,
  //   //   address: '0x',
  //   //   selectedDetails: {
  //   //     personal: {},
  //   //     platform: {},
  //   //   },
  //   //   whatStatement: 'what',
  //   //   whoStatement: 'who',
  //   // });
  //   const ref = doc(db, 'projects', '1');
  //   const rdoc = await getDoc(ref);
  //   console.log({ ex: rdoc.exists(), data: rdoc.data(), id: rdoc.id, db });
  // };

  const start = () => {
    navigate(RouteNames.Start);
  };

  return (
    <Box fill align="center">
      <Box justify="center" align="center" style={{ flexShrink: '0', marginTop: '6vh' }}>
        <Text size="42px" weight="bold">
          {appName}
        </Text>
      </Box>

      <Box style={{ flexGrow: '2', width: '100%', flexShrink: '0' }} justify="center" align="center">
        <Text style={textStyle}>
          It's <span style={{ fontWeight: '600' }}>time</span>
        </Text>
        <Text style={textStyle}>
          for <span style={{ fontWeight: '600' }}>you</span>
        </Text>
        <Text style={textStyle}>
          to <span style={{ fontWeight: '600' }}>do</span>
        </Text>
        <AppButton primary onClick={start} label="Start now" style={{ margin: '12px 0px', width: '200px' }} />
      </Box>

      <Box justify="center" align="center" style={{ flexShrink: '0', marginBottom: '6vh' }}>
        <AppButton onClick={() => navigate(RouteNames.More)} label="Learn more" style={{ width: '200px' }} />
      </Box>
    </Box>
  );
};
