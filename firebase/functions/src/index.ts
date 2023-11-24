import { voiceApp } from './controllers/voice';
import { projectApp } from './controllers/project';
import { entityApp } from './controllers/entities';

import { logger } from './instances/logger';

(global as any).logger = logger;

export const entities = entityApp;
export const voice = voiceApp;
export const project = projectApp;
