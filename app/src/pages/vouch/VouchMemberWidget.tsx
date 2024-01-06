import { Box, Anchor, Text } from 'grommet';
import { useEffect, useState } from 'react';

import { RouteNames } from '../../App';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useVouch } from '../../contexts/VouchContext';
import { Entity, PAP } from '../../types';
import { AppCard, AppButton } from '../../ui-components';
import { useAccountContext } from '../../wallet/AccountContext';
import { WaitingTransaction } from '../common/Loading';
import { useNavigate } from 'react-router-dom';
import { postDeleteApplication } from '../../utils/project';
import { useTranslation } from 'react-i18next';

export const VouchMemberWidget = (props: { pap: Entity<PAP> }) => {
  const { t } = useTranslation();
  const { pap } = props;

  const navigate = useNavigate();
  const { isConnected } = useAccountContext();
  const { refetch: refetchRegistry, refetchApplications } = useProjectContext();

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>();

  const { setVouchParams, sendVouch, isErrorSending, errorSending, isSuccess } = useVouch();

  const { account } = useConnectedMember();

  const { accountRead: vouchedAccount, tokenId: vouchedTokenId, refetch: refetchVouchedAccount } = useMemberContext();

  useEffect(() => {
    setVouchParams(pap.object.account, pap.cid);
  }, []);

  const deleteApplication = () => {
    /** delete applications and update */
    postDeleteApplication(pap.object.account).then(() => {
      refetchApplications();
      refetchRegistry();
    });
  };

  useEffect(() => {
    // console.log('useEffect isSuccess', { isSuccess });
    if (isSuccess) {
      setSending(false);
      setError(undefined);
      deleteApplication();
      refetchVouchedAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    // console.log('useEffect isErrorSending', { isErrorSending, errorSending });
    if (isErrorSending) {
      setSending(false);
      setError((errorSending as any).shortMessage);
    }
  }, [isErrorSending, errorSending]);

  const vouch = () => {
    if (sendVouch) {
      setError(undefined);
      setSending(true);
      sendVouch();
    }
  };

  const alreadyVouched = vouchedAccount && vouchedAccount.valid;

  const vouchingStatus = (() => {
    if (isConnected && (!account || !account.valid)) {
      return (
        <AppCard style={{ marginBottom: '16px' }}>
          <Text>{t('onlyMembersCanInvite')}.</Text>
        </AppCard>
      );
    }
    if (error) {
      return (
        <AppCard style={{ marginBottom: '16px' }}>
          <Text>{error}</Text>
        </AppCard>
      );
    }
    if (sending) {
      return <WaitingTransaction></WaitingTransaction>;
    }
    if (isConnected) {
      return (
        <AppButton label="accept" onClick={() => vouch()} disabled={!sendVouch && isConnected} primary></AppButton>
      );
    }

    return <AppConnectButton></AppConnectButton>;
  })();

  if (!alreadyVouched) {
    return vouchingStatus;
  }

  return (
    <Box>
      <AppCard>
        <Text>
          Application already accepted as{' '}
          <Anchor
            onClick={() => {
              if (vouchedTokenId) {
                navigate(`../${RouteNames.Member(vouchedTokenId)}`);
              }
            }}>
            {t('member')} #{vouchedTokenId}
          </Anchor>
        </Text>
      </AppCard>
    </Box>
  );
};
