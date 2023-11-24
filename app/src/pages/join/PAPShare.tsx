import { Anchor, Box, Spinner } from 'grommet';
import { AppQRCode } from '../../components/AppQRCode';

import { useProjectContext } from '../../contexts/ProjectContext';
import { useCopyToClipboard } from '../../utils/copy.clipboard';
import { AppButton } from '../../ui-components';
import { Send, StatusGood } from 'grommet-icons';

export interface IPAPShare {
  cid?: string;
}

export const PAPShare = (props: IPAPShare) => {
  const cid = props.cid;
  const { projectId } = useProjectContext();

  const { copy, copied } = useCopyToClipboard();

  const share = () => {
    const link = `../${projectId}/vouch/${cid}`;
    if (navigator.share) {
      navigator.share({
        url: link,
        text: `Join our micro(r)evolution!`,
      });
    } else {
      copy(link);
    }
  };

  return (
    <Box fill pad="large" justify="center">
      {cid ? (
        <Box align="center" style={{ width: '100%' }}>
          <AppQRCode input={cid}></AppQRCode>
          <Box margin="large" direction="row" align="center" style={{ width: '100%' }}>
            <AppButton
              onClick={() => share()}
              icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
              reverse
              primary
              style={{ marginLeft: '12px', width: '100%' }}
              label={copied ? 'link copied!' : 'share'}></AppButton>
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
