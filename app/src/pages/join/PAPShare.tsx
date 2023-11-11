import { Anchor, Box, Spinner } from 'grommet';
import { PAP } from '../../types';
import { AppQRCode } from '../../components/AppQRCode';
import { useEffect, useState } from 'react';

import { putObject } from '../../utils/store';
import { useProjectContext } from '../../contexts/ProjectContext';

export interface IPAPShare {
  pap?: PAP;
}

export const PAPShare = (props: IPAPShare) => {
  const [cid, setCid] = useState<string>();
  const { projectId } = useProjectContext();

  useEffect(() => {
    if (props.pap) {
      console.log(`Uploading ${JSON.stringify(props.pap)}`);
      putObject(props.pap).then((e) => {
        console.log({ e });
        setCid(e.cid);
      });
    }
  }, [props.pap]);

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
