import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useConnectedMember } from '../../contexts/ConnectedAccountContext'
import { useLoadingContext } from '../../contexts/LoadingContext'
import { useMember } from '../../contexts/MemberContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useVouch } from '../../contexts/VouchContext'
import { AbsoluteRoutes } from '../../route.names'
import { Entity, PAP } from '../../types'
import { AppButton, AppCard } from '../../ui-components'
import { postDeleteApplication } from '../../utils/project'
import { useAccountContext } from '../../wallet/AccountContext'
import { WaitingTransaction } from '../common/Loading'
import { Anchor, Box, Text } from 'grommet'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

export const VouchMemberWidget = (props: { pap: Entity<PAP> }) => {
  const { projectId } = useParams()
  const { t } = useTranslation()
  const { pap } = props

  const navigate = useNavigate()
  const { isConnected } = useAccountContext()
  const { refetch: refetchRegistry, refetchApplications } = useProjectContext()

  const [sending, setSending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>()

  const { setVouchParams, sendVouch, isErrorSending, errorSending, isSuccess } = useVouch()

  const { account } = useConnectedMember()
  const { setLoading, setLoadingTimeout, setTitle: setTitleToLoading, setSubtitle } = useLoadingContext()

  const {
    account: vouchedAccount,
    tokenId: vouchedTokenId,
    refetch: refetchVouchedAccount,
  } = useMember({ address: pap.object.account })

  useEffect(() => {
    setVouchParams(pap.object.account, pap.cid)
  }, [])

  const deleteApplication = () => {
    /** delete applications and update */
    postDeleteApplication(pap.object.account).then(() => {
      refetchApplications()
      refetchRegistry()
    })
  }

  useEffect(() => {
    if (isSuccess) {
      setLoading(false)
      setLoadingTimeout(false)
      setSending(false)
      setError(undefined)
      deleteApplication()
      refetchVouchedAccount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (isErrorSending) {
      setSending(false)
      setError((errorSending as any).shortMessage)
    }
  }, [isErrorSending, errorSending])

  const vouch = () => {
    if (sendVouch) {
      setError(undefined)
      setSending(true)
      setLoading(true)
      setTitleToLoading(t('approvingNewMember'))
      setSubtitle(t('preparingData'))
      sendVouch()
    }
  }

  const alreadyVouched = vouchedAccount && vouchedAccount.valid

  const vouchingStatus = (() => {
    if (isConnected && (!account || !account.valid)) {
      return (
        <AppCard style={{ marginBottom: '16px' }}>
          <Text>{t('onlyMembersCanInvite')}.</Text>
        </AppCard>
      )
    }
    if (error) {
      return (
        <AppCard style={{ marginBottom: '16px' }}>
          <Text>{error}</Text>
        </AppCard>
      )
    }
    if (sending) {
      return <WaitingTransaction></WaitingTransaction>
    }
    if (isConnected) {
      return <AppButton label="accept" onClick={() => vouch()} disabled={!sendVouch && isConnected} primary></AppButton>
    }

    return <AppConnectButton></AppConnectButton>
  })()

  if (!alreadyVouched) {
    return vouchingStatus
  }

  return (
    <Box>
      <AppCard>
        <Text>
          {t('applicationAcceptedAs')}{' '}
          <Anchor
            onClick={() => {
              if (vouchedTokenId && projectId) {
                navigate(AbsoluteRoutes.ProjectMember(projectId, vouchedTokenId.toString()))
              }
            }}
          >
            {t('member')} #{vouchedTokenId}
          </Anchor>
        </Text>
      </AppCard>
    </Box>
  )
}
