import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from 'react-query';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { MainPage } from './pages/MainPage';
import { ResponsiveApp, ThemedApp } from './components/app';
import { RegistryContext } from './contexts/RegistryContext';

import { config } from './wagmi/client';

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
