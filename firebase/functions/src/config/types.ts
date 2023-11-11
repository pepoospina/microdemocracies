import { ENVIRONMENTS } from './ENVIRONMENTS';

export interface Env {
  environment: ENVIRONMENTS;
  CHAIN_ID: number;
  CHAIN_NAME: string;
  ALCHEMY_KEY: string;
  ALCHEMY_SUBDOMAIN: string;
}
