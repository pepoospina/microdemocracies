import { Box, Text } from 'grommet';
import { useCurrentChallenge } from '../../contexts/CurrentChallengeContext';
import { AppRemainingTime } from '../../ui-components';
import { DateManager } from '../../utils/date.manager';
import { ProgressBar } from './ProgressBar';

export const ChallengeStatus = () => {
  const { challengeRead, totalVoters } = useCurrentChallenge();

  const date = new DateManager();
  const duration = challengeRead ? date.durationTo(challengeRead?.endDate) : undefined;

  const ratio = challengeRead && challengeRead.nVoted > 0 ? challengeRead.nFor / challengeRead.nVoted : 0;
  const nVoted = challengeRead ? challengeRead.nVoted : undefined;

  return challengeRead ? (
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
};
