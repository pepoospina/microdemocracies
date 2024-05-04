import { QrScanner } from '@yudiel/react-qr-scanner'
import { Box, Text } from 'grommet'
import { Camera, FormPrevious, Send, Square, StatusGood } from 'grommet-icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppQRCode } from '../../components/AppQRCode'
import { AppConnectButton } from '../../components/app/AppConnectButton'
import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes, RouteNames } from '../../route.names'
import { AppButton, AppCard, AppHeading } from '../../ui-components'
import { useCopyToClipboard } from '../../utils/copy.clipboard'
import { cap } from '../../utils/general'
import { useAccountContext } from '../../wallet/AccountContext'
import { AppBottomButton } from '../common/BottomButtons'
import { StatementEditable } from '../voice/StatementEditable'
import { ApplicationCard } from '../vouches/ApplicationCard'

export const InvitePage = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const { project, projectId, inviteId, resetLink, applications, resettingLink } =
    useProjectContext()
  const { aaAddress } = useAccountContext()
  const { copy, copied } = useCopyToClipboard()

  const navigate = useNavigate()

  const { setTitle } = useAppContainer()

  useEffect(() => {
    setTitle({ prefix: cap(t([I18Keys.inviteNew])), main: t([I18Keys.members]) })
  }, [i18n.language])

  const [showLink, setShowLink] = useState<boolean>(false)
  const [scan, setScan] = useState<boolean>(false)

  const setResult = (cid: string) => {
    navigate(RouteNames.InviteAccount(cid))
  }

  const inviteLink = `${window.origin}/p/${projectId}/join?invitation=${inviteId}`

  const share = () => {
    if (navigator.share) {
      navigator.share({
        url: inviteLink,
        text: t([I18Keys.joinOurMsg]),
      })
    } else {
      copy(inviteLink)
    }
  }

  const content = (() => {
    if (aaAddress === undefined) return <AppConnectButton></AppConnectButton>

    if (showLink) {
      return (
        <Box align="center" style={{ flexShrink: 0 }}>
          <Box pad={{ vertical: 'large' }} style={{ width: '100%' }}>
            <AppButton
              onClick={() => setShowLink(false)}
              label={t([I18Keys.close])}
            ></AppButton>
          </Box>

          <AppHeading level="3">{t([I18Keys.shareToInvite])}</AppHeading>

          <Box pad={{ vertical: 'medium' }}>
            <AppQRCode input={inviteLink}></AppQRCode>
          </Box>
        </Box>
      )
    }

    if (scan) {
      return (
        <Box fill style={{ maxWidth: '500px', margin: '0 auto', flexShrink: 0 }}>
          <Box pad={{ vertical: 'large' }}>
            <AppButton onClick={() => setScan(false)} label="close"></AppButton>
          </Box>
          <QrScanner
            onDecode={(result) => setResult(result)}
            onError={(error) => console.log(error?.message)}
          />
        </Box>
      )
    }

    return (
      <Box style={{ flexShrink: 0 }}>
        <AppCard margin={{ bottom: 'medium' }}>
          <Text>{t([I18Keys.shareLinkMsg])}</Text>
        </AppCard>
        <AppButton
          reverse
          icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
          disabled={inviteId === undefined}
          label={copied ? t([I18Keys.linkCopied]) : t([I18Keys.shareLink])}
          primary
          onClick={() => share()}
        ></AppButton>

        <Box pad={{ vertical: 'medium' }} gap="small">
          {applications?.map((application) => {
            return (
              <Box>
                <ApplicationCard application={application}></ApplicationCard>
              </Box>
            )
          })}
        </Box>

        <AppHeading level="3" style={{ marginTop: '64px' }}>
          {t([I18Keys.orUseQR])}
        </AppHeading>
        <AppButton
          reverse
          icon={<Square color="black"></Square>}
          disabled={aaAddress === undefined || projectId === undefined}
          label={t([I18Keys.showQr])}
          onClick={() => setShowLink(true)}
          margin={{ vertical: 'medium' }}
        ></AppButton>
        <AppButton
          reverse
          icon={<Camera></Camera>}
          label={!scan ? t([I18Keys.scanQr]) : t([I18Keys.cancel])}
          onClick={() => setScan(!scan)}
          style={{ marginBottom: '16px' }}
        ></AppButton>

        <AppHeading level="3" style={{ marginTop: '24px' }}>
          {t([I18Keys.resetLink])}
        </AppHeading>
        <Box>
          <AppCard margin={{ vertical: 'medium' }}>
            <Text>{t([I18Keys.resettingMsg])}</Text>
          </AppCard>
          <AppButton
            margin={{ bottom: 'large' }}
            onClick={() => resetLink()}
            label={resettingLink ? t([I18Keys.resetting]) : t([I18Keys.reset])}
            disabled={resettingLink}
          ></AppButton>
        </Box>
      </Box>
    )
  })()

  return (
    <ViewportPage
      content={
        <Box fill pad={{ horizontal: 'large' }}>
          <Box style={{ flexShrink: 0 }} margin={{ bottom: 'large' }}>
            <Box>
              <Text style={{ marginBottom: '16px' }}>
                {t([I18Keys.rememberInviteMsg])}:
              </Text>
              <StatementEditable value={project?.whoStatement}></StatementEditable>
            </Box>
          </Box>

          {content}
        </Box>
      }
      nav={
        <AppBottomButton
          icon={<FormPrevious />}
          label={t([I18Keys.projectMembers])}
          onClick={() =>
            navigate(AbsoluteRoutes.ProjectMembers((projectId as number).toString()))
          }
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
