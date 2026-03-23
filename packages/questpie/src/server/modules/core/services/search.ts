/**
 * Search singleton service definition.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.search) return app.search;
		throw new Error("[Core] Search not initialized");
	});
