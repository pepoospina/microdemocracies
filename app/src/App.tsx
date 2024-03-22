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
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
          <ToastNotificationsContext>
            <LoadingContext>
              <ConnectedWallet>
                <SignerContext>
                  <AccountContext>
                    <SemaphoreContext>
                      <GlobalStyles />
                      <ThemedApp>
                        <ResponsiveApp>
                          <BrowserRouter>
                            <AppContainer></AppContainer>
                          </BrowserRouter>
                        </ResponsiveApp>
                      </ThemedApp>
                    </SemaphoreContext>
                  </AccountContext>
                </SignerContext>
              </ConnectedWallet>
            </LoadingContext>
          </ToastNotificationsContext>
        </AppLanguage>
      </I18nextProvider>
    </div>
  )
}

export default App
