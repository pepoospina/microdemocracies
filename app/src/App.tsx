import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'

import { ResponsiveApp, ThemedApp } from './components/app'
import { AppContainer } from './components/app/AppContainer'
import { AppLanguage } from './components/app/AppLanguage'
import { GlobalStyles } from './components/styles/GlobalStyles'
import { LoadingContext } from './contexts/LoadingContext'
import { SemaphoreContext } from './contexts/SemaphoreContext'
import { ToastNotificationsContext } from './contexts/ToastNotificationsContext'
import { i18n } from './i18n/i18n'
import { AccountContext } from './wallet/AccountContext'
import { ConnectedWallet } from './wallet/ConnectedWalletContext'
import { SignerContext } from './wallet/SignerContext'

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
          <ThemedApp>
            <ToastNotificationsContext>
              <LoadingContext>
                <ConnectedWallet>
                  <SignerContext>
                    <AccountContext>
                      <SemaphoreContext>
                        <GlobalStyles />
                        <ResponsiveApp>
                          <BrowserRouter>
                            <AppContainer></AppContainer>
                          </BrowserRouter>
                        </ResponsiveApp>
                      </SemaphoreContext>
                    </AccountContext>
                  </SignerContext>
                </ConnectedWallet>
              </LoadingContext>
            </ToastNotificationsContext>
          </ThemedApp>
        </AppLanguage>
      </I18nextProvider>
    </div>
  )
}

export default App
