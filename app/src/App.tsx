import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { alchemyProvider as wagmiAlchemyProvider } from 'wagmi/providers/alchemy';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { ResponsiveApp, ThemedApp } from './components/app';

import { chain } from './wallet/config';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { ALCHEMY_KEY } from './config/appConfig';
import { ViewportContainer } from './components/app/Viewport';
import { SignerContext } from './wallet/SignerContext';
import { AccountContext } from './wallet/AccountContext';
import { SemaphoreContext } from './contexts/SemaphoreContext';

import { i18n } from './i18n/i18n';
import { AppLanguage } from './components/app/AppLanguage';
import { AppContainer } from './components/app/AppContainer';

const queryClient = new QueryClient();

function App() {
  const { publicClient, webSocketPublicClient } = configureChains(
    [chain],
    [wagmiAlchemyProvider({ apiKey: ALCHEMY_KEY })]
  );

  const config = createConfig({
    publicClient,
    webSocketPublicClient,
  });

  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
          <QueryClientProvider client={queryClient}>
            <WagmiConfig config={config}>
              <SignerContext>
                <AccountContext>
                  <SemaphoreContext>
                    <GlobalStyles />
                    <ThemedApp>
                      <ResponsiveApp>
                        <BrowserRouter>
                          <ViewportContainer>
                            <AppContainer></AppContainer>
                          </ViewportContainer>
                        </BrowserRouter>
                      </ResponsiveApp>
                    </ThemedApp>
                  </SemaphoreContext>
                </AccountContext>
              </SignerContext>
            </WagmiConfig>
          </QueryClientProvider>
        </AppLanguage>
      </I18nextProvider>
    </div>
  );
}

export default App;
