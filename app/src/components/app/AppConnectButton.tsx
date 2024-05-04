import { BoxExtendedProps } from 'grommet'
import { StatusGood } from 'grommet-icons'
import { useTranslation } from 'react-i18next'

import { useSemaphoreContext } from '../../contexts/SemaphoreContext'
import { I18Keys } from '../../i18n/kyel.list'
import { Loading } from '../../pages/common/Loading'
import { AppButton, AppHeading } from '../../ui-components'
import { useAccountContext } from '../../wallet/AccountContext'
import { useAppSigner } from '../../wallet/SignerContext'

export const AppConnectButton = (props: { label?: string } & BoxExtendedProps) => {
  const { t } = useTranslation()
  const { connect } = useAppSigner()

  return (
    <AppButton
      style={{ ...props.style }}
      onClick={() => connect()}
      label={t([I18Keys.connectWalletBtn])}
    ></AppButton>
  )
}

export const AppConnectWidget = () => {
  const { t } = useTranslation()

  const { isConnecting } = useAppSigner()
  const { aaAddress } = useAccountContext()
  const { publicId, isConnected } = useSemaphoreContext()

  const isFullyConnected = isConnected && publicId !== undefined && aaAddress !== undefined
  const isLoading = isConnecting || (aaAddress && !isFullyConnected)

  if (!isFullyConnected) {
    return (
      <>
        <AppHeading level="3" style={{ marginBottom: '18px' }}>
          {t([I18Keys.connectAccount])}
        </AppHeading>
        {isLoading ? <Loading></Loading> : <AppConnectButton></AppConnectButton>}
      </>
    )
  }

  return (
    <>
      <AppHeading level="3" style={{ marginBottom: '18px' }}>
        {t([I18Keys.accountReady])}
      </AppHeading>
      <StatusGood size="48px" />
    </>
  )
}
