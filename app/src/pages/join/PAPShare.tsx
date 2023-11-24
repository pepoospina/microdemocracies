import { Anchor, Box, Spinner } from 'grommet';
import { AppQRCode } from '../../components/AppQRCode';

import { useProjectContext } from '../../contexts/ProjectContext';

export interface IPAPShare {
  cid?: string;
}

export const PAPShare = (props: IPAPShare) => {
  const cid = props.cid;
  const { projectId } = useProjectContext();

  return (
    <Box fill pad="large" justify="center">
      {cid ? (
        <Box align="center">
          <AppQRCode input={cid}></AppQRCode>
          <Box margin="large" direction="row">
            or{' '}
            <Anchor style={{ marginLeft: '8px' }} href={`../${projectId}/vouch/${cid}`}>
              share url
            </Anchor>
          </Box>
        </Box>
      ) : (
        <Box fill align="center" justify="center">
          <Spinner></Spinner>
        </Box>
      )}
    </Box>
  );
};
