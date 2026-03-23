/**
 * Logger singleton service definition.
 * Replaces direct `new LoggerService()` in Questpie constructor.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		// LoggerService is already created by the constructor before services init.
		// Return the existing instance for backward compat.
		const app = ctx.app;
		if (app?.logger) return app.logger;

		// Fallback: create from config
		const { LoggerService } = require("#questpie/server/integrated/logger/service.js");
		return new LoggerService(app?.config?.logger);
	});
