import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'

import { ResponsiveApp, ThemedApp } from './components/app'
import { AppContainer } from './components/app/AppContainer'
import { AppLanguage } from './components/app/AppLanguage'
import { GlobalStyles } from './components/styles/GlobalStyles'
import { LoadingContext } from './contexts/LoadingContext'
import { SemaphoreContext } from './contexts/SemaphoreContext'
import { i18n } from './i18n/i18n'
import { AccountContext } from './wallet/AccountContext'
import { ConnectedWallet } from './wallet/ConnectedWalletContext'
import { SignerContext } from './wallet/SignerContext'

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
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
        </AppLanguage>
      </I18nextProvider>
    </div>
  )
}

export default App
