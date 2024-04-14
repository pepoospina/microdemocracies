import { voiceApp } from './controllers/voice';
import { projectApp } from './controllers/project';
import { entityApp } from './controllers/entities';
import { usersApp } from './controllers/users';

import { logger } from './instances/logger';

(global as any).logger = logger;

export const entities = entityApp;
export const voice = voiceApp;
export const project = projectApp;
export const user = usersApp;

