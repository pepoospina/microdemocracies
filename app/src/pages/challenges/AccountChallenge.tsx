import { Box, BoxExtendedProps, Spinner, Text } from 'grommet';

import { useCurrentChallenge } from '../../contexts/CurrentChallengeContext';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { AppButton, AppCard } from '../../ui-components';

import { ChallengeStatus } from '../challenges/ChallengeStatus';
import { ChallengeVote } from '../challenges/ChallengeVote';
import { useEffect, useState } from 'react';
import { WaitingTransaction } from '../common/Loading';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { useMember } from '../../contexts/MemberContext';
import { useAccountContext } from '../../wallet/AccountContext';

interface IAccountChallenge extends BoxExtendedProps {
  cardStyle?: React.CSSProperties;
}

export const AccountChallenge = (props: IAccountChallenge) => {
  const { isConnected } = useAccountContext();
  const { accountRead } = useMember();
  const { refetchChallenge, sendChallenge, challengeRead, isErrorSending, errorSending, isSuccess } =
    useCurrentChallenge();

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>();

  /** when success, reset errors and refetch */
  useEffect(() => {
    if (isSuccess) {
      setSending(false);
      setError(undefined);
      refetchChallenge();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  /** when error stop sending and show the error */
  useEffect(() => {
    if (isErrorSending) {
      setSending(false);
      setError((errorSending as any).shortMessage);
    }
  }, [isErrorSending, errorSending]);

  const challenge = () => {
    if (sendChallenge) {
      setSending(true);
      sendChallenge().then((result) => console.log(result));
    }
  };

  const challenged = challengeRead !== undefined && challengeRead !== null;
  const canChallenge = sendChallenge !== undefined;

  /** loading */
  if (accountRead === undefined || challengeRead === undefined) {
    return (
      <BoxCentered fill>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  /** loading */
  if (accountRead && !accountRead.valid) {
    return <></>;
  }

  /** already read the account and the account challenge data */
  return (
    <AppCard style={{ ...props.cardStyle, flexShrink: 0 }}>
      {challenged ? (
        <>
          <ChallengeStatus></ChallengeStatus>
          <ChallengeVote></ChallengeVote>
        </>
      ) : (
        <Box>
          <Text>Account not currently challenged</Text>
          {error ? (
            <AppCard style={{ marginBottom: '16px' }}>
              <Text>{error}</Text>
            </AppCard>
          ) : (
            <></>
          )}
          <Box style={{ marginTop: '16px' }}>
            {!isConnected ? (
              <AppConnectButton label="Connect to Challenge" />
            ) : canChallenge ? (
              sending ? (
                <WaitingTransaction></WaitingTransaction>
              ) : (
                <AppButton label="challenge" onClick={() => challenge()}></AppButton>
              )
            ) : (
              <Text>Cant challenge</Text>
            )}
          </Box>
        </Box>
      )}
    </AppCard>
  );
};
