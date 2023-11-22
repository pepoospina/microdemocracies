import { Anchor, Box, Text } from 'grommet';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { RouteNames } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useAccountContext } from '../../wallet/AccountContext';
import { postInvite } from '../../utils/project';
import { AppQRCode } from '../../components/AppQRCode';
import { AppConnect } from '../../components/app/AppConnect';
import { useQuery } from 'react-query';
import { getInviteId } from '../../firestore/getters';
import { FormPrevious } from 'grommet-icons';
import { ViewportPage } from '../../components/styles/LayoutComponents.styled';
import { AppBottomButton } from '../common/BottomButtons';
import { StatementEditable } from '../voice/StatementEditable';

export const InvitePage = (): JSX.Element => {
  const { project, projectId } = useProjectContext();
  const { aaAddress } = useAccountContext();

  const navigate = useNavigate();

  const [showLink, setShowLink] = useState<boolean>(false);
  const [scan, setScan] = useState<boolean>(false);

  const setResult = (cid: string) => {
    navigate(RouteNames.InviteAccount(cid));
  };

  const { data: inviteId, refetch: refetchInvite } = useQuery(['getInviteLink', aaAddress, projectId], () => {
    if (projectId && aaAddress) {
      return getInviteId(projectId, aaAddress);
    }
  });

  const inviteLink = `${window.origin}/p/${projectId}/join?invitation=${inviteId}`;

  const resetLink = async () => {
    if (projectId && aaAddress) {
      await postInvite({
        projectId,
        memberAddress: aaAddress,
        creationDate: 0, //ignored
      });

      refetchInvite();
    }
  };

  const content = (() => {
    if (aaAddress === undefined) return <AppConnect></AppConnect>;
    if (scan) {
      return (
        <Box fill style={{ maxWidth: '500px', margin: '0 auto' }}>
          <QrScanner onDecode={(result) => setResult(result)} onError={(error) => console.log(error?.message)} />
        </Box>
      );
    }
    if (showLink) {
      return (
        <Box align="center" style={{ flexShrink: 0 }}>
          <AppHeading level="3">Share to invite</AppHeading>

          <AppCard margin={{ vertical: 'small' }}>
            <Text>
              Share this link with the new member you want to invite. Once they fill in their details you can approve
              them here.
            </Text>
          </AppCard>

          <Box pad={{ vertical: 'medium' }}>
            <AppQRCode input={inviteLink}></AppQRCode>
          </Box>

          <Anchor href={inviteLink}>share link</Anchor>

          <Box direction="row" margin={{ vertical: 'large' }} gap="small">
            <AppButton onClick={() => setShowLink(false)} label="close" style={{ width: '200px' }}></AppButton>
            <AppButton onClick={() => resetLink()} label="reset link" style={{ width: '200px' }}></AppButton>
          </Box>
        </Box>
      );
    }

    return (
      <>
        <AppButton
          disabled={aaAddress === undefined || projectId === undefined}
          label={'show invitation link'}
          onClick={() => setShowLink(true)}
          primary
          margin={{ vertical: 'medium' }}></AppButton>
        <AppButton
          label={!scan ? 'scan member details' : 'cancel'}
          onClick={() => setScan(!scan)}
          style={{ marginBottom: '16px' }}></AppButton>
      </>
    );
  })();

  return (
    <ViewportPage>
      <Box align="center" pad={{ vertical: 'medium' }}>
        <AppHeading level="1">Invite new member</AppHeading>
      </Box>

      <Box fill pad={{ horizontal: 'large' }}>
        <>
          <Box style={{ margin: '36px 0px', flexShrink: 0 }}>
            <Text style={{ marginBottom: '16px' }}>Remember, this micro(r)evolution is for anyone who:</Text>
            <StatementEditable value={project?.whoStatement}></StatementEditable>
          </Box>
          {content}
        </>
      </Box>

      <AppBottomButton icon={<FormPrevious />} label="back" onClick={() => navigate('../members')}></AppBottomButton>
    </ViewportPage>
  );
};
