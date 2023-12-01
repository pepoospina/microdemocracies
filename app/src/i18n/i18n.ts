import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        appName: 'micro(r)evolutions',
        startNow: 'start now',
        startNew: 'start new',
        next: 'next',
        openApp: 'open app',
        noProjects: 'Your have not joined or started any micro(r)evolution yet.',
        yourProjects: `Your micro(r)evolutions`,
        carousel01: 'Find something you know <Bold>need</Bold> to change',
        carousel01sub: 'Dare others to change it, <Bold>together</Bold>',
        carousel02: 'Talk <Bold>without fear</Bold>',
        carousel02sub: 'Post <Bold>anonymously</Bold> into the community board, but only if you are a member',
        carousel03: 'Amplify your <Bold>voice</Bold>',
        carousel03sub: 'Anonymously <Bold>back</Bold> the statements you agree with',
        carousel04: 'Raise and spend funds <Bold>transparently</Bold>',
        carousel04sub: '<Bold>Collectively</Bold> control the community funds, no banks need. (coming soon)',
        connectWallet: 'Connect your Web3 Wallet',
        connectWalletBtn: 'Connect Wallet',
        notFound: 'not found',
        connectWithEmail: 'Connect with your email',
        connectWithEmailBtn: 'Signin with email',
        accountReady: 'Account Ready',
      },
    },
    ca: {
      translation: {
        appName: 'micro(r)evolucions',
        startNow: 'Comença',
        next: 'Avança',
        openApp: "Obre l'App",
        noProjects: 'Encara no us heu unit ni heu iniciat cap micro(r)evolució.',
        carousel01: 'Troba algo que tu <Bold>saps</Bold> ha de canviar',
        carousel01sub: 'Gosa els altres a canviar-ho, <Bold>junts</Bold>',
        carousel02: 'Parla <Bold>sensa por</Bold>',
        carousel02sub: 'Publica <Bold>de manera anònima</Bold> al tauler de la comunitat, però només si ets membre',
        carousel03: 'Amplifica la teva <Bold>veu</Bold>',
        carousel03sub: "Dona suport <Bold>de manera anonima</Bold> a les declaracions amb les quals estiguis d'acord",
        carousel04: 'Recapta i gestiona fons <Bold>de manera transparent</Bold>',
        carousel04sub: 'Controla <Bold>col·lectivament</Bold> com gestionar els fons comunitaris, sense bancs',
      },
    },
    // Add other languages here
  },
  lng: 'en', // default language
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
