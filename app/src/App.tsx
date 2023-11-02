import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { GlobalStyles } from './components/styles/GlobalStyles';

import { MainPage } from './pages/MainPage';
import { ResponsiveApp, ThemedApp } from './components/app';
import { RegistryContext } from './contexts/RegistryContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { appConfig } from './config';

const { publicClient, webSocketPublicClient } = configureChains(
  [appConfig.CHAIN],
  [alchemyProvider({ apiKey: appConfig.ALCHEMY_KEY })]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <WagmiConfig config={config}>
        <GlobalStyles />
        <ThemedApp>
          <ResponsiveApp>
            <QueryClientProvider client={queryClient}>
              <RegistryContext>
                <MainPage></MainPage>
              </RegistryContext>
            </QueryClientProvider>
          </ResponsiveApp>
        </ThemedApp>
      </WagmiConfig>
    </div>
  );
}

export default App;
