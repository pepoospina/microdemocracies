import { voiceApp } from './controllers/voice';
import { projectApp } from './controllers/project';

import { logger } from './instances/logger';

(global as any).logger = logger;

export const voice = voiceApp;
export const project = projectApp;
