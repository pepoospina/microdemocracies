import { Box, Text } from 'grommet';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { RouteNames } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppQRCode } from '../../components/AppQRCode';
import { AppConnect } from '../../components/app/AppConnect';
import { Camera, FormPrevious, Qr, Scan, Send, Square, StatusGood } from 'grommet-icons';
import { ViewportPage } from '../../components/app/Viewport';
import { AppBottomButton } from '../common/BottomButtons';
import { StatementEditable } from '../voice/StatementEditable';
import { ApplicationCard } from '../vouches/ApplicationCard';
import { useCopyToClipboard } from '../../utils/copy.clipboard';

export const InvitePage = (): JSX.Element => {
  const { project, projectId, inviteId, resetLink, applications } = useProjectContext();
  const { aaAddress } = useAccountContext();
  const { copy, copied } = useCopyToClipboard();

  const navigate = useNavigate();

  const [showLink, setShowLink] = useState<boolean>(false);
  const [scan, setScan] = useState<boolean>(false);

  const setResult = (cid: string) => {
    navigate(RouteNames.InviteAccount(cid));
  };

  const inviteLink = `${window.origin}/p/${projectId}/join?invitation=${inviteId}`;

  const share = () => {
    if (navigator.share) {
      navigator.share({
        url: inviteLink,
        text: `Join our micro(r)evolution!`,
      });
    } else {
      copy(inviteLink);
    }
  };

  const content = (() => {
    if (aaAddress === undefined) return <AppConnect></AppConnect>;

    if (showLink) {
      return (
        <Box align="center" style={{ flexShrink: 0 }}>
          <Box pad={{ vertical: 'large' }} style={{ width: '100%' }}>
            <AppButton onClick={() => setShowLink(false)} label="close"></AppButton>
          </Box>

          <AppHeading level="3">Share to invite</AppHeading>

          <Box pad={{ vertical: 'medium' }}>
            <AppQRCode input={inviteLink}></AppQRCode>
          </Box>

          <Box margin={{ vertical: 'large' }} style={{ width: '100%' }}>
            <AppCard margin={{ vertical: 'small' }}>
              <Text>Re-setting the link will invalidate the invitations sent with previous links</Text>
            </AppCard>
            <AppButton onClick={() => resetLink()} label="reset"></AppButton>
          </Box>
        </Box>
      );
    }

    if (scan) {
      return (
        <Box fill style={{ maxWidth: '500px', margin: '0 auto', flexShrink: 0 }}>
          <Box pad={{ vertical: 'large' }}>
            <AppButton onClick={() => setScan(false)} label="close"></AppButton>
          </Box>
          <QrScanner onDecode={(result) => setResult(result)} onError={(error) => console.log(error?.message)} />
        </Box>
      );
    }

    return (
      <Box style={{ flexShrink: 0 }}>
        <AppCard margin={{ vertical: 'medium' }}>
          <Text>Get link and share it with the new member. Once they apply, their application will appear here.</Text>
        </AppCard>
        <AppButton
          reverse
          icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
          disabled={inviteId === undefined}
          label={copied ? 'link copied!' : 'share link'}
          primary
          onClick={() => share()}></AppButton>
        <AppButton
          reverse
          icon={<Square color="black"></Square>}
          disabled={aaAddress === undefined || projectId === undefined}
          label={'show QR'}
          onClick={() => setShowLink(true)}
          margin={{ vertical: 'medium' }}></AppButton>
        <AppButton
          reverse
          icon={<Camera></Camera>}
          label={!scan ? 'scan QR' : 'cancel'}
          onClick={() => setScan(!scan)}
          style={{ marginBottom: '16px' }}></AppButton>
      </Box>
    );
  })();

  return (
    <ViewportPage>
      <Box align="center" pad={{ vertical: 'medium' }}>
        <AppHeading level="1">Invite new member</AppHeading>
      </Box>

      <Box fill pad={{ horizontal: 'large' }}>
        <Box style={{ flexShrink: 0 }}>
          <Box style={{ margin: '36px 0px' }}>
            <Text style={{ marginBottom: '16px' }}>Remember, this micro(r)evolution is for anyone who:</Text>
            <StatementEditable value={project?.whoStatement}></StatementEditable>
          </Box>

          {applications?.map((application) => {
            return (
              <Box style={{ marginBottom: '16px' }}>
                <ApplicationCard application={application}></ApplicationCard>
              </Box>
            );
          })}
        </Box>

        {content}
      </Box>

      <AppBottomButton icon={<FormPrevious />} label="back" onClick={() => navigate('../members')}></AppBottomButton>
    </ViewportPage>
  );
};
