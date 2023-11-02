import { Box, Spinner, Text } from 'grommet';
import { AppButton, AppHeading } from '../../ui-components';
import { useCurrentChallenge } from '../../contexts/CurrentChallengeContext';
import { useRegistry } from '../../contexts/RegistryContext';
import { AppConnect } from '../../components/app/AppConnect';
import { useConnectedAccount } from '../../contexts/ConnectedAccountContext';
import { useEffect, useState } from 'react';
import { WaitingTransaction } from '../common/WaitingTransaction';
import { COMMUNITY_MEMBER } from '../../config/community';

export const ChallengeVote = () => {
  const {
    sendVoteRemove,
    sendVoteKeep,
    canVote,
    myVote,
    isSuccessVote,
    isErrorSendingVote,
    errorSendingVote,
    refetchChallenge,
  } = useCurrentChallenge();

  const [sending, setSending] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<boolean>();

  const { tokenId } = useConnectedAccount();
  const { isConnected } = useRegistry();
  const alreadyVoted = myVote !== undefined;

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

  if (!isConnected) {
    return <AppConnect label="Connect and vote" style={{ margin: '16px 0 8px 0' }}></AppConnect>;
  }

  /** loading canVote information */
  if (canVote === undefined) {
    return (
      <Box fill align="center" justify="center" style={{ height: '100px' }}>
        <Spinner></Spinner>
      </Box>
    );
  }

  if (!canVote) {
    return (
      <Box style={{ marginTop: '16px' }}>
        <Text>
          {COMMUNITY_MEMBER} #{tokenId} can't vote
        </Text>
      </Box>
    );
  }

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
    <Box fill align="center" justify="center">
      <Spinner></Spinner>
    </Box>
  );
};
