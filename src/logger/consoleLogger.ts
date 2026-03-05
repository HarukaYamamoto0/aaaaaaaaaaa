/** biome-ignore-all lint/suspicious/noConsole: Logger */
import type { Logger, LogLevel } from './types.js';

function format(level: LogLevel, message: string, context?: unknown) {
	const time = new Date().toISOString();
	return {
		time,
		level,
		message,
		context,
	};
}

export class ConsoleLogger implements Logger {
	debug(message: string, context?: unknown) {
		console.debug(format('debug', message, context));
	}

	info(message: string, context?: unknown) {
		console.info(format('info', message, context));
	}

	warn(message: string, context?: unknown) {
		console.warn(format('warn', message, context));
	}

	error(message: string, context?: unknown) {
		console.error(format('error', message, context));
	}
}
