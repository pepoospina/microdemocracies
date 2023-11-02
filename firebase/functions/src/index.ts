import { voiceApp } from './voice';
import { logger } from './instances/logger';

(global as any).logger = logger;

export const voice = voiceApp;
