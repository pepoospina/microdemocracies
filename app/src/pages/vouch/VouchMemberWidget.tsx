import { Box, Anchor, Text } from 'grommet';
import { useEffect, useState } from 'react';

import { RouteNames } from '../../App';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { COMMUNITY_MEMBER } from '../../config/community';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { useMemberContext } from '../../contexts/MemberContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useVouch } from '../../contexts/VouchContext';
import { Entity, PAP, HexStr } from '../../types';
import { AppCard, AppButton } from '../../ui-components';
import { useAccountContext } from '../../wallet/AccountContext';
import { WaitingTransaction } from '../common/WaitingTransaction';
import { useNavigate } from 'react-router-dom';

export const VouchMemberWidget = (props: { pap: Entity<PAP> }) => {
  const { pap } = props;

  const navigate = useNavigate();
  const { isConnected } = useAccountContext();
  const { refetch: refetchRegistry } = useProjectContext();

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>();

  const { setVouchParams, sendVouch, isErrorSending, errorSending, isSuccess } = useVouch();

  const { account } = useConnectedMember();

  const {
    accountRead: vouchedAccount,
    tokenId: vouchedTokenId,
    setAddress: setVouchedAddress,
    refetch: refetchVouchedAccount,
  } = useMemberContext();

  useEffect(() => {
    setVouchParams(pap.object.account, pap.cid);
    setVouchedAddress(pap.object.account as HexStr);
  }, []);

  useEffect(() => {
    // console.log('useEffect isSuccess', { isSuccess });
    if (isSuccess) {
      setSending(false);
      setError(undefined);
      refetchVouchedAccount();
      refetchRegistry();
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
          <Text>Only existing {COMMUNITY_MEMBER}s can vouch.</Text>
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
      return <AppButton label="vouch" onClick={() => vouch()} disabled={!sendVouch && isConnected} primary></AppButton>;
    }

    return <AppConnectButton></AppConnectButton>;
  })();

  if (!alreadyVouched) {
    return vouchingStatus;
  }

  return (
    <Box>
      <AppCard>
        Entry already vouched as
        <Anchor
          onClick={() => {
            if (vouchedTokenId) {
              navigate(RouteNames.Member(vouchedTokenId));
            }
          }}>
          {COMMUNITY_MEMBER} #{vouchedTokenId}
        </Anchor>
      </AppCard>
    </Box>
  );
};
