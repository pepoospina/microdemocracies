import { I18nextProvider } from 'react-i18next';
import { AppLanguage } from './@app/components/app/AppLanguage';
import { ViewportContainer } from './@app/components/app/Viewport';
import { i18n } from './@app/i18n/i18n';
import { LandingPage } from './components/landing/LandingPage';

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AppLanguage>
          <ViewportContainer>
            <LandingPage></LandingPage>
          </ViewportContainer>
        </AppLanguage>
      </I18nextProvider>
    </div>
  );
}

export default App;
