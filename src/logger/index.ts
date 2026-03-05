import { ConsoleLogger } from './consoleLogger.js';
import type { Logger } from './types.js';

export const logger: Logger = new ConsoleLogger();
export * from './types.js';
