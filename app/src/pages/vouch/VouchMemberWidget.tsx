import { Anchor, Box, Text } from 'grommet'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useConnectedMember } from '../../contexts/ConnectedAccountContext'
import { useLoadingContext } from '../../contexts/LoadingContext'
import { useMember } from '../../contexts/MemberContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { useToast } from '../../contexts/ToastsContext'
import { useVouch } from '../../contexts/VouchContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { Entity, PAP } from '../../shared/types'
import { AppButton, AppCard } from '../../ui-components'
import { postDeleteApplication } from '../../utils/project'
import { useAccountContext } from '../../wallet/AccountContext'
import { WaitingTransaction } from '../common/Loading'

export const VouchMemberWidget = (props: { pap: Entity<PAP> }) => {
  const { projectId } = useProjectContext()
  const { t } = useTranslation()
  const { pap } = props

  const navigate = useNavigate()
  const { error: errorWithAccount } = useAccountContext()
  const { isConnected } = useSemaphoreContext()
  const { refetch: refetchRegistry, refetchApplications } = useProjectContext()

  const [sending, setSending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>()

  const { setVouchParams, sendVouch, isErrorSending, errorSending, isSuccess } = useVouch()

  const { account } = useConnectedMember()
  const {
    setLoading,
    setExpectedLoadingTime,
    setTitle: setTitleToLoading,
    setSubtitle,
  } = useLoadingContext()

  const { show } = useToast()

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
    if (projectId) {
      postDeleteApplication(projectId, pap.object.account).then(() => {
        refetchApplications()
        refetchRegistry()
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setLoading(false)
      setSending(false)
      setError(undefined)
      deleteApplication()
      refetchVouchedAccount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    if (errorSending) {
      show({ title: 'Error', message: errorSending.message })
    }
  }, [errorSending, isErrorSending])

  useEffect(() => {
    if (errorWithAccount) {
      show({ title: 'Error', message: errorWithAccount.message })
    }
  }, [errorWithAccount])

  const vouch = () => {
    if (sendVouch) {
      setError(undefined)
      setSending(true)
      setLoading(true)
      setExpectedLoadingTime(15000)
      setTitleToLoading(t([I18Keys.approvingNewMember]))
      setSubtitle(t([I18Keys.preparingData]))
      sendVouch()
    }
  }

  const alreadyVouched = vouchedAccount && vouchedAccount.valid

  const vouchingStatus = (() => {
    if (isConnected && (!account || !account.valid)) {
      return (
        <AppCard style={{ marginBottom: '16px' }}>
          <Text>{t([I18Keys.onlyMembersCanInvite])}.</Text>
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
      return (
        <AppButton
          label="accept"
          onClick={() => vouch()}
          disabled={!sendVouch && isConnected}
          primary
        ></AppButton>
      )
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
          {t([I18Keys.applicationAcceptedAs])}{' '}
          <Anchor
            onClick={() => {
              if (vouchedTokenId && projectId) {
                navigate(
                  AbsoluteRoutes.ProjectMember(
                    projectId.toString(),
                    vouchedTokenId.toString(),
                  ),
                )
              }
            }}
          >
            {t([I18Keys.member])} #{vouchedTokenId}
          </Anchor>
        </Text>
      </AppCard>
    </Box>
  )
}
