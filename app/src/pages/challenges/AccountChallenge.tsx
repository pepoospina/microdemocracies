import { Box, BoxExtendedProps, Spinner, Text } from 'grommet';

import { useChallenge } from '../../contexts/CurrentChallengeContext';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { AppButton, AppCard, AppHeading, AppRemainingTime } from '../../ui-components';

import { useEffect, useState } from 'react';
import { WaitingTransaction } from '../common/Loading';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppAccount } from '../../types';
import { DateManager } from '../../utils/date.manager';
import { ProgressBar } from './ProgressBar';
import { t } from 'i18next';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';

interface IAccountChallenge extends BoxExtendedProps {
  cardStyle?: React.CSSProperties;
  account?: AppAccount;
}

export const AccountChallenge = (props: IAccountChallenge) => {
  const { isConnected } = useAccountContext();
  const { tokenId } = useConnectedMember();

  const accountRead = props.account;

  const {
    refetchChallenge,
    sendChallenge,
    challengeRead,
    isErrorSending,
    errorSending,
    isSuccess,
    isSuccessVote,
    isErrorSendingVote,
    errorSendingVote,
    totalVoters,
    sendVoteRemove,
    sendVoteKeep,
    canVote,
    myVote,
  } = useChallenge(accountRead?.tokenId);

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

  /** when success, reset errors and refetch */
  useEffect(() => {
    if (isSuccessVote) {
      setSending(false);
      setError(undefined);
      refetchChallenge();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessVote]);

  /** when error stop sending and show the error */
  useEffect(() => {
    if (isErrorSendingVote) {
      setSending(false);
      setError((errorSendingVote as any).shortMessage);
    }
  }, [isErrorSendingVote, errorSendingVote]);

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

  /** Status managing */
  const date = new DateManager();
  const duration = challengeRead ? date.durationTo(challengeRead?.endDate) : undefined;

  const ratio = challengeRead && challengeRead.nVoted > 0 ? challengeRead.nFor / challengeRead.nVoted : 0;
  const nVoted = challengeRead ? challengeRead.nVoted : undefined;

  const status = challengeRead ? (
    challengeRead.executed ? (
      <Box>
        <Text>Challenged process done</Text>
      </Box>
    ) : (
      <Box style={{ flexShrink: 0 }}>
        <Box direction="row" align="center" justify="between">
          <Text>Account challenged! </Text>
          {duration ? (
            <>
              <AppRemainingTime remainingTime={duration} compactFormat suffix="left"></AppRemainingTime>
            </>
          ) : (
            <></>
          )}
        </Box>

        <Box direction="row" align="center" justify="between">
          <Text>Can vote: {totalVoters}</Text>
          <Text>{nVoted !== undefined ? `Voted: ${nVoted}` : ''}</Text>
        </Box>

        <Box>
          <ProgressBar label="voted to remove" ratio={ratio}></ProgressBar>
        </Box>
      </Box>
    )
  ) : (
    <></>
  );

  /** Voting management */
  const vote = (() => {
    if (!isConnected) {
      return <AppConnectButton label="Connect and vote" style={{ margin: '16px 0 8px 0' }}></AppConnectButton>;
    }

    /** loading canVote information */
    if (canVote === undefined) {
      return (
        <BoxCentered fill style={{ height: '100px' }}>
          <Spinner></Spinner>
        </BoxCentered>
      );
    }

    if (!canVote) {
      return (
        <Box style={{ marginTop: '16px' }}>
          <Text>
            {t('member')} #{tokenId} can't vote
          </Text>
        </Box>
      );
    }

    const alreadyVoted = myVote !== undefined;

    return sendVoteRemove && sendVoteKeep ? (
      <Box style={{ marginTop: '16px' }}>
        <AppHeading level="3">Vote now:</AppHeading>
        {!alreadyVoted ? (
          sending ? (
            <WaitingTransaction></WaitingTransaction>
          ) : (
            <Box direction="row" style={{ margin: '8px 0' }} gap="16px">
              <AppButton style={{ width: '50%' }} label="Remove" onClick={() => sendVoteRemove()}></AppButton>
              <AppButton style={{ width: '50%' }} label="Keep" onClick={() => sendVoteKeep()}></AppButton>
            </Box>
          )
        ) : (
          <Box direction="row" style={{ margin: '8px 0' }} gap="16px">
            <Text>You already voted</Text>
          </Box>
        )}
      </Box>
    ) : (
      <BoxCentered fill>
        <Spinner></Spinner>
      </BoxCentered>
    );
  })();

  /** already read the account and the account challenge data */
  return (
    <AppCard style={{ ...props.cardStyle, flexShrink: 0 }}>
      {challenged ? (
        <>
          {status}
          {vote}
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
