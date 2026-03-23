/**
 * Database singleton service definition.
 * Replaces direct drizzle initialization in Questpie constructor.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		// DB is initialized by the constructor before services.
		// Return the existing instance.
		const app = ctx.app;
		if (app?.db) return app.db;
		throw new Error("[Core] Database not initialized");
	});
