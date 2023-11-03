import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from 'react-query';

import { GlobalStyles } from './components/styles/GlobalStyles';
import { MainProjectPage } from './pages/MainProjectPage';
import { ResponsiveApp, ThemedApp } from './components/app';
import { RegistryContext } from './contexts/RegistryContext';

import { config } from './wagmi/client';
import { MainLandingPage } from './pages/MainLandingPage';

const queryClient = new QueryClient();

function App() {
  const parts = window.location.hostname.split('.');
  const isSubdomain = parts.length >= 2; // Simple check for subdomain

  console.log({ isSubdomain, parts });

  return (
    <div className="App">
      <WagmiConfig config={config}>
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
      </WagmiConfig>
    </div>
  );
}

export default App;
