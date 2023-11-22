import { Anchor, Box, Spinner, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { getEntity } from '../../utils/store';
import { Entity, HexStr, PAP } from '../../types';
import { AppButton, AppCard } from '../../ui-components';
import { RouteNames } from '../../App';
import { useMemberContext } from '../../contexts/MemberContext';
import { useVouch } from '../../contexts/VouchContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { AccountPerson } from '../account/AccountPerson';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { AppBottomButton } from '../common/BottomButtons';
import { WaitingTransaction } from '../common/WaitingTransaction';
import { COMMUNITY_MEMBER } from '../../config/community';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppConnectButton } from '../../components/app/AppConnectButton';

export const InviteAccount = () => {
  const navigate = useNavigate();
  const { hash } = useParams();
  const { isConnected } = useAccountContext();

  const { refetch: refetchRegistry, goHome } = useProjectContext();

  const [pap, setPap] = useState<Entity<PAP>>();
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>();

  const { setVouchParams, sendVouch, isErrorSending, errorSending, isSuccess } = useVouch();

  const {
    accountRead: vouchedAccount,
    tokenId: vouchedTokenId,
    setAddress: setVouchedAddress,
    refetch: refetchVouchedAccount,
  } = useMemberContext();

  const { account } = useConnectedMember();

  // console.log({ isErrorSending, errorSending, isSuccess, vouchedTokenId, vouchedAccount });

  useEffect(() => {
    if (hash) {
      getEntity<PAP>(hash).then((pap) => {
        setPap(pap);
        setVouchParams(pap.object.account, pap.cid);
        setVouchedAddress(pap.object.account as HexStr);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <AppScreen label="Vouch for New Member">
      <Box pad="large" fill>
        {pap ? (
          <Box>
            <AccountPerson pap={pap.object} cardStyle={{ marginBottom: '32px' }}></AccountPerson>
            {!alreadyVouched ? (
              <>
                {isConnected && (!account || !account.valid) ? (
                  <AppCard style={{ marginBottom: '16px' }}>
                    <Text>Only existing {COMMUNITY_MEMBER}s can vouch.</Text>
                  </AppCard>
                ) : (
                  <></>
                )}
                {error ? (
                  <AppCard style={{ marginBottom: '16px' }}>
                    <Text>{error}</Text>
                  </AppCard>
                ) : (
                  <></>
                )}
                {sending ? (
                  <WaitingTransaction></WaitingTransaction>
                ) : isConnected ? (
                  <AppButton
                    label="vouch"
                    onClick={() => vouch()}
                    disabled={!sendVouch && isConnected}
                    primary></AppButton>
                ) : (
                  <AppConnectButton></AppConnectButton>
                )}
              </>
            ) : (
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
            )}
          </Box>
        ) : (
          <Box fill align="center" justify="center">
            <Spinner></Spinner>
          </Box>
        )}
      </Box>
      <AppBottomButton icon={<FormPrevious />} label="home" onClick={goHome}></AppBottomButton>
    </AppScreen>
  );
};
