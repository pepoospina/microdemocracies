import { Box, Text } from 'grommet';
import { Camera, FormPrevious, Send, Square, StatusGood } from 'grommet-icons';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AppButton, AppCard, AppHeading } from '../../ui-components';
import { RouteNames } from '../../route.names';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppQRCode } from '../../components/AppQRCode';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { ViewportPage } from '../../components/app/Viewport';
import { AppBottomButton } from '../common/BottomButtons';
import { StatementEditable } from '../voice/StatementEditable';
import { ApplicationCard } from '../vouches/ApplicationCard';
import { useCopyToClipboard } from '../../utils/copy.clipboard';
import { useAppContainer } from '../../components/app/AppContainer';
import { cap } from '../../utils/general';

export const InvitePage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const { project, projectId, inviteId, resetLink, applications, resettingLink } = useProjectContext();
  const { aaAddress } = useAccountContext();
  const { copy, copied } = useCopyToClipboard();

  const navigate = useNavigate();

  const { setTitle } = useAppContainer();

  useEffect(() => {
    setTitle({ prefix: cap(t('inviteNew')), main: t('members') });
  }, [i18n.language]);

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
        text: t('joinOurMsg'),
      });
    } else {
      copy(inviteLink);
    }
  };

  const content = (() => {
    if (aaAddress === undefined) return <AppConnectButton></AppConnectButton>;

    if (showLink) {
      return (
        <Box align="center" style={{ flexShrink: 0 }}>
          <Box pad={{ vertical: 'large' }} style={{ width: '100%' }}>
            <AppButton onClick={() => setShowLink(false)} label={t('close')}></AppButton>
          </Box>

          <AppHeading level="3">{t('shareToInvite')}</AppHeading>

          <Box pad={{ vertical: 'medium' }}>
            <AppQRCode input={inviteLink}></AppQRCode>
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
          <Text>{t('shareLinkMsg')}.</Text>
        </AppCard>
        <AppButton
          reverse
          icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
          disabled={inviteId === undefined}
          label={copied ? t('linkCopied') : t('shareLink')}
          primary
          onClick={() => share()}></AppButton>

        <AppHeading level="3" style={{ marginTop: '24px' }}>
          {t('orUseQR')}
        </AppHeading>
        <AppButton
          reverse
          icon={<Square color="black"></Square>}
          disabled={aaAddress === undefined || projectId === undefined}
          label={t('showQr')}
          onClick={() => setShowLink(true)}
          margin={{ vertical: 'medium' }}></AppButton>
        <AppButton
          reverse
          icon={<Camera></Camera>}
          label={!scan ? t('scanQr') : t('cancel')}
          onClick={() => setScan(!scan)}
          style={{ marginBottom: '16px' }}></AppButton>

        <AppHeading level="3" style={{ marginTop: '24px' }}>
          {t('resetLink')}
        </AppHeading>
        <Box>
          <AppCard margin={{ vertical: 'medium' }}>
            <Text>{t('resettingMsg')}</Text>
          </AppCard>
          <AppButton
            margin={{ bottom: 'large' }}
            onClick={() => resetLink()}
            label={resettingLink ? t('resetting') : t('reset')}
            disabled={resettingLink}></AppButton>
        </Box>
      </Box>
    );
  })();

  return (
    <ViewportPage
      content={
        <Box fill pad={{ horizontal: 'large' }}>
          <Box style={{ flexShrink: 0 }}>
            <Box style={{ margin: '36px 0px' }}>
              <Text style={{ marginBottom: '16px' }}>{t('rememberInviteMsg')}:</Text>
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
      }
      nav={
        <AppBottomButton icon={<FormPrevious />} label={t('back')} onClick={() => navigate(-1)}></AppBottomButton>
      }></ViewportPage>
  );
};
