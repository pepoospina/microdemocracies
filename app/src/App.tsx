import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { ResponsiveApp, ThemedApp } from './components/app';

import { SignerContext } from './wallet/SignerContext';
import { AccountContext } from './wallet/AccountContext';
import { SemaphoreContext } from './contexts/SemaphoreContext';

import { i18n } from './i18n/i18n';
import { AppLanguage } from './components/app/AppLanguage';
import { AppContainer } from './components/app/AppContainer';
import { ConnectedWallet } from './wallet/ConnectedWalletContext';

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
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
        </AppLanguage>
      </I18nextProvider>
    </div>
  );
}

export default App;
