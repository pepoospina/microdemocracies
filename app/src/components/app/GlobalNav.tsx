import { Anchor, Box, Text } from 'grommet'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'

import { useServiceWorker } from '../../contexts/ServiceWorkerContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { AppButton } from '../../ui-components'
import { SetPageTitleType } from './AppContainer'
import { ConnectedUser } from './ConnectedUser'

export const GlobalNav = (props: { title?: SetPageTitleType }) => {
  const navigate = useNavigate()
  const { hasUpdate, needsInstall, updateApp, install } = useServiceWorker()

  const title = (() => {
    return (
      <Box>
        <Box>
          <Text size="small">{props.title?.prefix}</Text>
        </Box>
        <Box>
          <Text size="large" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {props.title?.main}
          </Text>
        </Box>
      </Box>
    )
  })()

  const updater = (() => {
    if (hasUpdate) {
      return (
        <Box direction="row" align="center" gap="4px">
          <Text style={{ fontSize: '14px' }}>{t(I18Keys.updateAvailable)}</Text>
          <Anchor onClick={() => updateApp()}>
            <Text style={{ fontSize: '14px' }}>{t(I18Keys.updateNow)}</Text>
          </Anchor>
        </Box>
      )
    }
    return <></>
  })()

  const installer = (() => {
    if (needsInstall) {
      return (
        <Box direction="row" align="center" gap="4px">
          <Text style={{ fontSize: '14px' }}>{t(I18Keys.installPrompt)}</Text>
          <Anchor onClick={() => install()}>
            <Text style={{ fontSize: '14px' }}>{t(I18Keys.installNow)}</Text>
          </Anchor>
        </Box>
      )
    }
    return <></>
  })()

  const titleClicked = () => {
    navigate(AbsoluteRoutes.App)
  }

  return (
    <>
      {installer}
      {updater}
      <Box direction="row" justify="between" align="center">
        <AppButton plain onClick={() => titleClicked()}>
          {title}
        </AppButton>
        <ConnectedUser></ConnectedUser>
      </Box>
    </>
  )
}
