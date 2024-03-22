import { I18nextProvider } from 'react-i18next';
import { AppLanguage } from './@app/components/app/AppLanguage';
import { ViewportContainer } from './@app/components/app/Viewport';
import { i18n } from './@app/i18n/i18n';
import { ResponsiveApp, ThemedApp } from './@app/components/app';
import { GlobalStyles } from './@app/components/styles/GlobalStyles';

import { LandingPage } from './components/landing/LandingPage';

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
          <GlobalStyles />
          <ThemedApp>
            <ResponsiveApp>
              <ViewportContainer>
                <LandingPage></LandingPage>
              </ViewportContainer>
            </ResponsiveApp>
          </ThemedApp>
        </AppLanguage>
      </I18nextProvider>
    </div>
  );
}

export default App;
