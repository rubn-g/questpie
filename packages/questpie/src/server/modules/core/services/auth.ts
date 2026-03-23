/**
 * Auth singleton service definition.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.auth) return app.auth;
		throw new Error("[Core] Auth not initialized");
	});
