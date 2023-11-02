import { configDev } from './config.dev';
import { configProd } from './config.prod';

export const appConfig = process.env.NODE_ENV === 'production' ? configProd : configDev;
