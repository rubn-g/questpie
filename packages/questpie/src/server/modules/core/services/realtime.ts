/**
 * Realtime singleton service definition.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.realtime) return app.realtime;
		throw new Error("[Core] Realtime not initialized");
	});
