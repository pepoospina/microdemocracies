import { Chain, localhost } from 'wagmi/chains';

export interface Env {
  DEBUG: boolean;
  ALCHEMY_KEY: string;
  WEB3_STORAGE_KEY: string;
  FUNCTIONS_BASE: string;
  CHAIN: Chain;
}

export const configDev: Env = {
  DEBUG: true,
  ALCHEMY_KEY: '9_KaUJ0DnMqDMpe9Jt1d_eXx554ooAtG',
  WEB3_STORAGE_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY4YUNjNTRiNWVlQTc5YTZERUZCNGVhMWYxYjdlNTU3MGZlYmZBNTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc4MTc5OTYwODgsIm5hbWUiOiJuZXR3b3JrLXN0YXRlIn0.wyU65ZzFZqIHaRQeRbDuoPwyK93GBtDDWUwC3cYBg-8',
  FUNCTIONS_BASE: 'https://europe-west1-network-state-registry.cloudfunctions.net',
  CHAIN: localhost,
};
