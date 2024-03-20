import { Box, Text } from 'grommet'
import { UserExpert } from 'grommet-icons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CHAIN_ID } from '../../config/appConfig'
import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { LanguageSelector } from '../../pages/account/LanguageSelector'
import { Loading } from '../../pages/common/Loading'
import { Address, AppButton, AppCircleDropButton } from '../../ui-components'
import { cap } from '../../utils/general'
import { useAccountContext } from '../../wallet/AccountContext'
import { AppConnectButton } from './AppConnectButton'
import { useThemeContext } from './ThemedApp'

export const ConnectedUser = (props: {}) => {
  const { t } = useTranslation()
  const { aaAddress, isConnected, owner } = useAccountContext()
  const { isCreatingPublicId, disconnect } = useSemaphoreContext()
  const { constants } = useThemeContext()

  const [showDrop, setShowDrop] = useState<boolean>(false)

  const content = (() => {
    if (!isConnected) {
      return <AppConnectButton style={{ fontSize: '16px', padding: '6px 8px' }}></AppConnectButton>
    }

    if (!aaAddress || isCreatingPublicId) {
      return <Loading></Loading>
    }

    return (
      <AppCircleDropButton
        plain
        label={<UserExpert color={constants.colors.primary} style={{ margin: '2px 0px 0px 5px' }}></UserExpert>}
        open={showDrop}
        onClose={() => setShowDrop(false)}
        onOpen={() => setShowDrop(true)}
        dropContent={
          <Box pad="20px" gap="small">
            <Box margin={{ bottom: 'small' }}>
              <Text>{cap(t('connectedAs'))}</Text>
              <Address address={owner} chainId={CHAIN_ID}></Address>
            </Box>
            <Box margin={{ bottom: 'small' }}>
              <Text margin={{ bottom: '3px' }}>{cap(t('language'))}</Text>
              <LanguageSelector></LanguageSelector>
            </Box>

            <AppButton plain onClick={() => disconnect()} style={{ textTransform: 'none', paddingTop: '6px' }}>
              <Text style={{ fontWeight: 'bold' }}>{cap(t('logout'))}</Text>
            </AppButton>
          </Box>
        }
        dropProps={{ style: { marginTop: '60px' } }}
      ></AppCircleDropButton>
    )
  })()

  return (
    <Box style={{ width: '84px', height: '60px' }} align="center" justify="center">
      {content}
    </Box>
  )
}
