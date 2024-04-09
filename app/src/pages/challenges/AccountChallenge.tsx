import { useEffect, useState } from 'react'

import { Box, BoxExtendedProps, Spinner, Text } from 'grommet'

import { AppConnectButton, AppConnectWidget } from '../../components/app/AppConnectButton'
import { useChallengeRead } from '../../contexts/ChallengeContextRead'
import { useChallengeWrite } from '../../contexts/ChallengeContextWrite'
import { useConnectedMember } from '../../contexts/ConnectedAccountContext'
import { AppAccount } from '../../types'
import { AppButton, AppCard, AppHeading, AppRemainingTime } from '../../ui-components'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { LoadingDiv } from '../../ui-components/LoadingDiv'
import { DateManager } from '../../utils/date.manager'
import { postAccountInvalidated } from '../../utils/project'
import { useAccountContext } from '../../wallet/AccountContext'
import { WaitingTransaction } from '../common/Loading'
import { ProgressBar } from './ProgressBar'

import { t } from 'i18next'

interface IAccountChallenge extends BoxExtendedProps {
  cardStyle?: React.CSSProperties
  account?: AppAccount
}

export const AccountChallenge = (props: IAccountChallenge) => {
  const { isConnected } = useAccountContext()
  const { tokenId } = useConnectedMember()

  const accountRead = props.account

  const { refetchChallenge, challengeRead, totalVoters } = useChallengeRead(
    accountRead?.tokenId,
  )

  const {
    sendChallenge,
    canVote,
    sendVote,
    myVote,
    isSending,
    isSuccess,
    isErrorChallenging,
    errorChallenging,
    isErrorVoting,
    errorVoting,
    events,
  } = useChallengeWrite(accountRead?.tokenId)

  const [error, setError] = useState<boolean>()

  /** when success challenge or vote, refetch */
  useEffect(() => {
    if (isSuccess) {
      refetchChallenge()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  /** when error stop sending and show the error */
  useEffect(() => {
    if (isErrorChallenging) {
      setError((errorChallenging as any).shortMessage)
    }
  }, [isErrorChallenging, errorChallenging])

  /** when error stop sending and show the error */
  useEffect(() => {
    if (isErrorVoting) {
      setError((errorVoting as any).shortMessage)
    }
  }, [isErrorVoting, errorVoting])

  /** trigger delete member if successful */
  useEffect(() => {
    if (isSuccess && events) {
      const allInvalidated = events.filter((e) => e.eventName === 'InvalidatedAccountEvent')
      allInvalidated.forEach((invalidated) => {
        postAccountInvalidated(Number((invalidated.args as any).tokenId))
      })
    }
  }, [isSuccess, events])

  const challenge = () => {
    if (sendChallenge) {
      sendChallenge()
    }
  }

  const challenged = challengeRead !== undefined && challengeRead !== null
  const canChallenge = sendChallenge !== undefined && accountRead?.valid

  /** Status managing */
  const date = new DateManager()
  const duration = challengeRead ? date.durationTo(challengeRead?.endDate) : undefined

  const ratio =
    challengeRead && challengeRead.nVoted > 0
      ? challengeRead.nFor / challengeRead.nVoted
      : 0
  const nVoted = challengeRead ? challengeRead.nVoted : undefined

  const challengeStatus = challengeRead ? (
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
              <AppRemainingTime
                remainingTime={duration}
                compactFormat
                suffix="left"
              ></AppRemainingTime>
            </>
          ) : (
            <></>
          )}
        </Box>

        <Box direction="row" align="center" justify="between">
          <Text>
            {nVoted !== undefined ? t('votedNofMEligible', { nVoted, totalVoters }) : ''}
          </Text>
        </Box>

        <Box>
          <ProgressBar label="voted to remove" ratio={ratio}></ProgressBar>
        </Box>
      </Box>
    )
  ) : (
    <></>
  )

  /** Voting management */
  const vote = (() => {
    if (!isConnected) {
      return (
        <AppConnectButton
          label="Connect and vote"
          style={{ margin: '16px 0 8px 0' }}
        ></AppConnectButton>
      )
    }

    /** loading canVote information */
    if (canVote === undefined) {
      return (
        <BoxCentered fill style={{ height: '100px' }}>
          <Spinner></Spinner>
        </BoxCentered>
      )
    }

    if (!canVote) {
      return (
        <Box style={{ marginTop: '16px' }}>
          <Text>
            {t('member')} #{tokenId} can't vote
          </Text>
        </Box>
      )
    }

    const alreadyVoted = myVote !== undefined

    return sendVote ? (
      <Box style={{ marginTop: '16px' }}>
        <AppHeading level="3">Vote now:</AppHeading>
        {!alreadyVoted ? (
          isSending ? (
            <WaitingTransaction></WaitingTransaction>
          ) : (
            <Box direction="row" style={{ margin: '8px 0' }} gap="16px">
              <AppButton
                style={{ width: '50%' }}
                label="Remove"
                onClick={() => sendVote(-1)}
              ></AppButton>
              <AppButton
                style={{ width: '50%' }}
                label="Keep"
                onClick={() => sendVote(1)}
              ></AppButton>
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
    )
  })()

  const challengedContent = (
    <>
      {challengeStatus}
      {vote}
    </>
  )

  const notChallengedContent = (
    <Box>
      <Text>
        {accountRead?.valid ? t('accountValidatedNotChallenged') : t('accountInvalidated')}.
      </Text>
      {error ? (
        <AppCard style={{ marginBottom: '16px', overflow: 'hidden' }}>
          <Text>{error}</Text>
        </AppCard>
      ) : (
        <></>
      )}
      <Box style={{ marginTop: '16px' }}>
        {!isConnected ? (
          <AppConnectWidget />
        ) : canChallenge ? (
          isSending ? (
            <WaitingTransaction></WaitingTransaction>
          ) : (
            <AppButton label={t('challenge')} onClick={() => challenge()}></AppButton>
          )
        ) : (
          <Text>{t('cantChallenge')}.</Text>
        )}
      </Box>
    </Box>
  )

  const content = (() => {
    if (accountRead === undefined || challengeRead === undefined) {
      return <LoadingDiv height="50px" width="100%"></LoadingDiv>
    }
    if (challenged) {
      return challengedContent
    }
    if (!challenged) {
      return notChallengedContent
    }
  })()

  /** already read the account and the account challenge data */
  return (
    <Box style={{ ...props.cardStyle, flexShrink: 0 }}>
      <>
        <AppHeading level="3">Account Status</AppHeading>
        <Box pad={{ vertical: 'small' }}>{content}</Box>
      </>
    </Box>
  )
}
