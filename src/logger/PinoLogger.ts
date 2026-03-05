import type { Logger } from './types.js';

export class PinoLogger implements Logger {
	constructor(private readonly pino: any) {}

	debug(msg: string, ctx?: unknown) {
		this.pino.debug(ctx, msg);
	}

	info(msg: string, ctx?: unknown) {
		this.pino.info(ctx, msg);
	}

	warn(msg: string, ctx?: unknown) {
		this.pino.warn(ctx, msg);
	}

	error(msg: string, ctx?: unknown) {
		this.pino.error(ctx, msg);
	}
}
