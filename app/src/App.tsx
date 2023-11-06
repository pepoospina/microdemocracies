import { QueryClient, QueryClientProvider } from 'react-query';
import { alchemyProvider as wagmiAlchemyProvider } from 'wagmi/providers/alchemy';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { MainProjectPage } from './pages/MainProjectPage';
import { ResponsiveApp, ThemedApp } from './components/app';
import { RegistryContext } from './contexts/RegistryContext';

import { MainLandingPage } from './pages/MainLandingPage';
import { ProviderContext } from './wallet/ProviderContext';
import { chain } from './wallet/config';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { ALCHEMY_KEY } from './config/appConfig';

const queryClient = new QueryClient();

function App() {
  const parts = window.location.hostname.split('.');
  const isSubdomain = parts.length >= 2; // Simple check for subdomain

  /** WAGMI provider to read data */
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
      <WagmiConfig config={config}>
        <ProviderContext>
          <GlobalStyles />
          <ThemedApp>
            <ResponsiveApp>
              <QueryClientProvider client={queryClient}>
                <RegistryContext>
                  {isSubdomain ? (
                    <MainProjectPage projectId={parts[0]}></MainProjectPage>
                  ) : (
                    <MainLandingPage></MainLandingPage>
                  )}
                </RegistryContext>
              </QueryClientProvider>
            </ResponsiveApp>
          </ThemedApp>
        </ProviderContext>
      </WagmiConfig>
    </div>
  );
}

export default App;
