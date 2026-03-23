/**
 * Queue singleton service definition.
 */
import { service } from "#questpie/server/services/define-service.js";

export default service()
	.lifecycle("singleton")
	.namespace(null)
	.create((ctx: any) => {
		const app = ctx.app;
		if (app?.queue) return app.queue;
		return {}; // Empty queue if no adapter configured
	});
